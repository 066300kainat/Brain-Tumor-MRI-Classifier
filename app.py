import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image


# =========================================================
# PAGE CONFIG
# =========================================================

st.set_page_config(
    page_title="Brain Tumor MRI Classifier",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)


# =========================================================
# CUSTOM CSS
# =========================================================

st.markdown(
    """
    <style>

    /* ================= MAIN APP ================= */

    .stApp {
        background: #f5f7fb;
    }

    .block-container {
        max-width: 1250px;
        padding-top: 2rem;
        padding-bottom: 2rem;
    }


    /* ================= HEADINGS ================= */

    h1 {
        color: #0f172a !important;
        font-size: 42px !important;
        font-weight: 800 !important;
        letter-spacing: -1px;
        margin-bottom: 5px !important;
    }

    h2 {
        color: #0f172a !important;
        font-weight: 750 !important;
    }

    h3 {
        color: #0f172a !important;
        font-weight: 700 !important;
    }

    p {
        color: #475569 !important;
    }


    /* ================= SIDEBAR ================= */

    section[data-testid="stSidebar"] {
        background: #0f172a;
    }

    section[data-testid="stSidebar"] * {
        color: #e2e8f0 !important;
    }

    section[data-testid="stSidebar"] h1,
    section[data-testid="stSidebar"] h2,
    section[data-testid="stSidebar"] h3 {
        color: #ffffff !important;
    }

    section[data-testid="stSidebar"] hr {
        border-color: #334155 !important;
    }


    /* ================= FILE UPLOADER ================= */

    [data-testid="stFileUploader"] {
        background: #ffffff;
        border: 2px dashed #93c5fd;
        border-radius: 18px;
        padding: 16px;
        box-shadow: 0 5px 20px rgba(15, 23, 42, 0.06);
    }

    [data-testid="stFileUploader"] section {
        background: transparent !important;
    }


    /* ================= ANALYZE BUTTON ================= */

    div.stButton > button {
        width: 100%;
        height: 58px;
        min-height: 58px;

        background-color: #1d4ed8 !important;
        color: #ffffff !important;

        border: none !important;
        border-radius: 14px !important;

        font-size: 17px !important;
        font-weight: 700 !important;

        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        text-align: center !important;
        line-height: 1 !important;

        padding: 0 20px !important;

        box-shadow: 0 6px 16px rgba(29, 78, 216, 0.20);

        transition: all 0.2s ease;
    }

    div.stButton > button:hover {
        background-color: #1e40af !important;
        color: #ffffff !important;
        transform: translateY(-1px);
    }

    div.stButton > button:active {
        transform: translateY(0);
    }

    div.stButton > button p {
        color: #ffffff !important;
        font-size: 17px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        text-align: center !important;

        margin: 0 !important;
        padding: 0 !important;

        visibility: visible !important;
        display: block !important;
    }


    /* ================= METRIC CARDS ================= */

    div[data-testid="stMetric"] {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 18px;

        box-shadow: 0 5px 18px rgba(15, 23, 42, 0.05);
    }

    div[data-testid="stMetricLabel"] {
        color: #64748b !important;
    }

    div[data-testid="stMetricValue"] {
        color: #0f172a !important;
        font-weight: 800 !important;
    }


    /* ================= IMAGE ================= */

    [data-testid="stImage"] img {
        border-radius: 18px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 5px 20px rgba(15, 23, 42, 0.08);
    }


    /* ================= PROGRESS ================= */

    [data-testid="stProgress"] {
        margin-top: 4px;
        margin-bottom: 10px;
    }


    /* ================= ALERTS ================= */

    div[data-testid="stAlert"] {
        border-radius: 14px;
    }


    /* ================= DIVIDER ================= */

    hr {
        border-color: #e2e8f0 !important;
    }


    /* ================= CAPTION ================= */

    .stCaption {
        color: #64748b !important;
    }


    /* ================= MOBILE ================= */

    @media (max-width: 768px) {

        h1 {
            font-size: 32px !important;
        }

        .block-container {
            padding-left: 1rem;
            padding-right: 1rem;
        }

    }

    </style>
    """,
    unsafe_allow_html=True,
)


# =========================================================
# MODEL SETTINGS
# =========================================================

IMG_SIZE = 224

CLASS_NAMES = [
    "Glioma",
    "Meningioma",
    "No Tumor",
    "Pituitary",
]

MODEL_PATH = "model/brain_tumor_model.keras"


# =========================================================
# LOAD MODEL
# =========================================================

@st.cache_resource
def load_model():
    return tf.keras.models.load_model(MODEL_PATH)


try:
    model = load_model()
    model_loaded = True

except Exception as e:
    model = None
    model_loaded = False

    st.error("❌ Model could not be loaded.")
    st.exception(e)


# =========================================================
# SESSION STATE
# =========================================================

if "predictions" not in st.session_state:
    st.session_state.predictions = None

if "predicted_class" not in st.session_state:
    st.session_state.predicted_class = None

if "confidence" not in st.session_state:
    st.session_state.confidence = None

if "last_file" not in st.session_state:
    st.session_state.last_file = None


# =========================================================
# SIDEBAR
# =========================================================

with st.sidebar:

    st.title("🧠 MRI Classifier")

    st.divider()

    st.subheader("Supported Classes")

    st.write("🔴 Glioma")
    st.write("🟠 Meningioma")
    st.write("🟢 No Tumor")
    st.write("🔵 Pituitary")

    st.divider()

    st.subheader("Model Information")

    st.write("**Architecture:** MobileNetV2")
    st.write("**Input Size:** 224 × 224")
    st.write("**Classes:** 4")
    st.write("**Test Accuracy:** 84.44%")

    st.divider()

    st.caption(
        "Transfer learning model trained for brain MRI image classification."
    )


