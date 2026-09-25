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

    if (!selectedFile) {
      return;
    }

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
        throw new Error(
          data.detail || "Prediction failed."
        );
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

  return (
    <div className="app">

      {/* HERO */}

      <header className="hero">

        <div className="badge">
          AI Medical Imaging
        </div>

        <h1>
          Brain Tumor MRI Classifier
        </h1>

        <p>
          Upload a brain MRI scan and use our
          trained MobileNetV2 model to classify
          the image into four categories.
        </p>

      </header>


      <main className="container">

        {/* UPLOAD CARD */}

        <section className="card">

          <div className="section-heading">
            <div>
              <h2>Upload MRI Scan</h2>

              <p>
                Choose a JPG, JPEG, or PNG brain
                MRI image for analysis.
              </p>
            </div>
          </div>


          <label className="upload-area">

            {preview ? (
              <img
                src={preview}
                alt="MRI Preview"
                className="preview"
              />
            ) : (
              <div className="upload-content">

                <div className="upload-icon">
                  🧠
                </div>

                <h3>
                  Upload your MRI scan
                </h3>

                <p>
                  Click here to choose an image
                </p>

                <span>
                  JPG • JPEG • PNG
                </span>

              </div>
            )}

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />

          </label>


          {file && (
            <div className="selected-file">

              <span>Selected file</span>

              <strong>
                {file.name}
              </strong>

            </div>
          )}


          <button
            className="analyze-button"
            onClick={analyzeMRI}
            disabled={loading}
          >
            {loading
              ? "Analyzing MRI..."
              : "Analyze MRI Scan"}
          </button>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

        </section>


        {/* RESULT */}

        {result && (
          <section className="card result-card">

            <div className="result-top">

              <div>
                <span className="result-label">
                  Prediction Result
                </span>

                <h2 className="prediction">
                  {result.prediction}
                </h2>
              </div>


              <div className="confidence-box">

                <span>
                  Confidence
                </span>

                <strong>
                  {result.confidence}%
                </strong>

              </div>

            </div>


            <div className="divider" />


            <div className="probability-section">

              <h3>
                Class Probabilities
              </h3>


              {Object.entries(
                result.probabilities
              ).map(([name, value]) => (

                <div
                  className="probability"
                  key={name}
                >

                  <div className="probability-header">

                    <span>
                      {name}
                    </span>

                    <strong>
                      {value}%
                    </strong>

                  </div>


                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${value}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}


        {/* DISCLAIMER */}

        <section className="disclaimer">

          <div className="disclaimer-icon">
            ⚠️
          </div>

          <div>

            <strong>
              Educational / Research Use Only
            </strong>

            <p>
              This application is designed for
              educational and research purposes.
              It is not a medical diagnosis tool
              and should not replace professional
              medical advice.
            </p>

          </div>

        </section>

      </main>


      <footer>
        Brain Tumor MRI Classifier •
        MobileNetV2 • FastAPI • React
      </footer>

    </div>
  );
}

export default App;