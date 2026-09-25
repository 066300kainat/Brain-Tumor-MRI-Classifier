import { useState } from "react";
import "./App.css";

interface PredictionResult {
  success: boolean;
  filename: string;
  prediction: string;
  confidence: number;
  probabilities: {
    Glioma: number;
    Meningioma: number;
    "No Tumor": number;
    Pituitary: number;
  };
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const analyzeMRI = async () => {
    if (!file) {
      setError("Please upload an MRI image before starting the analysis.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed.");
      }

      setResult(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to connect to the FastAPI server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return "High confidence";
    if (confidence >= 70) return "Moderate confidence";
    return "Low confidence";
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="nav-container">

          <a className="brand" href="#top">

            <div className="brand-mark">
              <span>+</span>
            </div>

            <div className="brand-text">
              <strong>NeuroScan</strong>
              <span>AI MEDICAL IMAGING</span>
            </div>

          </a>

          <div className="nav-links">
            <a href="#analysis">Analysis</a>
            <a href="#model">Model</a>
            <a href="#workflow">How it works</a>
          </div>

          <div className="api-status">
            <span className="status-indicator"></span>
            <span>API Online</span>
          </div>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <header className="hero" id="top">

        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-container">

          <div className="hero-content">

            <div className="hero-label">
              <span className="spark">✦</span>
              AI-POWERED BRAIN MRI CLASSIFICATION
            </div>

            <h1>
              Intelligent
              <span>Brain Imaging.</span>
            </h1>

            <p>
              Upload a brain MRI scan and analyze it with a
              trained MobileNetV2 deep learning model.
              Get a classification and probability distribution
              in seconds.
            </p>

            <div className="hero-actions">

              <a href="#analysis" className="primary-hero-button">
                Start Analysis
                <span>→</span>
              </a>

              <a href="#model" className="secondary-hero-button">
                Explore Model
              </a>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="scan-orbit orbit-one"></div>
            <div className="scan-orbit orbit-two"></div>

            <div className="brain-visual">

              <div className="brain-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="brain-symbol">
                🧠
              </div>

              <div className="scan-line"></div>

            </div>

            <div className="floating-card floating-top">
              <div className="floating-icon">AI</div>
              <div>
                <strong>MobileNetV2</strong>
                <span>Deep Learning Model</span>
              </div>
            </div>

            <div className="floating-card floating-bottom">
              <span className="mini-dot"></span>
              <div>
                <strong>4 Classes</strong>
                <span>Classification Ready</span>
              </div>
            </div>

          </div>

        </div>


        {/* HERO STATS */}

        <div className="hero-metrics">

          <div className="metric">
            <strong>84.44%</strong>
            <span>Test Accuracy</span>
          </div>

          <div className="metric">
            <strong>4</strong>
            <span>Detection Classes</span>
          </div>

          <div className="metric">
            <strong>224×224</strong>
            <span>Input Resolution</span>
          </div>

          <div className="metric">
            <strong>AI</strong>
            <span>Deep Learning</span>
          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="main-container">


        {/* ================= ANALYSIS ================= */}

        <section
          className="analysis-section"
          id="analysis"
        >

          <div className="section-header">

            <div>

              <div className="section-kicker">
                ANALYSIS WORKSPACE
              </div>

              <h2>
                Analyze your MRI scan
              </h2>

              <p>
                Upload a supported brain MRI image to
                begin AI-powered classification.
              </p>

            </div>

            {file && (
              <button
                className="reset-button"
                onClick={resetScan}
              >
                <span>↻</span>
                New Scan
              </button>
            )}

          </div>


          <div className="analysis-card">

            {/* UPLOAD */}

            <label
              className={`upload-zone ${
                preview ? "has-preview" : ""
              }`}
            >

              {preview ? (

                <div className="preview-container">

                  <img
                    src={preview}
                    alt="Uploaded brain MRI preview"
                    className="mri-preview"
                  />

                  <div className="preview-badge">
                    <span>✓</span>
                    MRI Loaded
                  </div>

                  <div className="preview-change">
                    Click to replace image
                  </div>

                </div>

              ) : (

                <div className="upload-content">

                  <div className="upload-icon-wrapper">

                    <div className="upload-icon">
                      ↑
                    </div>

                  </div>

                  <h3>
                    Upload your MRI scan
                  </h3>

                  <p>
                    Drag & drop your image here or
                    <strong> browse files</strong>
                  </p>

                  <div className="supported-formats">

                    <span>JPG</span>
                    <span>JPEG</span>
                    <span>PNG</span>

                  </div>

                  <small>
                    Supported image formats
                  </small>

                </div>

              )}

              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />

            </label>


            {/* FILE INFO */}

            {file && (

              <div className="file-information">

                <div className="file-left">

                  <div className="file-thumbnail">
                    IMG
                  </div>

                  <div className="file-details">

                    <span>Selected image</span>

                    <strong>
                      {file.name}
                    </strong>

                  </div>

                </div>

                <div className="file-ready">
                  <span>✓</span>
                  Ready
                </div>

              </div>

            )}


            {/* ANALYZE BUTTON */}

            <button
              className="analyze-button"
              onClick={analyzeMRI}
              disabled={loading || !file}
            >

              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing MRI...
                </>
              ) : (
                <>
                  <span className="button-ai">✦</span>
                  Analyze MRI Scan
                  <span className="button-arrow">→</span>
                </>
              )}

