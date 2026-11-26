import "./styles.css";
import { menuImageMap, categoryImageMap } from "./menu-images.js";

if (window.location.pathname.startsWith("/admin")) {
  import("./admin.js");
} else {

const imageAssets = {
  chicken: new URL("../huhus/1.jpg", import.meta.url).href,
  burger: new URL("../huhus/Crunchy_Burger.jpg", import.meta.url).href,
  burgerOffer: new URL("../huhus/Burger_Offer.jpg", import.meta.url).href,
  chickenOffer: new URL("../huhus/Huhus_Fried_Chicken_Offer.jpg", import.meta.url).href,
  coffee: new URL("../huhus/COFFEE.jpeg", import.meta.url).href,
  juices: new URL("../huhus/JUICES.jpeg", import.meta.url).href,
};

const pizzaImage = "https://huhuspizza.co.ke/sites/default/files/default_images/chicken%20hawaiin-pizza.PNG";
const logoImage = "https://huhuspizza.co.ke/sites/default/files/Huhus_logo.png";

let categories = [
  { id: "Pizza", label: "Pizza", image: pizzaImage, intro: "Classic favourites, loaded with toppings." },
  { id: "Burgers", label: "Burgers", image: imageAssets.burger, intro: "Crispy chicken and stacked beef burgers." },
  { id: "Chicken & Sides", label: "Chicken & Sides", image: imageAssets.chicken, intro: "Crunchy chicken, popcorn and fries." },
  { id: "Offers", label: "Offers", image: imageAssets.chickenOffer, intro: "Meals made for sharing." },
  { id: "Coffee", label: "Coffee", image: imageAssets.coffee, intro: "Espresso favourites, made your way." },
  { id: "Tea & Hot Drinks", label: "Tea & Hot Drinks", image: imageAssets.coffee, intro: "A warm cup, any time of day." },
  { id: "Ice Cream", label: "Ice Cream", image: imageAssets.coffee, intro: "A little something sweet." },
  { id: "Milkshakes", label: "Milkshakes", image: imageAssets.juices, intro: "Thick, creamy and full of flavour." },
  { id: "Fresh Juices", label: "Fresh Juices", image: imageAssets.juices, intro: "Fresh fruit, bright flavours." },
  { id: "Healthy Blends", label: "Healthy Blends", image: imageAssets.juices, intro: "Fruit and vegetable blends." },
  { id: "Smoothies", label: "Smoothies", image: imageAssets.juices, intro: "Blended favourites and feel-good mixes." },
  { id: "Fruit Salads", label: "Fruit Salads", image: imageAssets.juices, intro: "Fresh fruit with optional extras." },
];

let menu = [
  { id: "pizza-meat-deluxe", category: "Pizza", name: "Meat Deluxe", description: "BBQ steak, boerewors, macon and pepperoni.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: pizzaImage, badge: "Huhu's favourite" },
  { id: "pizza-hawaiian", category: "Pizza", name: "Hawaiian", description: "Macon and pineapples.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: pizzaImage },
  { id: "pizza-four-seasons", category: "Pizza", name: "Four Seasons", description: "Pepperoni, tomatoes, black olives, onions and green pepper.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: pizzaImage },
  { id: "pizza-pepperoni", category: "Pizza", name: "Pepperoni", description: "Beef pepperoni.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: pizzaImage },
  { id: "pizza-chicken-macon-bbq", category: "Pizza", name: "Chicken Macon BBQ", description: "Marinated chicken, macon, onions and pepper.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: pizzaImage },

  { id: "burger-crunchy-chicken", category: "Burgers", name: "Crunchy Chicken Burger", description: "A crunchy chicken burger.", price: 600, image: imageAssets.burger },
  { id: "burger-crunchy-chicken-fries", category: "Burgers", name: "Crunchy Chicken Burger + Fries", description: "Crunchy chicken burger served with fries.", price: 700, image: imageAssets.burger },
  { id: "burger-chicken-tower", category: "Burgers", name: "Chicken Tower Burger Combo", description: "Chicken tower burger, 350ml soda and fries.", price: 980, image: imageAssets.burger },
  { id: "burger-beef-tower", category: "Burgers", name: "Beef Tower Burger Combo", description: "Beef tower burger, 350ml soda and fries.", price: 650, image: imageAssets.burger },
  { id: "burger-double-beef", category: "Burgers", name: "Double Beef Burger", description: "Double beef burger.", price: 900, image: imageAssets.burger },

  { id: "chicken-piece", category: "Chicken & Sides", name: "1 Piece", description: "Crispy fried chicken.", price: 200, image: imageAssets.chicken },
  { id: "chicken-one-piecer", category: "Chicken & Sides", name: "1 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 300, image: imageAssets.chicken },
  { id: "chicken-two-piecer", category: "Chicken & Sides", name: "2 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 450, image: imageAssets.chicken },
  { id: "chicken-three-piecer", category: "Chicken & Sides", name: "3 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 650, image: imageAssets.chicken },
  { id: "chicken-six-piecer", category: "Chicken & Sides", name: "6 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 1250, image: imageAssets.chicken },
  { id: "chicken-popcorn-small", category: "Chicken & Sides", name: "Chicken Popcorn — Small", description: "Crispy chicken popcorn.", price: 250, image: imageAssets.chicken },
  { id: "chicken-popcorn-large", category: "Chicken & Sides", name: "Chicken Popcorn — Large", description: "Crispy chicken popcorn.", price: 400, image: imageAssets.chicken },
  { id: "side-regular-fries", category: "Chicken & Sides", name: "Regular Fries", description: "A serving of fries.", price: 200, image: imageAssets.chicken },

  { id: "offer-burger-combo", category: "Offers", name: "Huhu's Burger Combo", description: "Burger, fries and Coca-Cola.", price: 650, image: imageAssets.burgerOffer, badge: "Combo offer" },
  { id: "offer-family-feast", category: "Offers", name: "Crunchy Family Feast", description: "12 pieces chicken, 2 chips, 2 coleslaw and 2-litre soda.", price: 2700, image: imageAssets.chickenOffer, badge: "Family feast" },

  { id: "coffee-espresso", category: "Coffee", name: "Espresso", variants: [{ label: "Single", price: 200 }, { label: "Double", price: 250 }], image: imageAssets.coffee },
  { id: "coffee-cappuccino", category: "Coffee", name: "Cappuccino", variants: [{ label: "Single", price: 250 }, { label: "Double", price: 300 }], image: imageAssets.coffee },
  { id: "coffee-mocha", category: "Coffee", name: "Caffè Mocha", variants: [{ label: "Single", price: 300 }, { label: "Double", price: 350 }], image: imageAssets.coffee },
  { id: "coffee-macchiato", category: "Coffee", name: "Caffè Macchiato", variants: [{ label: "Single", price: 200 }, { label: "Double", price: 250 }], image: imageAssets.coffee },
  { id: "coffee-latte", category: "Coffee", name: "Caffè Latte", variants: [{ label: "Single", price: 250 }, { label: "Double", price: 300 }], image: imageAssets.coffee },
  { id: "coffee-americano", category: "Coffee", name: "Americano", variants: [{ label: "Single", price: 200 }, { label: "Double", price: 250 }], image: imageAssets.coffee },
  { id: "coffee-latte-macchiato", category: "Coffee", name: "Latte Macchiato", variants: [{ label: "Single", price: 300 }, { label: "Double", price: 350 }], image: imageAssets.coffee },
  { id: "coffee-iced", category: "Coffee", name: "Iced Coffee", variants: [{ label: "Single", price: 250 }, { label: "Double", price: 300 }], image: imageAssets.coffee },
  { id: "coffee-flat-white", category: "Coffee", name: "Flat White Coffee", variants: [{ label: "Single", price: 250 }], image: imageAssets.coffee },

  ...[
    ["African Tea", 150], ["Masala Tea", 200], ["Herbal Tea", 150], ["Lemon Tea", 150],
    ["Cardamom Tea", 200], ["Iced Tea", 200], ["Dawa", 250], ["Cup of Milk", 200],
    ["White Chocolate", 200], ["Black Chocolate", 200], ["White Cocoa", 250],
  ].map(([name, price]) => ({ id: "tea-" + slug(name), category: "Tea & Hot Drinks", name, description: "A Huhu's hot drink favourite.", price, image: imageAssets.coffee })),

  { id: "ice-cream-cone", category: "Ice Cream", name: "Ice Cream Cone", description: "One ice cream cone.", price: 100, image: imageAssets.coffee },
  { id: "ice-cream-small", category: "Ice Cream", name: "Ice Cream Cup — Small", description: "Small ice cream cup.", price: 200, image: imageAssets.coffee },
  { id: "ice-cream-big", category: "Ice Cream", name: "Ice Cream Cup — Big", description: "Big ice cream cup.", price: 250, image: imageAssets.coffee },

  ...[
    ["Vanilla", 300], ["Blueberry", 300], ["Strawberry", 300], ["Chocolate", 300], ["Pina Colada", 300],
    ["Espresso", 370], ["Double Espresso", 450], ["Bubblegum", 300], ["Banana", 300], ["Lime", 300], ["Oreo", 350],
  ].map(([name, price]) => ({ id: "shake-" + slug(name), category: "Milkshakes", name, description: "A creamy Huhu's milkshake.", price, image: imageAssets.juices })),

  { id: "blend-hydrant", category: "Healthy Blends", name: "Hydrant Shot", description: "Cucumber, celery, lime, ginger and apple/pineapple.", price: 400, image: imageAssets.juices },
  { id: "blend-revital", category: "Healthy Blends", name: "Revital", description: "Orange, carrot, apple, lime and ginger.", price: 400, image: imageAssets.juices },
  { id: "blend-iron-blocks", category: "Healthy Blends", name: "Iron Blocks", description: "Beetroot, pineapple, cucumber, spinach and ginger.", price: 400, image: imageAssets.juices },
  { id: "blend-vit-boost", category: "Healthy Blends", name: "Vit-Boost", description: "Lime, ginger, apple, parsley and celery.", price: 400, image: imageAssets.juices },
  { id: "blend-make-own", category: "Healthy Blends", name: "Make Your Own", description: "Choose up to 5 ingredients for a personalised blend.", price: 400, image: imageAssets.juices },

  ...[
    ["Apple", 480], ["Orange", 480], ["Mango", 380], ["Passion", 380], ["Pine-Mint", 380],
    ["Sugarcane", 380], ["Tree Tomato", 380], ["Carrot Juice", 380], ["Super Berry Juice", 480],
    ["Watermelon", 380], ["Pawpaw Juice", 380], ["Cocktail Juice", 400],
  ].map(([name, price]) => ({ id: "juice-" + slug(name), category: "Fresh Juices", name, description: "Freshly prepared fruit juice.", price, image: imageAssets.juices })),

  { id: "smoothie-berry-best", category: "Smoothies", name: "Berry Best", description: "Strawberries, raspberries, blueberries and natural or vanilla yoghurt.", price: 450, image: imageAssets.juices },
  { id: "smoothie-daily-tropical", category: "Smoothies", name: "Daily Tropical", description: "Mango, one of the berries, banana and natural or vanilla yoghurt.", price: 450, image: imageAssets.juices },
  { id: "smoothie-berry-squeeze", category: "Smoothies", name: "Berry Squeeze", description: "Mixed berries, apple and yoghurt.", price: 450, image: imageAssets.juices },
  { id: "smoothie-lean-green", category: "Smoothies", name: "Lean Green", description: "Mango, banana, pineapple, spinach and chia seeds.", price: 400, image: imageAssets.juices },
  { id: "smoothie-paso-mango", category: "Smoothies", name: "Paso Mango", description: "Mango, passion and strawberry.", price: 400, image: imageAssets.juices },
  { id: "smoothie-tropical-fuse", category: "Smoothies", name: "Tropical Fuse", description: "Mango, pineapple, banana and passion.", price: 400, image: imageAssets.juices },
  { id: "smoothie-pre-pro-kick", category: "Smoothies", name: "Pre-Pro Kick", description: "Banana, one of the berries, yoghurt, chia seeds and whey.", price: 550, image: imageAssets.juices },
  { id: "smoothie-post-pro-kick", category: "Smoothies", name: "Post-Pro Kick", description: "Mixed nuts, banana, yoghurt and whey.", price: 550, image: imageAssets.juices },
  { id: "smoothie-super-choco-kick", category: "Smoothies", name: "Super Choco Kick", description: "Espresso, banana, milk, peanuts and whey.", price: 550, image: imageAssets.juices },

  { id: "salad-fruit", category: "Fruit Salads", name: "Assorted Fruit Salad", description: "Assorted fresh fruit.", price: 450, image: imageAssets.juices },
  { id: "salad-fruit-honey", category: "Fruit Salads", name: "Fruit Salad with Honey, Yoghurt & Nuts", description: "Assorted fruit with honey, yoghurt and nuts.", price: 550, image: imageAssets.juices },
];

menu = menu.map((item) => ({ ...item, image: menuImageMap[item.id] || item.image }));
categories = categories.map((category) => ({ ...category, image: categoryImageMap[category.id] || category.image }));

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const money = (amount) => new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(amount);
function loadSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("huhus-demo-cart") || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) => item && typeof item.key === "string" && typeof item.name === "string" &&
      Number.isFinite(item.price) && Number.isInteger(item.qty) && item.qty > 0);
  } catch {
    return [];
  }
}
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

const state = {
  activeCategory: "All",
  query: "",
  cart: loadSavedCart(),
  cartOpen: false,
  checkoutOpen: false,
  orderPlaced: false,
  fulfilment: "Delivery",
};

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="demo-ribbon"><span></span> ORDERING PREVIEW <span class="ribbon-note">Test orders appear in the Huhu’s management dashboard</span><span class="network-status" id="network-status">Online</span></div>
  <header class="site-header">
    <a class="brand" href="#" aria-label="Huhu's home"><img src="${logoImage}" alt="Huhu's Pizza & Grill logo"><span class="brand-wordmark">HUHU'S <small>PIZZA & GRILL</small></span></a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="#menu-section" class="nav-active">Menu</a>
      <a href="#why-huhus">Why Huhu's</a>
      <a href="#visit-us">Find us</a>
    </nav>
    <button class="install-app" id="install-app" type="button" aria-label="Install Huhu's app">↓ <span>Install app</span></button>
    <button class="header-cart" id="open-cart" aria-label="Open cart">
      <span class="cart-icon">🛒</span><span class="cart-label">Your order</span><span class="cart-count" id="cart-count">0</span>
    </button>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-line"></span> GOOD FOOD. GOOD MOOD.</div>
        <h1>Big flavour.<br><em>Made to share.</em></h1>
        <p>Pizza nights, crunchy chicken, stacked burgers and fresh favourites. Find your next Huhu's craving.</p>
        <div class="hero-actions">
          <a class="primary-cta" href="#menu-section">Explore the menu <span>↗</span></a>
          <div class="hero-hours"><span class="live-dot"></span><span>Open daily<br><b>8:00 AM – 11:00 PM</b></span></div>
        </div>
        <div class="hero-proof"><span>🍕</span> Pizza <i></i><span>🍗</span> Flame grilled chicken <i></i><span>🥤</span> Fresh drinks</div>
      </div>
      <div class="hero-art">
        <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
        <div class="hero-image-main"><img src="${pizzaImage}" alt="Huhu's pizza"></div>
        <div class="hero-sticker"><b>MADE</b><span>FOR</span><b>SHARING</b><small>HUHU'S GOODNESS</small></div>
        <div class="hero-caption"><span class="caption-dot"></span> Your table is waiting</div>
      </div>
      <div class="hero-bottom-mark">HUHU'S PIZZA & GRILL <span>•</span> KITISURU, NAIROBI</div>
    </section>

    <section class="quick-highlights" id="why-huhus">
      <div><span class="highlight-icon">🍕</span><span><b>Pizza favourites</b><small>Choose your size</small></span></div>
      <div><span class="highlight-icon">🍗</span><span><b>Crunchy chicken</b><small>Made for sharing</small></span></div>
      <div><span class="highlight-icon">🍔</span><span><b>Burgers & combos</b><small>Big bites, bold flavour</small></span></div>
      <div><span class="highlight-icon">🥤</span><span><b>Freshly blended</b><small>Juices and smoothies</small></span></div>
    </section>

    <section class="menu-section" id="menu-section">
      <div class="section-heading">
        <div><div class="eyebrow dark-eyebrow"><span class="eyebrow-line"></span> PICK YOUR FAVOURITES</div><h2>The Huhu's menu</h2><p>What are you in the mood for today?</p></div>
        <div class="menu-search"><span>⌕</span><input id="menu-search" type="search" placeholder="Search the menu..." aria-label="Search menu"><kbd>⌘ K</kbd></div>
      </div>
      <div class="category-bar" id="category-bar"></div>
      <div class="menu-meta"><span id="results-label">Showing all menu items</span><span>Prices in <b>KES</b></span></div>
      <div class="product-grid" id="product-grid"></div>
    </section>

    <section class="promo-band">
      <div class="promo-copy"><div class="eyebrow"><span class="eyebrow-line"></span> MADE FOR THE WHOLE CREW</div><h2>Good food is<br><em>better together.</em></h2><p>Bring everyone to the table with Huhu's sharing offers.</p><button class="light-cta" data-go-category="Offers">See sharing offers <span>↗</span></button></div>
      <div class="promo-photos"><img src="${imageAssets.chickenOffer}" alt="Huhu's chicken family feast"><img src="${imageAssets.burgerOffer}" alt="Huhu's burger combo"></div>
    </section>

    <section class="visit-section" id="visit-us">
      <div><div class="eyebrow dark-eyebrow"><span class="eyebrow-line"></span> COME THROUGH</div><h2>Find your way<br>to <em>Huhu's.</em></h2><p>Visit us at Total Energies, Kitisuru Place, Getathuru Road, Nairobi.</p></div>
      <div class="visit-details"><div><span class="detail-icon">📍</span><span><small>FIND US</small><b>Total Energies, Kitisuru Place<br>Getathuru Road, Nairobi</b></span></div><div><span class="detail-icon">☎</span><span><small>CALL TO ORDER</small><b>+254 743 830 555</b></span></div><div><span class="detail-icon">◷</span><span><small>OPEN DAILY</small><b>Monday – Sunday · 8:00 AM – 11:00 PM</b></span></div><a class="visit-call" href="tel:+254743830555">Call Huhu's <span>↗</span></a></div>
    </section>
  </main>

  <footer class="site-footer"><a class="footer-brand" href="#"><img src="${logoImage}" alt=""><span>HUHU'S <small>PIZZA & GRILL</small></span></a><p>Good food. Good mood. Always.</p><span class="footer-demo">Concept ordering demo by DigiGuru</span></footer>

  <div class="overlay" id="overlay"></div>
  <aside class="cart-drawer" id="cart-drawer" aria-label="Your order" aria-hidden="true">
    <div class="drawer-head"><div><small>HUHU'S ORDERING</small><h2>Your order <span id="drawer-count">(0)</span></h2></div><button class="icon-button" id="close-cart" aria-label="Close cart">×</button></div>
    <div class="cart-content" id="cart-content"></div>
    <div class="cart-foot" id="cart-foot"></div>
  </aside>

  <div class="checkout-modal" id="checkout-modal" aria-hidden="true">
    <div class="checkout-card">
      <div class="drawer-head"><div><small>ALMOST THERE</small><h2>Order details</h2></div><button class="icon-button" id="close-checkout" aria-label="Close checkout">×</button></div>
      <div class="demo-warning"><b>Test ordering environment</b><span>Your order will be saved in Huhu’s management dashboard for this demonstration. It will not be sent to restaurant staff for fulfilment.</span></div>
      <form id="checkout-form">
        <div class="fulfilment-switch"><button type="button" class="fulfilment-option selected" data-fulfilment="Delivery">Delivery</button><button type="button" class="fulfilment-option" data-fulfilment="Collection">Collection</button></div>
        <label>Your name<input name="customerName" required placeholder="e.g. Alex Mwangi"></label>
        <label>Phone number<input name="phone" type="tel" required placeholder="07xx xxx xxx"></label>
        <label id="address-field">Delivery location<input name="address" placeholder="Estate, street or landmark"></label>
        <label>Payment method<select name="paymentMethod" id="payment-method"><option value="cash">Pay on delivery / collection</option><option value="mpesa" disabled>M-Pesa (Daraja connection required)</option></select></label>
        <p class="secure-note" id="payment-note">M-Pesa will use a real Safaricom payment request once Huhu’s Daraja account is connected.</p>
        <label>Order notes <textarea name="notes" rows="2" placeholder="Anything we should know? (optional)"></textarea></label>
        <div class="checkout-total"><span>Order total</span><b id="checkout-total">KES 0</b></div>
        <button class="place-order" type="submit">Submit order <span>↗</span></button>
        <p class="secure-note">🔒 Order details are submitted to Huhu’s ordering system.</p>
      </form>
    </div>
  </div>

  <div class="success-modal" id="success-modal" aria-hidden="true">
    <div class="success-card"><div class="success-check">✓</div><div class="eyebrow dark-eyebrow" id="success-eyebrow">ORDER SAVED</div><h2 id="success-title">Order received</h2><p id="success-message">Your test order has been saved to Huhu’s management dashboard.</p><div class="success-ref" id="success-ref"></div><button id="success-done" class="place-order">Back to menu</button></div>
  </div>
  <div class="install-help-modal" id="install-help-modal" aria-hidden="true">
    <div class="install-help-card">
      <button class="icon-button install-help-close" id="close-install-help" aria-label="Close install instructions">×</button>
      <div class="install-app-mark">H</div>
      <div class="eyebrow dark-eyebrow">TAKE HUHU'S WITH YOU</div>
      <h2 id="install-help-title">Install the Huhu's app</h2>
      <p class="install-help-intro" id="install-help-intro">Add Huhu's to your device for an app-style experience and quicker access to the menu.</p>
      <div class="install-steps" id="install-steps">
        <div><b>Android</b><span>In Chrome, open the browser menu (⋮) and choose “Install app” or “Add to Home screen”.</span></div>
        <div><b>iPhone or iPad</b><span>In Safari, tap Share, choose “Add to Home Screen”, turn on “Open as Web App” if shown, then tap Add.</span></div>
      </div>
      <p class="install-note" id="install-note" aria-live="polite"></p>
      <button class="place-order" id="close-install-help-done" type="button">Got it</button>
    </div>
  </div>
  <div class="toast" id="toast" role="status"></div>
  <button class="chat-launcher" id="chat-launcher" type="button">Chat with Huhu’s <span>💬</span></button>
  <section class="chat-panel" id="chat-panel" aria-label="Huhu’s conversation preview" aria-hidden="true">
    <header class="chat-head"><div><b>Huhu’s assistant</b><small>Demo conversation · Not connected to WhatsApp</small></div><button type="button" id="chat-close">×</button></header>
    <div class="chat-messages" id="chat-messages"><div class="chat-message assistant">Hi! Welcome to Huhu’s. I can help you explore the menu, understand delivery and collection, or explain how ordering works.</div></div>
    <div class="chat-suggestions"><button type="button" data-chat-prompt="Show me the menu">Explore menu</button><button type="button" data-chat-prompt="Do you deliver?">Delivery</button><button type="button" data-chat-prompt="What are your opening hours?">Opening hours</button></div>
    <form id="chat-form" class="chat-compose"><input id="chat-input" placeholder="Ask Huhu’s something..." autocomplete="off"><button type="submit">Send</button></form>
  </section>
`;

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function getVisibleItems() {
  return menu.filter((item) => {
    const matchesCategory = state.activeCategory === "All" || item.category === state.activeCategory;
    const text = (item.name + " " + item.description + " " + item.category).toLowerCase();
    const matchesQuery = text.includes(state.query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });
}

function formatPrice(item) {
  if (item.variants?.length) {
    const values = item.variants.map((variant) => variant.price);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return min === max ? `KES ${money(min)}` : `From KES ${money(min)}`;
  }
  return `KES ${money(item.price)}`;
}

function renderCategories() {
  const holder = document.querySelector("#category-bar");
  const allCount = menu.length;
  holder.innerHTML = `<button class="category-chip ${state.activeCategory === "All" ? "active" : ""}" data-category="All"><span>✦</span> All menu <small>${allCount}</small></button>` +
    categories.map((category) => {
      const count = menu.filter((item) => item.category === category.id).length;
      return `<button class="category-chip ${state.activeCategory === category.id ? "active" : ""}" data-category="${escapeHtml(category.id)}"><span>${category.id === "Offers" ? "★" : "•"}</span> ${escapeHtml(category.label)} <small>${count}</small></button>`;
    }).join("");
}

function renderMenu() {
  const grid = document.querySelector("#product-grid");
  const visible = getVisibleItems();
  document.querySelector("#results-label").textContent = `Showing ${visible.length} ${visible.length === 1 ? "item" : "items"}${state.activeCategory !== "All" ? " in " + state.activeCategory : ""}`;
  renderCategories();
  if (!visible.length) {
    grid.innerHTML = `<div class="empty-state"><span>⌕</span><h3>No menu items found</h3><p>Try another search or choose a different category.</p><button class="reset-search" id="reset-search">Clear search</button></div>`;
    return;
  }
  grid.innerHTML = visible.map((item) => {
    const variantSelect = item.variants?.length ? `<label class="variant-label"><span>${item.variants.length > 1 ? "Choose option" : "Available size"}</span><select data-variant="${item.id}">${item.variants.map((v, i) => `<option value="${i}">${escapeHtml(v.label)} · KES ${money(v.price)}</option>`).join("")}</select></label>` : "";
    return `
      <article class="product-card">
        <div class="product-image"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">${item.badge ? `<span class="product-badge">${escapeHtml(item.badge)}</span>` : ""}</div>
        <div class="product-info">
          <div class="product-category">${escapeHtml(item.category)}</div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="product-card-bottom">
            <div class="product-price"><b>${formatPrice(item)}</b><small>${item.variants?.length ? "Price varies by option" : "Per item"}</small></div>
            <button class="add-button" data-add="${item.id}" ${item.available === false ? "disabled" : ""} aria-label="Add ${escapeHtml(item.name)} to order">${item.available === false ? "Unavailable" : "<span>+</span> Add"}</button>
          </div>
          ${variantSelect}
        </div>
      </article>`;
  }).join("");
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}
function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function addToCart(item, variant) {
  const variantName = variant?.label || "";
  const price = variant?.price ?? item.price;
  const key = item.id + (variantName ? "::" + variantName : "");
  const found = state.cart.find((entry) => entry.key === key);
  if (found) found.qty += 1;
  else state.cart.push({ key, id: item.id, name: item.name, variant: variantName, price, image: item.image, qty: 1 });
  renderCart();
  showToast(`${item.name}${variantName ? " · " + variantName : ""} added to your order`);
}
function changeQty(key, change) {
  const item = state.cart.find((entry) => entry.key === key);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) state.cart = state.cart.filter((entry) => entry.key !== key);
  renderCart();
}
function renderCart() {
  try { localStorage.setItem("huhus-demo-cart", JSON.stringify(state.cart)); } catch {}
  const count = cartCount();
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#drawer-count").textContent = `(${count})`;
  const content = document.querySelector("#cart-content");
  const foot = document.querySelector("#cart-foot");
  if (!state.cart.length) {
    content.innerHTML = `<div class="cart-empty"><div class="empty-bag">🛍️</div><h3>Your order is empty</h3><p>Good things are waiting on the menu.</p><button class="browse-menu" id="browse-menu">Browse menu</button></div>`;
    foot.innerHTML = "";
    return;
  }
  content.innerHTML = state.cart.map((item) => `
    <div class="cart-line">
      <img src="${escapeHtml(item.image)}" alt="">
      <div class="cart-line-info"><b>${escapeHtml(item.name)}</b>${item.variant ? `<small>${escapeHtml(item.variant)}</small>` : ""}<strong>KES ${money(item.price * item.qty)}</strong></div>
      <div class="qty-control"><button data-qty="-1" data-key="${escapeHtml(item.key)}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="1" data-key="${escapeHtml(item.key)}" aria-label="Increase quantity">+</button></div>
    </div>`).join("");
  foot.innerHTML = `<div class="cart-subtotal"><span>Subtotal</span><b>KES ${money(cartTotal())}</b></div><p>Delivery fees, if applicable, are not included in this demo.</p><button class="checkout-button" id="go-checkout">Continue to checkout <span>↗</span></button>`;
}

function openCart() {
  state.cartOpen = true;
  document.querySelector("#overlay").classList.add("visible");
  document.querySelector("#cart-drawer").classList.add("open");
  document.querySelector("#cart-drawer").setAttribute("aria-hidden", "false");
}
function closeCart() {
  state.cartOpen = false;
  document.querySelector("#cart-drawer").classList.remove("open");
  document.querySelector("#cart-drawer").setAttribute("aria-hidden", "true");
  if (!state.checkoutOpen) document.querySelector("#overlay").classList.remove("visible");
}
function openCheckout() {
  if (!state.cart.length) return;
  closeCart();
  state.checkoutOpen = true;
  document.querySelector("#checkout-modal").classList.add("visible");
  document.querySelector("#checkout-modal").setAttribute("aria-hidden", "false");
  document.querySelector("#checkout-total").textContent = `KES ${money(cartTotal())}`;
}
function closeCheckout() {
  state.checkoutOpen = false;
  document.querySelector("#checkout-modal").classList.remove("visible");
  document.querySelector("#checkout-modal").setAttribute("aria-hidden", "true");
  document.querySelector("#overlay").classList.remove("visible");
}

function setFulfilment(mode) {
  state.fulfilment = mode;
  document.querySelectorAll(".fulfilment-option").forEach((button) => button.classList.toggle("selected", button.dataset.fulfilment === mode));
  const address = document.querySelector("#address-field");
  address.style.display = mode === "Delivery" ? "grid" : "none";
  address.querySelector("input").required = mode === "Delivery";
}

async function completeDemoOrder(form) {
  const data = new FormData(form);
  const customerName = String(data.get("customerName") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const address = String(data.get("address") || "").trim();
  const paymentMethod = String(data.get("paymentMethod") || "cash");
  if (!customerName || !phone || (state.fulfilment === "Delivery" && !address)) return;
  const button = form.querySelector('button[type="submit"]');
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = "Submitting...";
  try {
    const response = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName, phone, fulfilment: state.fulfilment.toLowerCase(), deliveryAddress: address,
        notes: String(data.get("notes") || "").trim(), paymentMethod,
        items: state.cart.map((item) => ({ itemId: item.id, variant: item.variant || "", quantity: item.qty }))
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "The order could not be submitted.");
    const summary = state.cart.map((item) => item.qty + " × " + item.name + (item.variant ? " (" + item.variant + ")" : "")).join(" · ");
    document.querySelector("#success-ref").innerHTML = '<b>' + escapeHtml(result.reference) + '</b><span>' + escapeHtml(customerName) + ' · ' + escapeHtml(state.fulfilment) + ' · KES ' + money(result.totalKes || cartTotal()) + '</span><small>' + escapeHtml(summary) + '</small>';
    document.querySelector("#success-eyebrow").textContent = result.paymentStatus === "pending" ? "PAYMENT REQUEST SENT" : "ORDER SAVED";
    document.querySelector("#success-title").textContent = result.paymentStatus === "pending" ? "Check your phone" : "Order received";
    document.querySelector("#success-message").textContent = result.paymentStatus === "pending"
      ? "Complete the M-Pesa prompt on your phone. The order will only be confirmed after Safaricom verifies payment."
      : "This test order is visible in Huhu’s management dashboard. It is not being sent to restaurant staff for fulfilment.";
    closeCheckout();
    document.querySelector("#success-modal").classList.add("visible");
    document.querySelector("#success-modal").setAttribute("aria-hidden", "false");
    state.cart = [];
    renderCart();
    form.reset();
    setFulfilment("Delivery");
  } catch (error) {
    showToast(error.message || "Order submission failed.");
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}

async function loadBackendMenu() {
  try {
    const response = await fetch("/api/menu");
    if (!response.ok) return;
    const payload = await response.json();
    if (Array.isArray(payload.items) && payload.items.length) {
      const previous = new Map(menu.map((item) => [item.id, item]));
      menu = payload.items.map((item) => {
        const old = previous.get(item.id) || {};
        return { ...old, ...item, image: item.image_url || menuImageMap[item.id] || old.image || pizzaImage,
          variants: Array.isArray(item.variants) && item.variants.length ? item.variants : undefined, available: item.available !== false };
      });
    }
    if (Array.isArray(payload.categories) && payload.categories.length) {
      const previous = new Map(categories.map((item) => [item.id, item]));
      categories = payload.categories.map((item) => ({ ...(previous.get(item.id) || {}), ...item, image: item.image_url || categoryImageMap[item.id] || (previous.get(item.id) || {}).image || pizzaImage }));
    }
    renderMenu();
  } catch { /* keep the bundled catalogue available when offline */ }
}
async function loadPaymentOptions() {
  try {
    const response = await fetch("/api/health");
    const health = await response.json();
    const option = document.querySelector('#payment-method option[value="mpesa"]');
    const note = document.querySelector("#payment-note");
    if (!option) return;
    option.disabled = !health.mpesaEnabled;
    if (health.mpesaEnabled) note.textContent = "M-Pesa is connected. Your order updates only after Safaricom confirms the payment.";
  } catch {}
}
function initChatPreview() {
  const panel = document.querySelector("#chat-panel"), launcher = document.querySelector("#chat-launcher");
  const messages = document.querySelector("#chat-messages"), input = document.querySelector("#chat-input");
  const add = (value, role) => {
    const node = document.createElement("div"); node.className = "chat-message " + role;
    node.textContent = value; messages.appendChild(node); messages.scrollTop = messages.scrollHeight;
  };
  const reply = (value) => {
    const q = value.toLowerCase();
    if (/menu|pizza|burger|chicken/.test(q)) return "You can explore pizzas, burgers, chicken, sides, drinks and sharing offers in the menu. Select an item to add it to your order.";
    if (/deliver|collect|pickup/.test(q)) return "The ordering experience supports delivery and collection. Huhu’s team will confirm delivery areas, charges and collection timing before launch.";
    if (/hour|open|close/.test(q)) return "The current preview shows opening hours as 8:00 AM to 11:00 PM daily. Live hours will be confirmed with Huhu’s.";
    if (/mpesa|pay|payment/.test(q)) return "The planned payment flow uses a real M-Pesa STK Push. Payment will only be marked complete after Safaricom sends a successful callback.";
    if (/order|track|status/.test(q)) return "The system stores orders and tracks status. Customer WhatsApp updates can be connected after Huhu’s workflow is agreed.";
    if (/person|human|staff|manager/.test(q)) return "The live experience can hand conversations to Huhu’s team. This preview is scripted and does not connect to staff.";
    return "I can help with the menu, delivery, collection, opening hours, ordering or payments. What would you like to know?";
  };
  const send = (value) => { const clean = String(value || "").trim(); if (!clean) return; add(clean, "customer"); window.setTimeout(() => add(reply(clean), "assistant"), 220); };
  launcher.addEventListener("click", () => { panel.classList.add("open"); panel.setAttribute("aria-hidden", "false"); launcher.hidden = true; input.focus(); });
  document.querySelector("#chat-close").addEventListener("click", () => { panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); launcher.hidden = false; });
  document.querySelector("#chat-form").addEventListener("submit", (event) => { event.preventDefault(); send(input.value); input.value = ""; });
  panel.querySelectorAll("[data-chat-prompt]").forEach((button) => button.addEventListener("click", () => send(button.dataset.chatPrompt)));
}

document.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    state.activeCategory = categoryButton.dataset.category;
    renderMenu();
    return;
  }
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const item = menu.find((entry) => entry.id === addButton.dataset.add);
    const select = document.querySelector(`[data-variant="${item.id}"]`);
    const variant = item.variants?.length ? item.variants[Number(select?.value || 0)] : null;
    addToCart(item, variant);
    return;
  }
  const qtyButton = event.target.closest("[data-qty]");
  if (qtyButton) {
    changeQty(qtyButton.dataset.key, Number(qtyButton.dataset.qty));
    return;
  }
  if (event.target.closest("#open-cart")) { openCart(); return; }
  if (event.target.closest("#close-cart")) { closeCart(); return; }
  if (event.target.closest("#close-checkout")) { closeCheckout(); return; }
  if (event.target.closest("#browse-menu")) { closeCart(); document.querySelector("#menu-section").scrollIntoView({ behavior: "smooth" }); return; }
  if (event.target.closest("#go-checkout")) { openCheckout(); return; }
  if (event.target.closest("#reset-search")) { state.query = ""; document.querySelector("#menu-search").value = ""; state.activeCategory = "All"; renderMenu(); return; }
  const goCategory = event.target.closest("[data-go-category]");
  if (goCategory) {
    state.activeCategory = goCategory.dataset.goCategory;
    renderMenu();
    document.querySelector("#menu-section").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const fulfilmentButton = event.target.closest("[data-fulfilment]");
  if (fulfilmentButton) { setFulfilment(fulfilmentButton.dataset.fulfilment); return; }
  if (event.target.closest("#success-done")) {
    document.querySelector("#success-modal").classList.remove("visible");
    document.querySelector("#success-modal").setAttribute("aria-hidden", "true");
    document.querySelector("#menu-section").scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (event.target.id === "overlay") {
    closeCart();
    if (state.checkoutOpen) closeCheckout();
  }
});

document.querySelector("#menu-search").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderMenu();
  document.querySelector("#menu-search").focus();
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  completeDemoOrder(event.currentTarget);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector("#menu-search").focus();
    document.querySelector("#menu-section").scrollIntoView({ behavior: "smooth" });
  }
  if (event.key === "Escape") { closeCart(); closeCheckout(); }
});

// PWA install experience. Android Chromium browsers can offer a native install prompt.
// iOS does not expose that prompt API, so its install flow must use the browser's Share menu.
const installButton = document.querySelector("#install-app");
const installHelpModal = document.querySelector("#install-help-modal");
const installHelpTitle = document.querySelector("#install-help-title");
const installHelpIntro = document.querySelector("#install-help-intro");
const installSteps = document.querySelector("#install-steps");
const installNote = document.querySelector("#install-note");
let deferredInstallPrompt = null;

const userAgent = navigator.userAgent || "";
const isIOS = /iPhone|iPad|iPod/i.test(userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(userAgent);
const isEmbeddedBrowser = /Instagram|FBAN|FBAV|WhatsApp|Messenger|TikTok|LinkedInApp/i.test(userAgent);

const isRunningStandalone = () => window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

if (isRunningStandalone()) installButton.hidden = true;

function renderInstallGuidance() {
  if (isIOS) {
    installHelpTitle.textContent = "Add Huhu's to your iPhone";
    installHelpIntro.textContent = isEmbeddedBrowser
      ? "This page is open inside another app. Open it in Safari first, then add Huhu's to your Home Screen."
      : "Apple uses the Share menu for app installation. Follow these steps to add Huhu's to your Home Screen.";
    installSteps.innerHTML = isEmbeddedBrowser
      ? `<div><b>1. Open in Safari</b><span>Open the browser options in this app and choose “Open in Safari”.</span></div>
         <div><b>2. Tap Share</b><span>In Safari, tap the Share button on the page.</span></div>
         <div><b>3. Add Huhu's</b><span>Choose “Add to Home Screen”, turn on “Open as Web App” if shown, then tap Add.</span></div>`
      : `<div><b>1. Tap Share</b><span>In Safari, tap the Share button on the Huhu's page.</span></div>
         <div><b>2. Choose Add to Home Screen</b><span>Scroll through the Share options and tap “Add to Home Screen”.</span></div>
         <div><b>3. Confirm</b><span>Turn on “Open as Web App” if shown, then tap Add.</span></div>`;
    installNote.textContent = "This is normal on iPhone. Websites cannot open Apple's install sheet from their own button.";
    return;
  }

  if (isAndroid) {
    installHelpTitle.textContent = "Install Huhu's on Android";
    installHelpIntro.textContent = isEmbeddedBrowser
      ? "This page is open inside another app. Open it in Chrome to install Huhu's."
      : "Use Chrome or Samsung Internet to add Huhu's to your phone like an app.";
    installSteps.innerHTML = isEmbeddedBrowser
      ? `<div><b>1. Open in Chrome</b><span>Use the browser menu in this app and choose “Open in Chrome”.</span></div>
         <div><b>2. Open the browser menu</b><span>In Chrome, tap the three dots (⋮) at the top right.</span></div>
         <div><b>3. Install Huhu's</b><span>Tap “Install app” or “Add to Home screen”, then confirm.</span></div>`
      : `<div><b>1. Open the browser menu</b><span>In Chrome, tap the three dots (⋮) at the top right.</span></div>
         <div><b>2. Choose Install app</b><span>Tap “Install app”. If that option is not shown, choose “Add to Home screen”.</span></div>
         <div><b>3. Confirm</b><span>Accept the prompt. Huhu's will appear with your other apps.</span></div>`;
    installNote.textContent = "If Chrome does not show an install option, it has not offered installation for this visit yet. Open the page in Chrome, interact with it, and check the browser menu again.";
    return;
  }

  installHelpTitle.textContent = "Install the Huhu's app";
  installHelpIntro.textContent = "Add Huhu's to your device for an app-style experience and quicker access to the menu.";
  installSteps.innerHTML = `<div><b>Chrome or Edge</b><span>Use the install icon in the address bar or choose “Install Huhu's” from the browser menu.</span></div>`;
  installNote.textContent = "The exact install option depends on your browser.";
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = isRunningStandalone();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  installButton.hidden = true;
  showToast("Huhu's has been added to your device");
});

function openInstallHelp() {
  renderInstallGuidance();
  installHelpModal.classList.add("visible");
  installHelpModal.setAttribute("aria-hidden", "false");
}

installButton.addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    const installPrompt = deferredInstallPrompt;
    deferredInstallPrompt = null;
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice?.outcome === "accepted") {
        installButton.hidden = true;
        return;
      }
      openInstallHelp();
      return;
    } catch {
      openInstallHelp();
      return;
    }
  }
  openInstallHelp();
});

function closeInstallHelp() {
  installHelpModal.classList.remove("visible");
  installHelpModal.setAttribute("aria-hidden", "true");
}
document.querySelector("#close-install-help").addEventListener("click", closeInstallHelp);
document.querySelector("#close-install-help-done").addEventListener("click", closeInstallHelp);
installHelpModal.addEventListener("click", (event) => {
  if (event.target === installHelpModal) closeInstallHelp();
});

function updateNetworkStatus() {
  const status = document.querySelector("#network-status");
  status.textContent = navigator.onLine ? "Online" : "Offline mode";
  status.classList.toggle("offline", !navigator.onLine);
}
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
updateNetworkStatus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // The ordering demo remains usable online if service-worker registration is unavailable.
    });
  });
}

renderMenu();
renderCart();
setFulfilment("Delivery");
loadBackendMenu();
loadPaymentOptions();
initChatPreview();

}
