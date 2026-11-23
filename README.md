# Huhu's Ordering Demo

A customer-side menu and ordering experience prototype for Huhu's Pizza & Grill.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Demo scope

- Browse and search the menu by category.
- Select pizza sizes and coffee options.
- Add products to a cart and adjust quantities.
- Choose delivery or collection and enter sample checkout details.
- Generate a simulated order confirmation.

**Demo-only:** checkout does not take payments, transmit orders to Huhu's, send messages, or store customer details. Prices and offers are transcribed from the supplied Huhu's website content and menu artwork for demonstration, not independently verified as current.

## Deployment

Cloudflare Pages project: `huhus-ordering-demo`  
Production branch for this isolated demo project: `demo/huhus-ordering`  
Build command: `npm run build`  
Build output: `dist`

## Progressive Web App

The customer ordering demo is configured as an installable PWA.

- Web app manifest: `/manifest.webmanifest`
- App icons: `/icons/huhus-icon-192.png` and `/icons/huhus-icon-512.png`
- Service worker: `/sw.js`
- Display mode: standalone
- The service worker caches the app shell and its built JS/CSS bundles, and caches viewed Huhu's-hosted food images.
- The demo cart is saved locally on the device.

Install guidance is available from the **Install app** button. On iPhone/iPad, use Safari's Share menu and choose **Add to Home Screen**.

The app needs an initial online visit to install and cache its resources. Offline availability is best after the first visit has completed and the service worker has taken control.
