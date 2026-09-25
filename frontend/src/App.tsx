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
      setError("Please select an MRI image first.");
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
        setError("Unable to connect to the API.");
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

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="nav-inner">

          <div className="brand">
            <div className="brand-icon">✚</div>

            <div>
              <strong>NeuroScan AI</strong>
              <span>Brain MRI Analysis</span>
            </div>
          </div>

          <div className="nav-status">
            <span className="status-dot"></span>
            API Connected
          </div>

        </div>
      </nav>


      {/* HERO */}

      <header className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <span>✦</span>
            AI-POWERED MEDICAL IMAGING
          </div>

          <h1>
            Brain MRI
            <span>Classification</span>
          </h1>

          <p>
            Analyze brain MRI images using a trained
            MobileNetV2 deep learning model and receive
            an instant classification across four categories.
          </p>

          <div className="hero-stats">

            <div>
              <strong>4</strong>
              <span>Classes</span>
            </div>

            <div>
              <strong>224×224</strong>
              <span>Input Size</span>
            </div>

            <div>
              <strong>84.44%</strong>
              <span>Test Accuracy</span>
            </div>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="main-container">

        {/* UPLOAD SECTION */}

        <section className="workspace">

          <div className="workspace-header">

            <div>
              <div className="eyebrow">
                ANALYSIS WORKSPACE
              </div>

              <h2>Upload MRI Scan</h2>

              <p>
                Select a brain MRI image to begin the
                classification process.
              </p>
            </div>

            {file && (
              <button
                className="reset-button"
                onClick={resetScan}
              >
                ↻ New Scan
              </button>
            )}

          </div>


          <label className="upload-box">

            {preview ? (

              <div className="preview-wrapper">

                <img
                  src={preview}
                  alt="Uploaded MRI"
                  className="preview-image"
                />

                <div className="preview-overlay">
                  <span>MRI Preview</span>
                </div>

              </div>

            ) : (

              <div className="upload-placeholder">

                <div className="upload-circle">
                  <span>↑</span>
                </div>

                <h3>Drop your MRI scan here</h3>

                <p>
                  or click to browse from your computer
                </p>

                <div className="file-types">
                  <span>JPG</span>
                  <span>JPEG</span>
                  <span>PNG</span>
                  <small>Maximum supported image formats</small>
                </div>

              </div>

            )}

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />

          </label>


          {/* FILE INFORMATION */}

          {file && (

            <div className="file-card">

              <div className="file-icon">
                IMG
              </div>

              <div className="file-info">
                <span>Selected MRI scan</span>
                <strong>{file.name}</strong>
              </div>

              <div className="file-check">
                ✓
              </div>

            </div>

          )}


          {/* ANALYZE */}

          <button
            className="analyze-button"
            onClick={analyzeMRI}
            disabled={loading || !file}
          >

            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing MRI...
              </>
            ) : (
              <>
                Analyze MRI Scan
                <span className="button-arrow">→</span>
              </>
            )}

          </button>


          {error && (
            <div className="error-message">
              <span>!</span>
              {error}
            </div>
          )}

        </section>


        {/* RESULT */}

        {result && (

          <section className="results-section">

            <div className="results-heading">

              <div>
                <div className="eyebrow">
                  ANALYSIS COMPLETE
                </div>

                <h2>Classification Result</h2>
              </div>

              <div className="result-status">
                ✓ Prediction Generated
              </div>

            </div>


            <div className="result-grid">

              {/* MAIN RESULT */}

              <div className="result-main">

                <div className="result-icon">
                  ✦
                </div>

                <span className="result-caption">
                  DETECTED CLASS
                </span>

                <h3>
                  {result.prediction}
                </h3>

                <p>
                  The model classified the uploaded MRI
                  image as <strong>{result.prediction}</strong>.
                </p>

                <div className="confidence">

                  <div className="confidence-top">
                    <span>Model Confidence</span>
                    <strong>{result.confidence}%</strong>
                  </div>

                  <div className="confidence-track">
                    <div
                      className="confidence-fill"
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    />
                  </div>

                </div>

              </div>


              {/* PROBABILITIES */}

              <div className="probability-card">

                <div className="card-title">
                  <div>
                    <span className="eyebrow">
                      MODEL OUTPUT
                    </span>

                    <h3>Class Probabilities</h3>
                  </div>

                  <span className="chart-icon">
                    %
                  </span>
                </div>


                <div className="probabilities">

                  {Object.entries(
                    result.probabilities
                  ).map(([name, value]) => (

                    <div
                      className="probability-row"
                      key={name}
                    >

                      <div className="probability-label">
                        <span>{name}</span>
                        <strong>{value}%</strong>
                      </div>

                      <div className="probability-track">

                        <div
                          className="probability-fill"
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


        {/* MODEL INFORMATION */}

        <section className="info-section">

          <div className="section-title">

            <div className="eyebrow">
              MODEL INFORMATION
            </div>

            <h2>
              Built for efficient image classification
            </h2>

            <p>
              This application uses a lightweight deep learning
              architecture optimized for image classification.
            </p>

          </div>


          <div className="info-grid">

            <div className="info-card">

              <div className="info-number">
                01
              </div>

              <div className="info-card-icon">
                AI
              </div>

              <h3>MobileNetV2</h3>

              <p>
                Lightweight convolutional neural network
                architecture designed for efficient image
                classification.
              </p>

            </div>


            <div className="info-card">

              <div className="info-number">
                02
              </div>

              <div className="info-card-icon">
                224
              </div>

              <h3>Image Processing</h3>

              <p>
                Uploaded MRI images are resized to
                224×224 pixels and processed using the
                MobileNetV2 preprocessing pipeline.
              </p>

            </div>


            <div className="info-card">

              <div className="info-number">
                03
              </div>

              <div className="info-card-icon">
                4
              </div>

              <h3>Four Classes</h3>

              <p>
                The model provides probabilities for
                Glioma, Meningioma, No Tumor and Pituitary.
              </p>

            </div>


            <div className="info-card">

              <div className="info-number">
                04
              </div>

              <div className="info-card-icon">
                API
              </div>

              <h3>FastAPI Backend</h3>

              <p>
                React communicates with a FastAPI REST
                API that processes the MRI and returns
                model predictions.
              </p>

            </div>

          </div>

        </section>


        {/* HOW IT WORKS */}

        <section className="how-section">

          <div className="section-title centered">

            <div className="eyebrow">
              WORKFLOW
            </div>

            <h2>How it works</h2>

            <p>
              A simple three-step AI-powered analysis workflow.
            </p>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                1
              </div>

              <h3>Upload</h3>

              <p>
                Select a JPG, JPEG or PNG brain MRI scan.
              </p>

            </div>


            <div className="step-line"></div>


            <div className="step">

              <div className="step-number">
                2
              </div>

              <h3>Analyze</h3>

              <p>
                FastAPI sends the image to the trained
                MobileNetV2 model.
              </p>

            </div>


            <div className="step-line"></div>


            <div className="step">

              <div className="step-number">
                3
              </div>

              <h3>Result</h3>

              <p>
                View the predicted class and probability
                distribution.
              </p>

            </div>

          </div>

        </section>


        {/* DISCLAIMER */}

        <section className="disclaimer">

          <div className="disclaimer-symbol">
            !
          </div>

          <div>

            <strong>
              Educational & Research Use Only
            </strong>

            <p>
              This application is intended for educational
              and research purposes only. It is not a medical
              diagnostic tool and should not replace evaluation
              or advice from a qualified healthcare professional.
            </p>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-brand">
          <div className="brand-icon">✚</div>

          <div>
            <strong>NeuroScan AI</strong>
            <span>Brain MRI Classification</span>
          </div>
        </div>

        <p>
          MobileNetV2 • FastAPI • React • TypeScript
        </p>

        <span>
          © 2026 Brain Tumor MRI Classifier
        </span>

      </footer>

    </div>
  );
}

export default App;