# =========================================================
# MAIN HEADER
# =========================================================

st.title("🧠 Brain Tumor MRI Classifier")

st.write(
    "Upload a brain MRI scan and use a trained MobileNetV2 model "
    "to classify it into one of four image categories."
)

if model_loaded:
    st.success("✅ Model loaded successfully")

st.divider()


# =========================================================
# UPLOAD SECTION
# =========================================================

st.header("📤 Upload MRI Scan")

st.caption(
    "Choose a JPG, JPEG, or PNG brain MRI image."
)

uploaded_file = st.file_uploader(
    "Select MRI image",
    type=["jpg", "jpeg", "png"],
    label_visibility="collapsed",
)


# =========================================================
# RESET RESULT WHEN NEW FILE IS SELECTED
# =========================================================

if uploaded_file is not None:

    current_file = (
        uploaded_file.name
        + "_"
        + str(uploaded_file.size)
    )

    if current_file != st.session_state.last_file:

        st.session_state.predictions = None
        st.session_state.predicted_class = None
        st.session_state.confidence = None

        st.session_state.last_file = current_file


# =========================================================
# NO IMAGE
# =========================================================

if uploaded_file is None:

    st.info(
        "📁 No MRI image selected yet. "
        "Upload an image above to start the analysis."
    )


# =========================================================
# IMAGE PREVIEW + ANALYSIS
# =========================================================

if uploaded_file is not None:

    image = Image.open(uploaded_file).convert("RGB")

    st.divider()

    left, right = st.columns(
        [1.05, 0.95],
        gap="large"
    )


    # =====================================================
    # LEFT COLUMN - IMAGE
    # =====================================================

    with left:

        st.subheader("🖼️ MRI Preview")

        st.caption(
            f"{uploaded_file.name} • "
            f"{image.size[0]} × {image.size[1]} pixels"
        )

        st.image(
            image,
            width="stretch"
        )


    # =====================================================
    # RIGHT COLUMN - ANALYSIS
    # =====================================================

    with right:

        st.subheader("🔬 Analysis")

        st.write(
            "Run the trained MobileNetV2 model on the uploaded MRI scan."
        )

        st.write("")

        # -------------------------------------------------
        # ANALYZE BUTTON
        # -------------------------------------------------

        analyze_button = st.button(
            "Analyze MRI Scan",
            use_container_width=True
        )


        # =================================================
        # PREDICTION
        # =================================================

        if analyze_button:

            if not model_loaded:

                st.error(
                    "Model is not available. "
                    "Please check the model path."
                )

            else:

                with st.spinner("Analyzing MRI scan..."):

                    image_resized = image.resize(
                        (IMG_SIZE, IMG_SIZE)
                    )

                    image_array = np.array(
                        image_resized,
                        dtype=np.float32
                    )

                    image_array = np.expand_dims(
                        image_array,
                        axis=0
                    )

                    image_array = (
                        tf.keras.applications
                        .mobilenet_v2
                        .preprocess_input(
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

                    predicted_class = (
                        CLASS_NAMES[predicted_index]
                    )

                    confidence = float(
                        predictions[predicted_index] * 100
                    )

                    st.session_state.predictions = predictions

                    st.session_state.predicted_class = (
                        predicted_class
                    )

                    st.session_state.confidence = (
                        confidence
                    )

                st.success(
                    "Analysis completed successfully."
                )


        # =================================================
        # SHOW RESULT
        # =================================================

        if st.session_state.predicted_class is not None:

            st.write("### Prediction")

            result_col1, result_col2 = st.columns(2)

            with result_col1:

                st.metric(
                    "Predicted Class",
                    st.session_state.predicted_class
                )

            with result_col2:

                st.metric(
                    "Confidence",
                    f"{st.session_state.confidence:.2f}%"
                )

            st.write("")

            if st.session_state.predicted_class == "No Tumor":

                st.success(
                    "The model classified this image as No Tumor."
                )

            else:

                st.warning(
                    f"The model classified this image as "
                    f"{st.session_state.predicted_class}."
                )


# =========================================================
# PROBABILITY DISTRIBUTION
# =========================================================

if st.session_state.predictions is not None:

    st.divider()

    st.header("📊 Probability Distribution")

    st.caption(
        "Model confidence for each classification category."
    )

    predictions = st.session_state.predictions

    for class_name, probability in zip(
        CLASS_NAMES,
        predictions
    ):

        percentage = float(
            probability * 100
        )

        col1, col2 = st.columns(
            [4, 1]
        )

        with col1:

            st.write(
                f"**{class_name}**"
            )

            st.progress(
                min(
                    max(
                        percentage / 100,
                        0.0
                    ),
                    1.0
                )
            )

        with col2:

            st.write(
                f"**{percentage:.2f}%**"
            )


# =========================================================
# DISCLAIMER
# =========================================================

st.divider()

st.warning(
    "⚠️ This application is for educational and research "
    "purposes only. It is not a medical diagnosis tool. "
    "Always consult a qualified healthcare professional "
    "for medical interpretation."
)


# =========================================================
# FOOTER
# =========================================================

st.divider()

st.caption(
    "Brain Tumor MRI Classification • "
    "MobileNetV2 Transfer Learning • "
    "4-Class Image Classification"
)