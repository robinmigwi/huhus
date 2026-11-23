export const defaultCategorySeed = [
  { id: "Pizza", label: "Pizza", image: "", intro: "Classic favourites, loaded with toppings." },
  { id: "Burgers", label: "Burgers", image: "", intro: "Crispy chicken and stacked beef burgers." },
  { id: "Chicken & Sides", label: "Chicken & Sides", image: "", intro: "Crunchy chicken, popcorn and fries." },
  { id: "Offers", label: "Offers", image: "", intro: "Meals made for sharing." },
  { id: "Coffee", label: "Coffee", image: "", intro: "Espresso favourites, made your way." },
  { id: "Tea & Hot Drinks", label: "Tea & Hot Drinks", image: "", intro: "A warm cup, any time of day." },
  { id: "Ice Cream", label: "Ice Cream", image: "", intro: "A little something sweet." },
  { id: "Milkshakes", label: "Milkshakes", image: "", intro: "Thick, creamy and full of flavour." },
  { id: "Fresh Juices", label: "Fresh Juices", image: "", intro: "Fresh fruit, bright flavours." },
  { id: "Healthy Blends", label: "Healthy Blends", image: "", intro: "Fruit and vegetable blends." },
  { id: "Smoothies", label: "Smoothies", image: "", intro: "Blended favourites and feel-good mixes." },
  { id: "Fruit Salads", label: "Fruit Salads", image: "", intro: "Fresh fruit with optional extras." },
];

