from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json

SOURCE_DIR = Path("huhus/Menu Images")
OUT_DIR = Path("prepared/public/menu-images")
JS_OUT = Path("prepared/src/menu-images.js")
CONTACT_SHEET = Path("prepared/menu-image-contact-sheet.jpg")

# Maps the existing Huhu's catalogue IDs to the source photo whose filename
# identifies the closest matching menu item. Several menu sizes/flavours
# intentionally share the closest available source image where no separate
# photograph was supplied.
ITEM_TO_HASH = {
    # Pizza
    "pizza-meat-deluxe": "f17bff80",
    "pizza-hawaiian": "11ac6964",
    "pizza-four-seasons": "4f97f650",
    "pizza-pepperoni": "0bba4c38",
    "pizza-chicken-macon-bbq": "1897003f",
    # Burgers
    "burger-crunchy-chicken": "e88cb860",
    "burger-crunchy-chicken-fries": "2048030d",
    "burger-chicken-tower": "15a744d7",
    "burger-beef-tower": "80af511a",
    "burger-double-beef": "9a7b7121",
    # Chicken and sides
    "chicken-piece": "f98f056b",
    "chicken-one-piecer": "f98f056b",
    "chicken-two-piecer": "65635304",
    "chicken-three-piecer": "555fc2dc",
    "chicken-six-piecer": "31714c18",
    "chicken-popcorn-small": "76b80645",
    "chicken-popcorn-large": "2ea52b86",
    "side-regular-fries": "8c9a3937",
    # Offers
    "offer-burger-combo": "14c71f5d",
    "offer-family-feast": "45ca4b71",
    # Coffee
    "coffee-espresso": "1fe1742f",
    "coffee-cappuccino": "ba4f0ece",
    "coffee-mocha": "a4e54639",
    "coffee-macchiato": "5784d964",
    "coffee-latte": "d28d0d07",
    "coffee-americano": "89720275",
    "coffee-latte-macchiato": "ff3d1680",
    "coffee-iced": "37080421",
    "coffee-flat-white": "40c4385d",
    # Tea and hot drinks
    "tea-african-tea": "ea795c88",
    "tea-masala-tea": "396b6605",
    "tea-herbal-tea": "ac1ef5b7",
    "tea-lemon-tea": "f0862138",
    "tea-cardamom-tea": "17915ed3",
    "tea-iced-tea": "dc8bf8f1",
    "tea-dawa": "2c4d411f",
    "tea-cup-of-milk": "d28d0d07",
    "tea-white-chocolate": "ba4f0ece",
    "tea-black-chocolate": "89720275",
    "tea-white-cocoa": "ba4f0ece",
    # Ice cream
    "ice-cream-cone": "52a2680e",
    "ice-cream-small": "52a2680e",
    "ice-cream-big": "52a2680e",
    # Milkshakes
    "shake-vanilla": "5f951c7a",
    "shake-blueberry": "0639312f",
    "shake-strawberry": "b7e4c873",
    "shake-chocolate": "8d549abe",
    "shake-pina-colada": "fcf34958",
    "shake-espresso": "b8e6fb98",
    "shake-double-espresso": "b8e6fb98",
    "shake-bubblegum": "4f3dd517",
    "shake-banana": "c4d794aa",
    "shake-lime": "73d7ead3",
    "shake-oreo": "59b3331b",
    # Healthy blends
    "blend-hydrant": "d20724fd",
    "blend-revital": "afc02b15",
    "blend-iron-blocks": "cdfc38ff",
    "blend-vit-boost": "c5fc6b6e",
    "blend-make-own": "73553fdf",
    # Fresh juices
    "juice-apple": "d53f3382",
    "juice-orange": "9cb59437",
    "juice-mango": "ac6c023c",
    "juice-passion": "ec61c63b",
    "juice-pine-mint": "85a868d4",
    "juice-sugarcane": "2b03633e",
    "juice-tree-tomato": "06c2266a",
    "juice-carrot-juice": "afc02b15",
    "juice-super-berry-juice": "73553fdf",
    "juice-watermelon": "cdfc38ff",
    "juice-pawpaw-juice": "73553fdf",
    "juice-cocktail-juice": "73553fdf",
    # Smoothies
    "smoothie-berry-best": "095948b6",
    "smoothie-daily-tropical": "d47fed6c",
    "smoothie-berry-squeeze": "6d3e67ed",
    "smoothie-lean-green": "8d572a25",
    "smoothie-paso-mango": "586b7dee",
    "smoothie-tropical-fuse": "e74f2370",
    "smoothie-pre-pro-kick": "6d3e67ed",
    "smoothie-post-pro-kick": "f2145baf",
    "smoothie-super-choco-kick": "9ce25ab4",
    # Fruit salads
    "salad-fruit": "e2e4a403",
    "salad-fruit-honey": "cbaeed75",
}

