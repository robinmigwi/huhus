document.body.classList.add("offers-route");
const app = document.querySelector("#app");
const logo = "https://huhuspizza.co.ke/sites/default/files/Huhus_logo.png";
const offers = [
  { title: "Burger Combo", image: new URL("../huhus/daily offers/burger combo.jpg", import.meta.url).href, alt: "Huhu's Burger Combo with fries and 350ml soda for KES 650" },
  { title: "Wednesday 2-Piecer", image: new URL("../huhus/daily offers/huhus-2piecer-offers every wednesday.jpg", import.meta.url).href, alt: "Wednesday 2 pieces of chicken with fries and coleslaw for KES 400, 3 to 6pm" },
  { title: "Veggie Rice Combo", image: new URL("../huhus/daily offers/Huhus-Veggie-combo.jpg", import.meta.url).href, alt: "Huhu's Veggie Rice Combo for KES 600" },
  { title: "Super Tuesday Pizza", image: new URL("../huhus/daily offers/Huhus_PIZZA_OFFER every wednesday.jpg", import.meta.url).href, alt: "Huhu's Super Tuesday Buy 1 Get 1 Free pizza offer" }
];
const cards = offers.map((offer, index) => [
  '<article class="offers-page-card">',
  '<div class="offers-page-art"><img src="', offer.image, '" alt="', offer.alt, '" loading="', index < 2 ? "eager" : "lazy", '"></div>',
  '<div class="offers-page-card-foot"><span>', offer.title, '</span><a href="/#menu-section">Browse menu <span>↗</span></a></div>',
  '</article>'
].join("")).join("");
app.innerHTML = [
  '<div class="preview-strip"><span class="preview-pulse"></span><b>PREVIEW ENVIRONMENT</b><span>Orders are for demonstration only</span></div>',
  '<header class="site-header">',
  '<a class="brand" href="/" aria-label="Huhu&#39;s home"><img src="', logo, '" alt="Huhu&#39;s Pizza & Grill logo"><span class="brand-wordmark">HUHU&#39;S <small>PIZZA & GRILL</small></span></a>',
  '<nav class="desktop-nav" aria-label="Main navigation"><a href="/#menu-section">Menu</a><a href="/offers" class="nav-active">Offers</a><a href="https://www.google.com/maps/search/?api=1&query=Total+Energies%2C+Kitisuru+Place%2C+Getathuru+Road%2C+Nairobi" target="_blank" rel="noopener">Find us</a></nav>',
  '<div class="header-actions"><a class="install-app" href="/#menu-section">Order online <span>↗</span></a></div>',
  '</header>',
  '<main class="offers-page">',
  '<section class="offers-page-intro"><div class="eyebrow dark-eyebrow"><span class="eyebrow-line"></span> GOOD FOOD, GOOD VALUE</div><h1>Offers worth<br>making room for<span>.</span></h1><p>Explore Huhu&#39;s promotions and pick your next favourite.</p><a class="offers-back-link" href="/#menu-section">Browse the full menu <span>↗</span></a></section>',
  '<section class="offers-page-grid" aria-label="All Huhu&#39;s offers">', cards, '</section>',
  '</main>',
  '<footer class="site-footer"><a class="footer-brand" href="/"><img src="', logo, '" alt="Huhu&#39;s Pizza & Grill"><span>HUHU&#39;S <small>PIZZA & GRILL</small></span></a><nav><a href="/#menu-section">Menu</a><a href="/offers">Offers</a><a href="https://www.google.com/maps/search/?api=1&query=Total+Energies%2C+Kitisuru+Place%2C+Getathuru+Road%2C+Nairobi" target="_blank" rel="noopener">Find us</a></nav><span class="footer-demo">Ordering preview</span></footer>'
].join("");