export const defaultMenuSeed = [
  { id: "pizza-meat-deluxe", category: "Pizza", name: "Meat Deluxe", description: "BBQ steak, boerewors, macon and pepperoni.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: "", badge: "Huhu's favourite" },
  { id: "pizza-hawaiian", category: "Pizza", name: "Hawaiian", description: "Macon and pineapples.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: "" },
  { id: "pizza-four-seasons", category: "Pizza", name: "Four Seasons", description: "Pepperoni, tomatoes, black olives, onions and green pepper.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: "" },
  { id: "pizza-pepperoni", category: "Pizza", name: "Pepperoni", description: "Beef pepperoni.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: "" },
  { id: "pizza-chicken-macon-bbq", category: "Pizza", name: "Chicken Macon BBQ", description: "Marinated chicken, macon, onions and pepper.", variants: [{ label: "Small", price: 750 }, { label: "Medium", price: 1000 }, { label: "Large", price: 1250 }], image: "" },

  { id: "burger-crunchy-chicken", category: "Burgers", name: "Crunchy Chicken Burger", description: "A crunchy chicken burger.", price: 600, image: "" },
  { id: "burger-crunchy-chicken-fries", category: "Burgers", name: "Crunchy Chicken Burger + Fries", description: "Crunchy chicken burger served with fries.", price: 700, image: "" },
  { id: "burger-chicken-tower", category: "Burgers", name: "Chicken Tower Burger Combo", description: "Chicken tower burger, 350ml soda and fries.", price: 980, image: "" },
  { id: "burger-beef-tower", category: "Burgers", name: "Beef Tower Burger Combo", description: "Beef tower burger, 350ml soda and fries.", price: 650, image: "" },
  { id: "burger-double-beef", category: "Burgers", name: "Double Beef Burger", description: "Double beef burger.", price: 900, image: "" },

  { id: "chicken-piece", category: "Chicken & Sides", name: "1 Piece", description: "Crispy fried chicken.", price: 200, image: "" },
  { id: "chicken-one-piecer", category: "Chicken & Sides", name: "1 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 300, image: "" },
  { id: "chicken-two-piecer", category: "Chicken & Sides", name: "2 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 450, image: "" },
  { id: "chicken-three-piecer", category: "Chicken & Sides", name: "3 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 650, image: "" },
  { id: "chicken-six-piecer", category: "Chicken & Sides", name: "6 Piecer", description: "Crispy fried chicken. Name transcribed from Huhu's menu artwork.", price: 1250, image: "" },
  { id: "chicken-popcorn-small", category: "Chicken & Sides", name: "Chicken Popcorn — Small", description: "Crispy chicken popcorn.", price: 250, image: "" },
  { id: "chicken-popcorn-large", category: "Chicken & Sides", name: "Chicken Popcorn — Large", description: "Crispy chicken popcorn.", price: 400, image: "" },
  { id: "side-regular-fries", category: "Chicken & Sides", name: "Regular Fries", description: "A serving of fries.", price: 200, image: "" },

  { id: "offer-burger-combo", category: "Offers", name: "Huhu's Burger Combo", description: "Burger, fries and Coca-Cola.", price: 650, image: "", badge: "Combo offer" },
  { id: "offer-family-feast", category: "Offers", name: "Crunchy Family Feast", description: "12 pieces chicken, 2 chips, 2 coleslaw and 2-litre soda.", price: 2700, image: "", badge: "Family feast" },

  { id: "coffee-espresso", category: "Coffee", name: "Espresso", variants: [{ label: "Single", price: 200 }, { label: "Double", price: 250 }], image: "" },
  { id: "coffee-cappuccino", category: "Coffee", name: "Cappuccino", variants: [{ label: "Single", price: 250 }, { label: "Double", price: 300 }], image: "" },
  { id: "coffee-mocha", category: "Coffee", name: "Caffè Mocha", variants: [{ label: "Single", price: 300 }, { label: "Double", price: 350 }], image: "" },
  { id: "coffee-macchiato", category: "Coffee", name: "Caffè Macchiato", variants: [{ label: "Single", price: 200 }, { label: "Double", price: 250 }], image: "" },
  { id: "coffee-latte", category: "Coffee", name: "Caffè Latte", variants: [{ label: "Single", price: 250 }, { label: "Double", price: 300 }], image: "" },
  { id: "coffee-americano", category: "Coffee", name: "Americano", variants: [{ label: "Single", price: 200 }, { label: "Double", price: 250 }], image: "" },
  { id: "coffee-latte-macchiato", category: "Coffee", name: "Latte Macchiato", variants: [{ label: "Single", price: 300 }, { label: "Double", price: 350 }], image: "" },
  { id: "coffee-iced", category: "Coffee", name: "Iced Coffee", variants: [{ label: "Single", price: 250 }, { label: "Double", price: 300 }], image: "" },
  { id: "coffee-flat-white", category: "Coffee", name: "Flat White Coffee", variants: [{ label: "Single", price: 250 }], image: "" },

  ...[
    ["African Tea", 150], ["Masala Tea", 200], ["Herbal Tea", 150], ["Lemon Tea", 150],
    ["Cardamom Tea", 200], ["Iced Tea", 200], ["Dawa", 250], ["Cup of Milk", 200],
    ["White Chocolate", 200], ["Black Chocolate", 200], ["White Cocoa", 250],
  ].map(([name, price]) => ({ id: "tea-" + slug(name), category: "Tea & Hot Drinks", name, description: "A Huhu's hot drink favourite.", price, image: "" })),

  { id: "ice-cream-cone", category: "Ice Cream", name: "Ice Cream Cone", description: "One ice cream cone.", price: 100, image: "" },
  { id: "ice-cream-small", category: "Ice Cream", name: "Ice Cream Cup — Small", description: "Small ice cream cup.", price: 200, image: "" },
  { id: "ice-cream-big", category: "Ice Cream", name: "Ice Cream Cup — Big", description: "Big ice cream cup.", price: 250, image: "" },

  ...[
    ["Vanilla", 300], ["Blueberry", 300], ["Strawberry", 300], ["Chocolate", 300], ["Pina Colada", 300],
    ["Espresso", 370], ["Double Espresso", 450], ["Bubblegum", 300], ["Banana", 300], ["Lime", 300], ["Oreo", 350],
  ].map(([name, price]) => ({ id: "shake-" + slug(name), category: "Milkshakes", name, description: "A creamy Huhu's milkshake.", price, image: "" })),

  { id: "blend-hydrant", category: "Healthy Blends", name: "Hydrant Shot", description: "Cucumber, celery, lime, ginger and apple/pineapple.", price: 400, image: "" },
  { id: "blend-revital", category: "Healthy Blends", name: "Revital", description: "Orange, carrot, apple, lime and ginger.", price: 400, image: "" },
  { id: "blend-iron-blocks", category: "Healthy Blends", name: "Iron Blocks", description: "Beetroot, pineapple, cucumber, spinach and ginger.", price: 400, image: "" },
  { id: "blend-vit-boost", category: "Healthy Blends", name: "Vit-Boost", description: "Lime, ginger, apple, parsley and celery.", price: 400, image: "" },
  { id: "blend-make-own", category: "Healthy Blends", name: "Make Your Own", description: "Choose up to 5 ingredients for a personalised blend.", price: 400, image: "" },

  ...[
    ["Apple", 480], ["Orange", 480], ["Mango", 380], ["Passion", 380], ["Pine-Mint", 380],
    ["Sugarcane", 380], ["Tree Tomato", 380], ["Carrot Juice", 380], ["Super Berry Juice", 480],
    ["Watermelon", 380], ["Pawpaw Juice", 380], ["Cocktail Juice", 400],
  ].map(([name, price]) => ({ id: "juice-" + slug(name), category: "Fresh Juices", name, description: "Freshly prepared fruit juice.", price, image: "" })),

  { id: "smoothie-berry-best", category: "Smoothies", name: "Berry Best", description: "Strawberries, raspberries, blueberries and natural or vanilla yoghurt.", price: 450, image: "" },
  { id: "smoothie-daily-tropical", category: "Smoothies", name: "Daily Tropical", description: "Mango, one of the berries, banana and natural or vanilla yoghurt.", price: 450, image: "" },
  { id: "smoothie-berry-squeeze", category: "Smoothies", name: "Berry Squeeze", description: "Mixed berries, apple and yoghurt.", price: 450, image: "" },
  { id: "smoothie-lean-green", category: "Smoothies", name: "Lean Green", description: "Mango, banana, pineapple, spinach and chia seeds.", price: 400, image: "" },
  { id: "smoothie-paso-mango", category: "Smoothies", name: "Paso Mango", description: "Mango, passion and strawberry.", price: 400, image: "" },
  { id: "smoothie-tropical-fuse", category: "Smoothies", name: "Tropical Fuse", description: "Mango, pineapple, banana and passion.", price: 400, image: "" },
  { id: "smoothie-pre-pro-kick", category: "Smoothies", name: "Pre-Pro Kick", description: "Banana, one of the berries, yoghurt, chia seeds and whey.", price: 550, image: "" },
  { id: "smoothie-post-pro-kick", category: "Smoothies", name: "Post-Pro Kick", description: "Mixed nuts, banana, yoghurt and whey.", price: 550, image: "" },
  { id: "smoothie-super-choco-kick", category: "Smoothies", name: "Super Choco Kick", description: "Espresso, banana, milk, peanuts and whey.", price: 550, image: "" },

  { id: "salad-fruit", category: "Fruit Salads", name: "Assorted Fruit Salad", description: "Assorted fresh fruit.", price: 450, image: "" },
  { id: "salad-fruit-honey", category: "Fruit Salads", name: "Fruit Salad with Honey, Yoghurt & Nuts", description: "Assorted fruit with honey, yoghurt and nuts.", price: 550, image: "" },
];

export function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
