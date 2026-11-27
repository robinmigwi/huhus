const SHELL_CACHE = "huhus-shell-v3";
const RUNTIME_CACHE = "huhus-runtime-v3";
const SHELL_FILES = [
  "/",
  "/index.html",
  "/offers",
  "/manifest.webmanifest",
  "/offline.html",
  "/icons/huhus-icon-192.png",
  "/icons/huhus-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL_FILES);

    // Pre-cache Vite's fingerprinted JS and CSS bundles so the app shell can reopen offline.
    try {
      const response = await fetch("/");
      if (response.ok) {
        const html = await response.clone().text();
        const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)]
          .map((match) => match[1])
          .filter((path) => path.startsWith("/"));
        await Promise.all(assets.map(async (path) => {
          try {
            const assetResponse = await fetch(path);
            if (assetResponse.ok) await cache.put(path, assetResponse);
          } catch {}
        }));
      }
    } catch {}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) =>
      name.startsWith("huhus-") && ![SHELL_CACHE, RUNTIME_CACHE].includes(name)
    ).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
          const cache = await caches.open(SHELL_CACHE);
          await cache.put("/", fresh.clone());
          await cache.put("/index.html", fresh.clone());
        }
        return fresh;
      } catch {
        return (await caches.match(request)) ||
          (await caches.match("/")) ||
          (await caches.match("/offline.html"));
      }
    })());
    return;
  }

  // Cache the Huhu's hosted logo and pizza image too, so previously viewed food artwork
  // remains available when the device temporarily loses connectivity.
  const trustedImageHost = url.hostname === "huhuspizza.co.ke";
  if (!sameOrigin && !trustedImageHost) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === "opaque")) {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return cached || Response.error();
    }
  })());
});
