import io
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


CLASS_NAMES = [
    "Glioma",
    "Meningioma",
    "No Tumor",
    "Pituitary"
]

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "model" / "brain_tumor_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)


def predict_image(image_bytes: bytes):

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    image = image.resize((224, 224))

    image_array = np.array(
        image,
        dtype=np.float32
    )

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    image_array = (
        tf.keras.applications.mobilenet_v2.preprocess_input(
            image_array
        )
    )

    predictions = model.predict(
        image_array,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(predictions)
    )

    predicted_class = CLASS_NAMES[
        predicted_index
    ]

    confidence = float(
        predictions[predicted_index] * 100
    )

    probabilities = {
        CLASS_NAMES[i]: round(
            float(predictions[i] * 100),
            2
        )
        for i in range(len(CLASS_NAMES))
    }

    return {
        "prediction": predicted_class,
        "confidence": round(confidence, 2),
        "probabilities": probabilities
    }