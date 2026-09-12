# -*- coding: utf-8 -*-
"""تولید ۱۰۰ عکس نمونه زیبا (PIL) + فایل photos.js + فایل samples.js (۱۰۰ نمونه‌کارت)"""
import os, random
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SHARED = os.path.join(HERE, "..", "shared")
PHOTOS = os.path.join(SHARED, "photos")
os.makedirs(PHOTOS, exist_ok=True)
random.seed(20260912)
W, H = 640, 960

PALETTES = [  # (نام، رنگ بالا، میانی، پایین)
    ("sunset",   (64, 20, 90),   (200, 60, 120),  (255, 170, 60)),
    ("ocean",    (4, 40, 90),    (10, 120, 180),  (140, 230, 220)),
    ("spring",   (20, 110, 70),  (110, 200, 120), (255, 240, 170)),
    ("night",    (8, 8, 40),     (40, 40, 110),   (150, 80, 200)),
    ("yalda",    (60, 5, 20),    (170, 20, 50),   (30, 20, 70)),
    ("love",     (90, 10, 50),   (220, 60, 110),  (255, 170, 190)),
    ("gold",     (40, 25, 5),    (160, 110, 30),  (255, 220, 130)),
    ("mint",     (5, 90, 90),    (40, 190, 170),  (230, 255, 240)),
    ("cosmos",   (30, 10, 70),   (110, 40, 170),  (240, 140, 220)),
    ("peach",    (120, 50, 90),  (240, 130, 140), (255, 230, 180)),
]

def vgrad(c1, c2, c3):
    s = Image.new("RGB", (8, 96)); px = s.load()
    for y in range(96):
        t = y / 95.0
        if t < 0.5:
            k = t * 2; col = tuple(int(a + (b - a) * k) for a, b in zip(c1, c2))
        else:
            k = (t - 0.5) * 2; col = tuple(int(a + (b - a) * k) for a, b in zip(c2, c3))
        for x in range(8): px[x, y] = col
    return s.resize((W, H), Image.BILINEAR)

