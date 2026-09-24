from pathlib import Path
from PIL import Image

TRAIN_DIR = Path("dataset/Training")
TEST_DIR = Path("dataset/Testing")

classes = ["glioma", "meningioma", "notumor", "pituitary"]

print("\n===== TRAINING DATA =====")

for class_name in classes:
    folder = TRAIN_DIR / class_name
    images = list(folder.glob("*"))
    print(f"{class_name}: {len(images)} images")

print("\n===== TESTING DATA =====")

for class_name in classes:
    folder = TEST_DIR / class_name
    images = list(folder.glob("*"))
    print(f"{class_name}: {len(images)} images")

print("\n===== SAMPLE IMAGE =====")

sample_folder = TRAIN_DIR / "glioma"
sample_image = next(sample_folder.glob("*"))

print("Sample image:", sample_image)

with Image.open(sample_image) as img:
    print("Image format:", img.format)
    print("Image size:", img.size)
    print("Color mode:", img.mode)

print("\nDataset check completed successfully!")