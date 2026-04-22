from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_DIR = ROOT / "public" / "images" / "products"


def smooth_alpha_cutout(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            high = min(r, g, b)
            spread = max(r, g, b) - min(r, g, b)
            if high > 244 and spread < 18:
                pixels[x, y] = (r, g, b, 0)
                continue
            if high > 225 and spread < 26:
                fade = max(0, min(255, int((244 - high) * 13)))
                pixels[x, y] = (r, g, b, min(a, fade))

    bbox = rgba.getbbox()
    return rgba.crop(bbox) if bbox else rgba


def crop_cutout(path: Path, box: tuple[int, int, int, int]) -> Image.Image:
    image = Image.open(path).crop(box)
    return smooth_alpha_cutout(image)


def fit_image(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return image.resize(size, Image.Resampling.LANCZOS)


def layer(canvas: Image.Image, image: Image.Image, position: tuple[int, int], shadow_blur: int = 26) -> None:
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    alpha = image.getchannel("A")
    shadow_alpha = alpha.point(lambda v: int(v * 0.48))
    shadow.paste((18, 14, 40, 255), (position[0] + 20, position[1] + 24), shadow_alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(shadow_blur))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(image, position)


def tint_image(image: Image.Image, color: tuple[int, int, int], strength: float) -> Image.Image:
    base = image.convert("RGBA")
    tint = Image.new("RGBA", base.size, color + (255,))
    blended = Image.blend(base, tint, strength)
    alpha = base.getchannel("A")
    blended.putalpha(alpha)
    return blended


def add_vapor(canvas: Image.Image, center: tuple[int, int], scale: float = 1.0, opacity: int = 105) -> None:
    width, height = canvas.size
    vapor = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(vapor)

    ellipses = [
        (-90, -210, 140, 90),
        (-70, -320, 130, 110),
        (-20, -430, 150, 120),
        (40, -250, 120, 92),
        (-120, -120, 110, 84),
    ]
    for dx, dy, ew, eh in ellipses:
        x0 = int(center[0] + dx * scale)
        y0 = int(center[1] + dy * scale)
        x1 = int(x0 + ew * scale)
        y1 = int(y0 + eh * scale)
        draw.ellipse((x0, y0, x1, y1), fill=(255, 255, 255, opacity))

    vapor = vapor.filter(ImageFilter.GaussianBlur(int(26 * scale)))
    canvas.alpha_composite(vapor)


def make_background(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int], glow: tuple[int, int, int]) -> Image.Image:
    width, height = size
    background = Image.new("RGBA", size, bottom + (255,))
    draw = ImageDraw.Draw(background)

    for y in range(height):
        mix = y / max(1, height - 1)
        r = int(top[0] * (1 - mix) + bottom[0] * mix)
        g = int(top[1] * (1 - mix) + bottom[1] * mix)
        b = int(top[2] * (1 - mix) + bottom[2] * mix)
        draw.line((0, y, width, y), fill=(r, g, b, 255))

    glow_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse(
        (-int(width * 0.1), int(height * 0.12), int(width * 0.72), int(height * 0.95)),
        fill=glow + (120,),
    )
    glow_draw.ellipse(
        (int(width * 0.42), -int(height * 0.05), int(width * 1.12), int(height * 0.56)),
        fill=(glow[0], glow[1], glow[2], 75),
    )
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(int(min(width, height) * 0.08)))
    background.alpha_composite(glow_layer)
    return background


def save(image: Image.Image, name: str) -> None:
    path = PRODUCTS_DIR / name
    image.convert("RGB").save(path, "PNG", optimize=True)
    print(f"Wrote {path}")


def create_assets() -> None:
    mango_clean = PRODUCTS_DIR / "topbar-mango-9900.png"

    front_device = crop_cutout(mango_clean, (125, 40, 560, 820))
    back_device = crop_cutout(mango_clean, (555, 35, 925, 820))
    lineup_front = fit_image(front_device, (240, 420))
    lineup_back = fit_image(back_device, (230, 400))

    # 1. Tall hero with vapor.
    hero = make_background((900, 1400), (10, 18, 42), (3, 6, 16), (246, 189, 67))
    hero_device = fit_image(front_device, (660, 1120))
    layer(hero, hero_device, (130, 190), shadow_blur=34)
    add_vapor(hero, (430, 315), scale=1.18, opacity=95)
    save(hero, "topbar-9900-feature-1.png")

    # 2. Wide lineup.
    wide = make_background((1600, 900), (7, 17, 40), (3, 7, 18), (70, 108, 236))
    purple_front = tint_image(lineup_front, (155, 106, 255), 0.30)
    red_front = tint_image(lineup_front, (214, 70, 82), 0.20)
    blue_front = tint_image(lineup_front, (88, 173, 255), 0.24)
    mint_front = tint_image(lineup_front, (96, 231, 202), 0.22)
    layer(wide, red_front, (130, 235), shadow_blur=24)
    layer(wide, tint_image(lineup_back, (250, 201, 86), 0.10), (420, 250), shadow_blur=22)
    layer(wide, purple_front, (655, 190), shadow_blur=24)
    layer(wide, blue_front, (970, 210), shadow_blur=24)
    layer(wide, mint_front, (1240, 245), shadow_blur=24)
    save(wide, "topbar-9900-feature-2.png")

    # 3. Front detail focus.
    display = make_background((1000, 1000), (12, 21, 48), (2, 7, 16), (255, 205, 86))
    display_device = fit_image(front_device, (760, 910))
    display_device = display_device.rotate(-7, resample=Image.Resampling.BICUBIC, expand=True)
    layer(display, display_device, (175, 70), shadow_blur=28)
    add_vapor(display, (520, 220), scale=0.68, opacity=62)
    save(display, "topbar-9900-feature-3.png")

    # 4. Dual-side product image.
    dual = make_background((1000, 1000), (14, 20, 42), (4, 8, 18), (248, 197, 96))
    left = fit_image(front_device, (470, 800))
    right = fit_image(back_device, (430, 760))
    layer(dual, left, (70, 135), shadow_blur=26)
    layer(dual, right, (540, 155), shadow_blur=24)
    save(dual, "topbar-9900-feature-4.png")

    # 5. Multi-device series board.
    flavors = make_background((1600, 900), (9, 18, 38), (3, 7, 18), (120, 104, 255))
    left_flavor = tint_image(fit_image(front_device, (430, 700)), (155, 106, 255), 0.30)
    center_flavor = tint_image(fit_image(front_device, (460, 740)), (88, 173, 255), 0.24)
    right_flavor = tint_image(fit_image(front_device, (430, 700)), (96, 231, 202), 0.22)
    layer(flavors, left_flavor, (145, 155), shadow_blur=26)
    layer(flavors, center_flavor, (565, 110), shadow_blur=28)
    layer(flavors, right_flavor, (1015, 155), shadow_blur=26)
    save(flavors, "topbar-9900-feature-5.png")


if __name__ == "__main__":
    create_assets()
