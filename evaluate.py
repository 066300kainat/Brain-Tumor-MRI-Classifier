import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# =========================
# SETTINGS
# =========================

MODEL_PATH = "model/brain_tumor_model.keras"
TEST_DIR = "dataset/Testing"

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

CLASS_NAMES = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary"
]

# =========================
# LOAD MODEL
# =========================

print("Loading model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully!")

# =========================
# LOAD TEST DATASET
# =========================

print("\nLoading test dataset...")

test_dataset = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    labels="inferred",
    label_mode="int",
    class_names=CLASS_NAMES,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    color_mode="rgb",
    shuffle=False
)

# =========================
# GET TRUE LABELS
# =========================

true_labels = []

for images, labels in test_dataset:
    true_labels.extend(labels.numpy())

true_labels = np.array(true_labels)

# =========================
# PREDICTIONS
# =========================

print("\nGenerating predictions...")

predictions = model.predict(test_dataset)

predicted_labels = np.argmax(predictions, axis=1)

# =========================
# CLASSIFICATION REPORT
# =========================

print("\n" + "=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

report = classification_report(
    true_labels,
    predicted_labels,
    target_names=CLASS_NAMES,
    digits=4
)

print(report)

# =========================
# CONFUSION MATRIX
# =========================

cm = confusion_matrix(
    true_labels,
    predicted_labels
)

print("\n" + "=" * 60)
print("CONFUSION MATRIX")
print("=" * 60)

print(cm)

# =========================
# DISPLAY CONFUSION MATRIX
# =========================

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=CLASS_NAMES
)

fig, ax = plt.subplots(figsize=(8, 8))

disp.plot(
    ax=ax,
    cmap="Blues",
    xticks_rotation=45
)

plt.title("Brain Tumor MRI Classification - Confusion Matrix")
plt.tight_layout()

plt.savefig("confusion_matrix.png")

print("\nConfusion matrix saved as: confusion_matrix.png")

plt.show()

# =========================
# OVERALL ACCURACY
# =========================

accuracy = np.mean(true_labels == predicted_labels)

print("\n" + "=" * 60)
print(f"Overall Test Accuracy: {accuracy * 100:.2f}%")
print("=" * 60)