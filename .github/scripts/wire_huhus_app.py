from pathlib import Path
import sys

root = Path(sys.argv[1])

main_path = root / "src/main.js"
main = main_path.read_text(encoding="utf-8")
needle = 'import "./styles.css";'
replacement = needle + '\nimport { menuImageMap, categoryImageMap } from "./menu-images.js";'
if replacement not in main:
    if main.count(needle) != 1:
        raise SystemExit("Could not find the main.js stylesheet import exactly once.")
    main = main.replace(needle, replacement, 1)

array_end = '];\n\nfunction slug(value)'
base_item_map = 'menu = menu.map((item) => ({ ...item, image: menuImageMap[item.id] || item.image }));'
category_item_map = 'menu = menu.map((item) => ({ ...item, image: menuImageMap[item.id] || categoryImageMap[item.category] || item.image }));'
if category_item_map not in main:
    if base_item_map in main:
        main = main.replace(base_item_map, category_item_map, 1)
    elif 'menu = menu.map((item) => ({ ...item, image: menuImageMap[item.id] || item.image }));' not in main:
        if main.count(array_end) != 1:
            raise SystemExit("Could not locate the end of the bundled menu array.")
        main = main.replace(
            array_end,
            '];\n\n'
            'menu = menu.map((item) => ({ ...item, image: menuImageMap[item.id] || categoryImageMap[item.category] || item.image }));\n'
            'categories = categories.map((category) => ({ ...category, image: categoryImageMap[category.id] || category.image }));\n\n'
            'function slug(value)',
            1,
        )

old_item_candidates = [
    'image: item.image_url || old.image || pizzaImage,',
    'image: item.image_url || menuImageMap[item.id] || old.image || pizzaImage,',
]
new_item = 'image: item.image_url || menuImageMap[item.id] || categoryImageMap[item.category] || old.image || pizzaImage,'
if new_item not in main:
    matches = [candidate for candidate in old_item_candidates if candidate in main]
    if len(matches) != 1:
        raise SystemExit("Could not locate the backend menu item image fallback.")
    main = main.replace(matches[0], new_item, 1)

old_category = 'image: item.image_url || (previous.get(item.id) || {}).image || pizzaImage'
new_category = 'image: item.image_url || categoryImageMap[item.id] || (previous.get(item.id) || {}).image || pizzaImage'
if new_category not in main:
    if main.count(old_category) != 1:
        raise SystemExit("Could not locate the backend category image fallback.")
    main = main.replace(old_category, new_category, 1)

main_path.write_text(main, encoding="utf-8")

api_path = root / "functions/api/[[path]].js"
api = api_path.read_text(encoding="utf-8")
import_line = 'import { defaultMenuSeed, defaultCategorySeed } from "../../src/menu-seed.js";'
new_imports = import_line + '\nimport { menuImageMap, categoryImageMap } from "../../src/menu-images.js";'
if new_imports not in api:
    if api.count(import_line) != 1:
        raise SystemExit("Could not locate menu seed import in Pages API.")
    api = api.replace(import_line, new_imports, 1)

old_categories = 'categories:categories.results||[],'
new_categories = 'categories:(categories.results||[]).map(x=>({...x,image_url:x.image_url||categoryImageMap[x.id]||""})),'
if new_categories not in api:
    if api.count(old_categories) != 1:
        raise SystemExit("Could not locate category results in getCatalog().")
    api = api.replace(old_categories, new_categories, 1)

old_items = 'items:(items.results||[]).map(x=>({...x,variants:parseJson(x.variants_json,[]),available:Boolean(x.available)}))'
new_items = 'items:(items.results||[]).map(x=>({...x,image_url:x.image_url||menuImageMap[x.id]||"",variants:parseJson(x.variants_json,[]),available:Boolean(x.available)}))'
if new_items not in api:
    if api.count(old_items) != 1:
        raise SystemExit("Could not locate menu item results in getCatalog().")
    api = api.replace(old_items, new_items, 1)

api_path.write_text(api, encoding="utf-8")
print("Wired menu image manifest into customer PWA and Pages API.")
