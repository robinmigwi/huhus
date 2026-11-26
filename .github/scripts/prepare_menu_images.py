from pathlib import Path
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json
import os
import time
import requests

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
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    JS_OUT.parent.mkdir(parents=True, exist_ok=True)

    used_hashes = sorted(set(ITEM_TO_HASH.values()) | set(CATEGORY_TO_HASH.values()))
    originals = {suffix: locate_source(suffix) for suffix in used_hashes}
    generated_paths = {}
    IMAGE_FIT_URL = os.environ.get(
        "HUHUS_IMAGE_FIT_URL",
        "https://huhus-menu-image-fit.robinmigwi-ed6.workers.dev",
    )
    IMAGE_FIT_ORIGIN = "https://huhus-ordering-demo.pages.dev"
    INPUT_SIZE = (480, 480)
    OUTPUT_SIZE = (1600, 592)
    OUTPUT_RATIO = OUTPUT_SIZE[0] / OUTPUT_SIZE[1]

    def generate_landscape_asset(suffix):
        source = originals[suffix]
        with Image.open(source) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
            image = ImageOps.contain(image, INPUT_SIZE, method=Image.Resampling.LANCZOS)
            buffer = BytesIO()
            image.save(buffer, "JPEG", quality=88, optimize=True)

        request_files = {
            "image": (source.name, buffer.getvalue(), "image/jpeg")
        }
        headers = {"Origin": IMAGE_FIT_ORIGIN}
        last_error = None

        for attempt in range(3):
            try:
                response = requests.post(
                    IMAGE_FIT_URL,
                    files=request_files,
                    headers=headers,
                    timeout=(30, 300),
                )
                response.raise_for_status()
                with Image.open(BytesIO(response.content)) as raw_output:
                    output = ImageOps.exif_transpose(raw_output).convert("RGB")
                    ratio = output.width / output.height
                    if abs(ratio - OUTPUT_RATIO) > 0.03:
                        raise ValueError(
                            f"Model output for {suffix} has unexpected ratio "
                            f"{output.width}x{output.height} ({ratio:.3f})"
                        )
                    if output.size != OUTPUT_SIZE:
                        output = output.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
                    output_path = OUT_DIR / f"{suffix}.webp"
                    output.save(output_path, "WEBP", quality=88, method=6)
                    return suffix, output_path
            except Exception as error:
                last_error = error
                if attempt < 2:
                    time.sleep(3 * (attempt + 1))

        raise RuntimeError(f"Could not generate wide asset for {suffix}: {last_error}")

    # Generate assets from the original square uploads. The reference images are
    # resized only for model input; the model creates a new wide composition.
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = {executor.submit(generate_landscape_asset, suffix): suffix for suffix in used_hashes}
        completed = 0
        for future in as_completed(futures):
            suffix, output_path = future.result()
            generated_paths[suffix] = output_path
            completed += 1
            print(f"[{completed}/{len(used_hashes)}] Generated {output_path.name}")

    item_map = {item_id: f"/menu-images/{suffix}.webp" for item_id, suffix in ITEM_TO_HASH.items()}
    category_map = {category: f"/menu-images/{suffix}.webp" for category, suffix in CATEGORY_TO_HASH.items()}
    lines = [
        "// Generated from huhus/Menu Images by .github/scripts/prepare_menu_images.py",
        "export const menuImageMap = Object.freeze(" + json.dumps(item_map, indent=2, ensure_ascii=False) + ");",
        "export const categoryImageMap = Object.freeze(" + json.dumps(category_map, indent=2, ensure_ascii=False) + ");",
        "",
    ]
    JS_OUT.write_text("\n".join(lines), encoding="utf-8")

    # Contact sheet shows the generated landscape files for visual review.
    columns, tile_w, tile_h = 4, 360, 190
    rows = (len(generated_paths) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * tile_w, rows * tile_h), "#f2eee7")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 15)
        small = ImageFont.truetype("DejaVuSans.ttf", 12)
    except OSError:
        font = ImageFont.load_default()
        small = ImageFont.load_default()

    for index, (suffix, output_path) in enumerate(sorted(generated_paths.items())):
        x, y = (index % columns) * tile_w, (index // columns) * tile_h
        with Image.open(output_path) as raw:
            thumb = ImageOps.contain(
                ImageOps.exif_transpose(raw).convert("RGB"),
                (tile_w - 24, 124),
                method=Image.Resampling.LANCZOS,
            )
        sheet.paste(thumb, (x + 12, y + 8))
        source_name = originals[suffix].stem.replace("_2K", "")
        draw.text((x + 12, y + 139), source_name[:42], fill="#302820", font=font)
        draw.text((x + 12, y + 161), f"wide asset: {suffix}", fill="#71675f", font=small)

    CONTACT_SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT_SHEET, "JPEG", quality=88, optimize=True)

    total = sum(p.stat().st_size for p in OUT_DIR.glob("*.webp"))
    print(f"Mapped {len(item_map)} menu items using {len(used_hashes)} source images.")
    print(f"Generated {len(list(OUT_DIR.glob('*.webp')))} WebP files, total {total:,} bytes.")
    print(f"Contact sheet: {CONTACT_SHEET}")

if __name__ == "__main__":
    main()