CATEGORY_TO_HASH = {
    "Pizza": "f17bff80",
    "Burgers": "e88cb860",
    "Chicken & Sides": "65635304",
    "Offers": "45ca4b71",
    "Coffee": "ba4f0ece",
    "Tea & Hot Drinks": "ea795c88",
    "Ice Cream": "52a2680e",
    "Milkshakes": "5f951c7a",
    "Fresh Juices": "9cb59437",
    "Healthy Blends": "d20724fd",
    "Smoothies": "586b7dee",
    "Fruit Salads": "cbaeed75",
}

def locate_source(suffix: str) -> Path:
    matches = sorted(SOURCE_DIR.glob(f"*{suffix}*.jpg"))
    if not matches:
        raise FileNotFoundError(f"No source image matching {suffix} in {SOURCE_DIR}")
    return matches[0]

def main():
    if not SOURCE_DIR.is_dir():
        raise FileNotFoundError(f"Missing source directory: {SOURCE_DIR}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    JS_OUT.parent.mkdir(parents=True, exist_ok=True)

    used_hashes = sorted(set(ITEM_TO_HASH.values()) | set(CATEGORY_TO_HASH.values()))
    originals = {}
    # Source menu photographs are square. Generate square responsive thumbnails
    # at the card's display width, preserving the complete source image.
    # No crop, blur, background extension, or foreground inset is applied.
    THUMBNAIL_SIZE = (720, 720)

    for suffix in used_hashes:
        source = locate_source(suffix)
        originals[suffix] = source
        with Image.open(source) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
            thumbnail = ImageOps.contain(
                image,
                THUMBNAIL_SIZE,
                method=Image.Resampling.LANCZOS,
            )
            # Keep the full original image ratio; square source photos render
            # edge-to-edge while other ratios are letterboxed without cropping.
            if thumbnail.size != THUMBNAIL_SIZE:
                canvas = Image.new("RGB", THUMBNAIL_SIZE, (250, 247, 241))
                x = (THUMBNAIL_SIZE[0] - thumbnail.width) // 2
                y = (THUMBNAIL_SIZE[1] - thumbnail.height) // 2
                canvas.paste(thumbnail, (x, y))
                thumbnail = canvas
            thumbnail.save(OUT_DIR / f"{suffix}.webp", "WEBP", quality=90, method=6)

    item_map = {item_id: f"/menu-images/{suffix}.webp" for item_id, suffix in ITEM_TO_HASH.items()}
    category_map = {category: f"/menu-images/{suffix}.webp" for category, suffix in CATEGORY_TO_HASH.items()}
    lines = [
        "// Generated from huhus/Menu Images by .github/scripts/prepare_menu_images.py",
        "export const menuImageMap = Object.freeze(" + json.dumps(item_map, indent=2, ensure_ascii=False) + ");",
        "export const categoryImageMap = Object.freeze(" + json.dumps(category_map, indent=2, ensure_ascii=False) + ");",
        "",
    ]
    JS_OUT.write_text("\n".join(lines), encoding="utf-8")

    # Contact sheet for a visual review of every original upload.
    columns, tile_w, tile_h = 4, 360, 390
    rows = (len(originals) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * tile_w, rows * tile_h), "#f2eee7")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 17)
        small = ImageFont.truetype("DejaVuSans.ttf", 13)
    except OSError:
        font = ImageFont.load_default()
        small = ImageFont.load_default()
    for index, (suffix, path) in enumerate(sorted(originals.items())):
        x, y = (index % columns) * tile_w, (index // columns) * tile_h
        with Image.open(path) as raw:
            thumb = ImageOps.fit(ImageOps.exif_transpose(raw).convert("RGB"), (tile_w - 24, tile_w - 24))
        sheet.paste(thumb, (x + 12, y + 10))
        name = path.stem.replace("_2K", "")
        draw.text((x + 12, y + tile_w), name[:42], fill="#302820", font=font)
        draw.text((x + 12, y + tile_w + 27), f"source suffix: {suffix}", fill="#71675f", font=small)
    CONTACT_SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT_SHEET, "JPEG", quality=86, optimize=True)

    total = sum(p.stat().st_size for p in OUT_DIR.glob("*.webp"))
    print(f"Mapped {len(item_map)} menu items using {len(used_hashes)} source images.")
    print(f"Generated {len(list(OUT_DIR.glob('*.webp')))} WebP files, total {total:,} bytes.")
    print(f"Contact sheet: {CONTACT_SHEET}")

if __name__ == "__main__":
    main()