            </button>


            {error && (

              <div className="error-box">

                <div className="error-icon">
                  !
                </div>

                <span>{error}</span>

              </div>

            )}

          </div>

        </section>


        {/* ================= RESULTS ================= */}

        {result && (

          <section className="results-section">

            <div className="results-header">

              <div>

                <div className="section-kicker">
                  ANALYSIS COMPLETE
                </div>

                <h2>
                  Classification results
                </h2>

              </div>

              <div className="completed-badge">
                <span>✓</span>
                Analysis Complete
              </div>

            </div>


            <div className="results-grid">


              {/* RESULT CARD */}

              <div className="prediction-card">

                <div className="prediction-card-top">

                  <div className="prediction-icon">
                    ✦
                  </div>

                  <span className="prediction-label">
                    PREDICTED CLASS
                  </span>

                </div>

                <h3>
                  {result.prediction}
                </h3>

                <p>
                  The AI model identified this image as
                  <strong> {result.prediction}</strong>.
                </p>


                <div className="confidence-area">

                  <div className="confidence-header">

                    <span>
                      Model confidence
                    </span>

                    <strong>
                      {result.confidence}%
                    </strong>

                  </div>

                  <div className="confidence-bar">

                    <div
                      className="confidence-progress"
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    />

                  </div>

                  <span className="confidence-level">
                    {getConfidenceLevel(result.confidence)}
                  </span>

                </div>

              </div>


              {/* PROBABILITY CARD */}

              <div className="probability-card">

                <div className="probability-header-main">

                  <div>

                    <div className="section-kicker">
                      MODEL OUTPUT
                    </div>

                    <h3>
                      Class probabilities
                    </h3>

                  </div>

                  <div className="percent-icon">
                    %
                  </div>

                </div>


                <div className="probability-list">

                  {Object.entries(
                    result.probabilities
                  ).map(([name, value]) => (

                    <div
                      className="probability-item"
                      key={name}
                    >

                      <div className="probability-name">

                        <span>{name}</span>

                        <strong>
                          {value}%
                        </strong>

                      </div>

                      <div className="probability-track">

                        <div
                          className={`probability-progress ${
                            name === result.prediction
                              ? "active"
                              : ""
                          }`}
                          style={{
                            width: `${value}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </section>

        )}


        {/* ================= MODEL ================= */}

        <section
          className="model-section"
          id="model"
        >

          <div className="section-header model-heading">

            <div>

              <div className="section-kicker">
                THE TECHNOLOGY
              </div>

              <h2>
                Built with modern AI
              </h2>

              <p>
                A lightweight deep learning pipeline designed
                for efficient image classification.
              </p>

            </div>

          </div>


          <div className="model-grid">


            <div className="technology-card featured-tech">

              <div className="tech-number">
                01
              </div>

              <div className="tech-icon">
                AI
              </div>

              <h3>
                MobileNetV2
              </h3>

              <p>
                A lightweight convolutional neural network
                architecture optimized for efficient image
                classification.
              </p>

              <div className="tech-tag">
                Deep Learning
              </div>

            </div>


            <div className="technology-card">

              <div className="tech-number">
                02
              </div>

              <div className="tech-icon">
                224
              </div>

              <h3>
                Image Processing
              </h3>

              <p>
                Every uploaded MRI is resized to 224×224
                pixels and processed using the MobileNetV2
                preprocessing pipeline.
              </p>

              <div className="tech-tag">
                Computer Vision
              </div>

            </div>


            <div className="technology-card">

              <div className="tech-number">
                03
              </div>

              <div className="tech-icon">
                4×
              </div>

              <h3>
                Four Classes
              </h3>

              <p>
                The model provides probability scores for
                Glioma, Meningioma, No Tumor and Pituitary.
              </p>

              <div className="tech-tag">
                Multi-Class
              </div>

            </div>


            <div className="technology-card">

              <div className="tech-number">
                04
              </div>

              <div className="tech-icon">
                API
              </div>

              <h3>
                FastAPI Backend
              </h3>

              <p>
                A FastAPI REST API handles image processing,
                model inference and structured prediction
                responses.
              </p>

              <div className="tech-tag">
                REST API
              </div>

            </div>

          </div>

        </section>


        {/* ================= WORKFLOW ================= */}

        <section
          className="workflow-section"
          id="workflow"
        >

          <div className="section-title-centered">

            <div className="section-kicker">
              SIMPLE WORKFLOW
            </div>

            <h2>
              From MRI to insight
            </h2>

            <p>
              Three simple steps power the classification pipeline.
            </p>

          </div>


          <div className="workflow">

            <div className="workflow-step">

              <div className="workflow-number">
                01
              </div>

              <div className="workflow-content">

                <h3>
                  Upload
                </h3>

                <p>
                  Select a JPG, JPEG or PNG brain MRI image.
                </p>

              </div>

            </div>


            <div className="workflow-connector"></div>


            <div className="workflow-step">

              <div className="workflow-number">
                02
              </div>

              <div className="workflow-content">

                <h3>
                  Process
                </h3>

                <p>
                  FastAPI preprocesses the image and sends
                  it to the trained model.
                </p>

              </div>

            </div>


            <div className="workflow-connector"></div>


            <div className="workflow-step">

              <div className="workflow-number">
                03
              </div>

              <div className="workflow-content">

                <h3>
                  Classify
                </h3>

                <p>
                  View the predicted class and complete
                  probability distribution.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================= DISCLAIMER ================= */}

        <section className="disclaimer">

          <div className="disclaimer-icon">
            !
          </div>

          <div>

            <strong>
              Educational & Research Use Only
            </strong>

            <p>
              NeuroScan AI is designed for educational and
              research purposes. The predictions generated
              by this application are not medical diagnoses
              and should not replace professional medical
              evaluation, advice or treatment.
            </p>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="brand-mark small">
              +
            </div>

            <div>
              <strong>NeuroScan</strong>
              <span>AI Medical Imaging</span>
            </div>

          </div>

          <div className="footer-tech">
            MobileNetV2 · TensorFlow · FastAPI · React
          </div>

          <div className="footer-copy">
            © 2026 NeuroScan AI
          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;