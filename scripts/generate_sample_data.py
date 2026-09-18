import os
from PIL import Image, ImageDraw

IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_images")
os.makedirs(IMG_DIR, exist_ok=True)

# 1. Red Brick Sample
img_brick = Image.new("RGB", (400, 300), color=(178, 54, 38))
draw = ImageDraw.Draw(img_brick)
for y in range(0, 300, 50):
    draw.line([(0, y), (400, y)], fill=(120, 35, 25), width=3)
for y in range(0, 300, 50):
    offset = 50 if (y // 50) % 2 == 0 else 0
    for x in range(offset, 400, 100):
        draw.line([(x, y), (x, y + 50)], fill=(120, 35, 25), width=3)
img_brick.save(os.path.join(IMG_DIR, "sample_red_brick.jpg"))

# 2. Steel Rods Sample
img_steel = Image.new("RGB", (400, 300), color=(60, 65, 70))
draw = ImageDraw.Draw(img_steel)
for x in range(20, 400, 40):
    draw.rectangle([x, 0, x + 15, 300], fill=(130, 138, 145), outline=(40, 45, 50))
    for y in range(0, 300, 20):
        draw.line([(x, y), (x + 15, y + 8)], fill=(190, 195, 200), width=2)
img_steel.save(os.path.join(IMG_DIR, "sample_steel_rods.jpg"))

# 3. Wood Timber Sample
img_wood = Image.new("RGB", (400, 300), color=(160, 110, 60))
draw = ImageDraw.Draw(img_wood)
for y in range(15, 300, 30):
    draw.line([(0, y), (400, y + 5)], fill=(120, 75, 35), width=2)
img_wood.save(os.path.join(IMG_DIR, "sample_wood_timber.jpg"))

# 4. Concrete Aggregates Sample
img_concrete = Image.new("RGB", (400, 300), color=(140, 142, 145))
draw = ImageDraw.Draw(img_concrete)
import random
random.seed(42)
for _ in range(300):
    rx = random.randint(0, 380)
    ry = random.randint(0, 280)
    rw = random.randint(5, 25)
    rh = random.randint(5, 20)
    shade = random.randint(90, 180)
    draw.ellipse([rx, ry, rx + rw, ry + rh], fill=(shade, shade, shade))
img_concrete.save(os.path.join(IMG_DIR, "sample_concrete_rubble.jpg"))

# 5. Ceramic Tiles Sample
img_tiles = Image.new("RGB", (400, 300), color=(220, 225, 230))
draw = ImageDraw.Draw(img_tiles)
for x in range(0, 400, 100):
    draw.line([(x, 0), (x, 300)], fill=(70, 80, 90), width=4)
for y in range(0, 300, 100):
    draw.line([(0, y), (400, y)], fill=(70, 80, 90), width=4)
img_tiles.save(os.path.join(IMG_DIR, "sample_ceramic_tiles.jpg"))

print(f"Generated 5 realistic test images in {IMG_DIR}")
