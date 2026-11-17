"""App icons for the installed game (PWA): the HUD's goggles emblem in brass on dark glass.
Run: python3 -I scripts/icons/make-icons.py  (writes public/icons/*.png)"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parents[2] / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)
INK, GLASS, BRASS, GOLD = (33, 27, 23), (48, 42, 36), (185, 133, 62), (232, 194, 122)


def icon(size: int, safe: float) -> Image.Image:
    s = size * 4  # draw large, then shrink for smooth edges
    im = Image.new("RGB", (s, s), INK)
    d = ImageDraw.Draw(im)
    r = s * safe / 2
    c = s / 2
    d.ellipse([c - r, c - r, c + r, c + r], fill=GLASS, outline=BRASS, width=int(s * 0.035))
    # Goggles from the HUD emblem (34x34 grid), scaled into the disc.
    k = r * 1.5 / 34
    ox, oy = c - 17 * k, c - 17 * k
    p = lambda x, y: (ox + x * k, oy + y * k)
    w = int(3.2 * k)
    for cx in (10, 24):
        x, y = p(cx, 17)
        d.ellipse([x - 6 * k, y - 6 * k, x + 6 * k, y + 6 * k], outline=GOLD, width=w)
    d.line([p(16, 16), p(18, 16)], fill=GOLD, width=w)
    d.line([p(4, 14), p(2, 8)], fill=GOLD, width=w)
    d.line([p(30, 14), p(32, 8)], fill=GOLD, width=w)
    d.line([p(8, 11), p(8, 8), p(26, 8), p(26, 11)], fill=GOLD, width=w, joint="curve")
    return im.resize((size, size), Image.LANCZOS)


icon(192, 0.92).save(OUT / "icon-192.png")
icon(512, 0.92).save(OUT / "icon-512.png")
icon(512, 0.72).save(OUT / "icon-maskable-512.png")  # inside Android's round/squircle crop
icon(180, 0.92).save(OUT / "apple-touch-icon.png")
print("written", sorted(p.name for p in OUT.iterdir()))
