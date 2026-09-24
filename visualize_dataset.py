import matplotlib.pyplot as plt
from pathlib import Path
from PIL import Image

TRAIN_DIR = Path("dataset/Training")

classes = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary"
]

plt.figure(figsize=(12, 10))

for i, class_name in enumerate(classes):
    folder = TRAIN_DIR / class_name

    # First image from each class
    image_path = next(folder.glob("*"))

    image = Image.open(image_path)

    plt.subplot(2, 2, i + 1)
    plt.imshow(image, cmap="gray")
    plt.title(class_name.upper())
    plt.axis("off")

plt.tight_layout()

plt.savefig("dataset_samples.png")

plt.show()