def blob(color, size, blur=0, alpha=110):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    m = size // 4  # حاشیه داخلی تا لبه‌ها کاملاً محو شوند
    ImageDraw.Draw(im).ellipse([m, m, size - m, size - m], fill=color + (255,))
    im = im.filter(ImageFilter.GaussianBlur(size // 8))
    a = im.split()[3].point(lambda v: int(v * alpha / 255))
    im.putalpha(a)
    return im

def vignette(im, strength=90):
    m = Image.new("L", (W // 4, H // 4), 0); d = ImageDraw.Draw(m)
    d.ellipse([-W // 8, -H // 8, W // 4 + W // 8, H // 4 + H // 8], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(20)).resize((W, H))
    m = m.point(lambda v: 255 - int((255 - v) * strength / 255))
    black = Image.new("RGB", (W, H), (0, 0, 0))
    return Image.composite(im, black, m)

def sparkles(im, n, color=(255, 255, 255), mx=200):
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(n):
        x, y = random.randrange(W), random.randrange(H)
        r = random.choice([1, 1, 2, 2, 3])
        d.ellipse([x - r, y - r, x + r, y + r], fill=color + (random.randrange(90, mx),))
    return im

def motif_bokeh(im):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for _ in range(26):
        s = random.randrange(30, 150)
        b = blob((255, 255, 255), s, blur=s // 5, alpha=random.randrange(25, 70))
        lay.alpha_composite(b, (random.randrange(-s // 2, W - s // 2), random.randrange(-s // 2, H - s // 2)))
    return Image.alpha_composite(im.convert("RGBA"), lay).convert("RGB")

def motif_rays(im):
    d = ImageDraw.Draw(im, "RGBA")
    for _ in range(14):
        x = random.randrange(-100, W)
        d.polygon([(x, 0), (x + 60, 0), (x - 140, H), (x - 200, H)], fill=(255, 255, 255, 14))
    return im

def motif_crescent(im):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    cx, cy, r = W // 2 + random.randrange(-80, 80), H // 3, 120
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 240, 200, 235))
    d.ellipse([cx - r + 48, cy - r - 18, cx + r + 48, cy + r - 18], fill=(0, 0, 0, 0))
    im2 = Image.alpha_composite(im.convert("RGBA"), lay)
    # هلال واقعی با برش
    mask = Image.new("L", (W, H), 0); dm = ImageDraw.Draw(mask)
    dm.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    dm.ellipse([cx - r + 52, cy - r - 20, cx + r + 52, cy + r - 20], fill=0)
    gold = Image.new("RGBA", (W, H), (255, 225, 150, 255))
    hole = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    moon = Image.composite(gold, hole, mask).filter(ImageFilter.GaussianBlur(1))
    base = im.convert("RGBA"); base.alpha_composite(moon)
    return sparkles(base.convert("RGB"), 120)

def motif_petals(im):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay, "RGBA")
    cols = [(255, 150, 180), (255, 200, 210), (240, 120, 160)]
    for _ in range(40):
        x, y = random.randrange(W), random.randrange(H)
        rx, ry = random.randrange(8, 26), random.randrange(5, 12)
        d.ellipse([x - rx, y - ry, x + rx, y + ry], fill=random.choice(cols) + (110,))
    lay = lay.filter(ImageFilter.GaussianBlur(2))
    return Image.alpha_composite(im.convert("RGBA"), lay).convert("RGB")

def motif_waves(im):
    d = ImageDraw.Draw(im, "RGBA")
    for row in range(0, H, 46):
        for x in range(0, W, 30):
            y = row + int(10 * __import__("math").sin(x / 60 + row))
            d.ellipse([x - 5, y - 5, x + 5, y + 5], fill=(255, 255, 255, 40))
    return im

MOTIFS = [motif_bokeh, motif_rays, motif_crescent, motif_petals, motif_waves,
          motif_bokeh, motif_petals, motif_rays, motif_waves, motif_bokeh]

print("🖼️ تولید ۱۰۰ عکس نمونه...")
for i in range(100):
    pal = PALETTES[i % 10]
    im = vgrad(pal[1], pal[2], pal[3])
    # گوی‌های نورانی
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for _ in range(6):
        s = random.randrange(120, 340)
        c = random.choice([(255, 255, 255), (255, 220, 160), (255, 170, 200), (170, 220, 255)])
        lay.alpha_composite(blob(c, s, blur=s // 4, alpha=random.randrange(40, 95)),
                            (random.randrange(-s // 3, W - s * 2 // 3), random.randrange(-s // 3, H - s * 2 // 3)))
    im = Image.alpha_composite(im.convert("RGBA"), lay).convert("RGB")
    im = MOTIFS[i % 10](im)
    im = sparkles(im, 60)
    im = vignette(im)
    im.save(os.path.join(PHOTOS, "p%03d.jpg" % (i + 1)), quality=70)
print("✅ عکس‌ها ساخته شد.")

# ---------- photos.js ----------
TITLES_PH = ["غروب رؤیایی", "اقیانوس آرام", "بهار دل‌انگیز", "شب پرستاره", "شب یلدایی",
             "عاشقانه", "طلایی لوکس", "نعنایی خنک", "کهکشان بنفش", "هلویی لطیف"]
with open(os.path.join(SHARED, "photos.js"), "w", encoding="utf-8") as f:
    f.write("// ۱۰۰ عکس نمونه — تولید خودکار\nconst PHOTOS=[\n")
    for i in range(100):
        prem = "true" if i >= 75 else "false"  # ۲۵ عکس آخر پرمیوم
        f.write("{f:'photos/p%03d.jpg',t:'%s %d',premium:%s},\n" % (i + 1, TITLES_PH[i % 10], i // 10 + 1, prem))
    f.write("];\n")
print("✅ photos.js ساخته شد.")
