\# 🧠 Brain Tumor MRI Classifier



An AI-powered web application that classifies brain MRI images into four categories using a trained MobileNetV2 deep learning model.



The application provides a simple and interactive Streamlit interface where users can upload an MRI image, run the trained model, and view the predicted class along with the model's confidence and probability distribution.



\---



\## 🚀 Features



\- 🧠 Brain MRI image classification

\- 📤 Upload JPG, JPEG, and PNG images

\- 🤖 MobileNetV2 transfer learning model

\- 📊 Four-class classification

\- 📈 Prediction confidence

\- 📉 Probability distribution for all classes

\- 🖼️ MRI image preview

\- ⚡ Interactive Streamlit interface

\- 📱 Responsive and clean UI

\- ⚠️ Medical-use disclaimer



\---



\## 🎯 Classification Classes



The model classifies MRI images into four categories:



| Class | Description |

|---|---|

| Glioma | Glioma tumor category |

| Meningioma | Meningioma tumor category |

| No Tumor | No tumor detected by the model |

| Pituitary | Pituitary tumor category |



\---



\## 🛠️ Technologies Used



\- Python

\- TensorFlow

\- Keras

\- MobileNetV2

\- NumPy

\- Pillow

\- Streamlit



\---



\## 🧠 Model



The application uses \*\*MobileNetV2\*\* with transfer learning for image classification.



\### Model Configuration



\- \*\*Architecture:\*\* MobileNetV2

\- \*\*Input Size:\*\* 224 × 224

\- \*\*Number of Classes:\*\* 4

\- \*\*Test Accuracy:\*\* 84.44%

\- \*\*Preprocessing:\*\* MobileNetV2 `preprocess\_input`



The trained model is loaded from:



```text

model/brain\_tumor\_model.keras

