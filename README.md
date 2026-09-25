# 🧠 Brain Tumor MRI Classifier

An AI-powered Brain Tumor MRI Classification project that uses a trained **MobileNetV2 deep learning model** to classify brain MRI scans into four categories:

- Glioma
- Meningioma
- No Tumor
- Pituitary

The project includes a **Streamlit interface**, a **FastAPI REST API**, and a **React + TypeScript frontend**.

---

## 🚀 Project Overview

This project demonstrates an end-to-end AI medical imaging workflow:

1. Upload a brain MRI image.
2. Process the image using MobileNetV2 preprocessing.
3. Run the trained deep learning model.
4. Classify the MRI into one of four categories.
5. Display prediction confidence and class probabilities.
6. Access the same prediction functionality through a REST API.
7. Use a modern React frontend connected to the FastAPI backend.

> ⚠️ **Educational / Research Use Only:**  
> This project is intended for educational and research purposes. It is not a medical diagnosis tool and should not replace professional medical advice.

---

## 🛠️ Technologies Used

### Machine Learning

- Python
- TensorFlow
- Keras
- MobileNetV2
- NumPy
- Pillow
- Scikit-learn

### Backend

- FastAPI
- Uvicorn
- Python
- REST API
- CORS
- Multipart File Upload

### Frontend

- React
- TypeScript
- Vite
- CSS
- Fetch API

### Original UI

- Streamlit

---

## 📂 Project Structure

```text
Brain-Tumor-MRI-Classifier/
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   └── prediction.py
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── model/
│   └── brain_tumor_model.keras
│
├── dataset/
│   ├── Training/
│   │   ├── glioma/
│   │   ├── meningioma/
│   │   ├── notumor/
│   │   └── pituitary/
│   │
│   └── Testing/
│       ├── glioma/
│       ├── meningioma/
│       ├── notumor/
│       └── pituitary/
│
├── app.py
├── train.py
├── evaluate.py
├── check_dataset.py
├── visualize_dataset.py
├── requirements.txt
└── README.md
