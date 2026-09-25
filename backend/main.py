from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .prediction import predict_image


app = FastAPI(
    title="Brain Tumor MRI Classifier API",
    description="REST API for Brain MRI classification using MobileNetV2.",
    version="1.0.0"
)


# =========================
# CORS
# =========================


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",

        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROOT
# =========================

@app.get("/")
def root():

    return {
        "success": True,
        "message": "Brain Tumor MRI Classifier API is running!"
    }


# =========================
# HEALTH
# =========================

@app.get("/health")
def health():

    return {
        "success": True,
        "status": "healthy"
    }


# =========================
# CLASSES
# =========================

@app.get("/classes")
def classes():

    return {
        "success": True,
        "classes": [
            "Glioma",
            "Meningioma",
            "No Tumor",
            "Pituitary"
        ]
    }


# =========================
# PREDICT
# =========================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be detected."
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    try:

        result = predict_image(image_bytes)

        return {
            "success": True,
            "filename": file.filename,
            **result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )