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
  const [activePage, setActivePage] = useState("Dashboard");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
    setActivePage("MRI Analysis");
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

  const probabilityData = result
    ? Object.entries(result.probabilities)
    : [
        ["Glioma", 42],
        ["Meningioma", 28],
        ["No Tumor", 18],
        ["Pituitary", 12],
      ];

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">+</div>

          <div>
            <strong>NeuroScan</strong>
            <span>AI MEDICAL IMAGING</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">MAIN MENU</span>

          <button
            className={`side-link ${
              activePage === "Dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("Dashboard")}
          >
            <span className="side-icon">⌂</span>
            Dashboard
          </button>

          <button
            className={`side-link ${
              activePage === "MRI Analysis" ? "active" : ""
            }`}
            onClick={() => setActivePage("MRI Analysis")}
          >
            <span className="side-icon">◉</span>
            MRI Analysis
          </button>

          <button
            className={`side-link ${
              activePage === "Scan History" ? "active" : ""
            }`}
            onClick={() => setActivePage("Scan History")}
          >
            <span className="side-icon">▣</span>
            Scan History
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">ANALYTICS</span>

          <button
            className={`side-link ${
              activePage === "Analytics" ? "active" : ""
            }`}
            onClick={() => setActivePage("Analytics")}
          >
            <span className="side-icon">◒</span>
            Classification Analytics
          </button>

          <button
            className={`side-link ${
              activePage === "Performance" ? "active" : ""
            }`}
            onClick={() => setActivePage("Performance")}
          >
            <span className="side-icon">↗</span>
            Model Performance
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">SYSTEM</span>

          <button
            className={`side-link ${
              activePage === "Model" ? "active" : ""
            }`}
            onClick={() => setActivePage("Model")}
          >
            <span className="side-icon">◇</span>
            Model Information
          </button>

          <button
            className={`side-link ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => setActivePage("Settings")}
          >
            <span className="side-icon">⚙</span>
            Settings
          </button>
        </div>

        <div className="sidebar-bottom">

          <div className="api-box">
            <span className="online-dot"></span>

            <div>
              <strong>API Online</strong>
              <span>FastAPI connected</span>
            </div>
          </div>

          <div className="user-profile">
            <div className="avatar">KZ</div>

            <div>
              <strong>Kainat Zafar</strong>
              <span>AI Developer</span>
            </div>

            <span className="profile-more">•••</span>
          </div>

        </div>
      </aside>


      {/* MAIN AREA */}
      <div className="dashboard">

        {/* TOPBAR */}
        <header className="topbar">

          <div>
            <div className="breadcrumb">
              NeuroScan <span>/</span> Dashboard
            </div>

            <h1>{activePage}</h1>

            <p>
              AI-powered brain MRI classification overview
            </p>
          </div>

          <div className="topbar-actions">

            <button className="icon-button">
              ⌕
            </button>

            <button className="icon-button notification">
              ♧
              <span></span>
            </button>

            <div className="top-user">
              <div className="avatar small-avatar">KZ</div>

              <div>
                <strong>Kainat Zafar</strong>
                <span>AI Developer</span>
              </div>

              <span>⌄</span>
            </div>

          </div>

        </header>


        {/* DASHBOARD CONTENT */}
        <main className="dashboard-content">

          {/* KPI CARDS */}
          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon blue">◉</span>
                <span className="trend positive">+12.5%</span>
              </div>

              <span className="stat-label">
                Total Scans
              </span>

              <strong className="stat-number">
                1,248
              </strong>

              <span className="stat-description">
                Compared with last month
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon purple">✦</span>
                <span className="trend neutral">Model</span>
              </div>

              <span className="stat-label">
                Model Accuracy
              </span>

              <strong className="stat-number">
                84.44%
              </strong>

              <span className="stat-description">
                Test dataset accuracy
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon cyan">◇</span>
                <span className="trend neutral">4 types</span>
              </div>

              <span className="stat-label">
                Classification Classes
              </span>

              <strong className="stat-number">
                4
              </strong>

              <span className="stat-description">
                MRI categories supported
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon green">✓</span>
                <span className="trend positive">Active</span>
              </div>

              <span className="stat-label">
                Average Confidence
              </span>

              <strong className="stat-number">
                91.8%
              </strong>

              <span className="stat-description">
                Across analyzed scans
              </span>
            </div>

          </section>


          {/* ANALYTICS ROW */}
          <section className="analytics-grid">

            {/* PIE CHART */}
            <div className="dashboard-card classification-card">

              <div className="card-header">
                <div>
                  <span className="card-kicker">
                    ANALYTICS
                  </span>

                  <h2>
                    Classification Distribution
                  </h2>

                  <p>
                    Distribution of MRI classifications
                  </p>
                </div>

                <button className="more-button">
                  •••
                </button>
              </div>

              <div className="pie-layout">

                <div className="pie-chart">

                  <div className="pie-center">
                    <strong>1,248</strong>
                    <span>Total Scans</span>
                  </div>

                </div>

                <div className="pie-legend">

                  {probabilityData.map(
                    ([name, value], index) => (
                      <div
                        className="legend-item"
                        key={name}
                      >
                        <div className="legend-left">
                          <span
                            className={`legend-dot dot-${index}`}
                          ></span>

                          <span>{name}</span>
                        </div>

                        <strong>
                          {value}%
                        </strong>
                      </div>
                    )
                  )}

                </div>

              </div>

            </div>


            {/* BAR CHART */}
            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <span className="card-kicker">
                    MODEL OUTPUT
                  </span>

                  <h2>
                    Prediction Confidence
                  </h2>

                  <p>
                    Confidence by classification
                  </p>
                </div>

                <button className="more-button">
                  •••
                </button>

              </div>

              <div className="bar-chart">

                {[
                  ["Glioma", 96.2],
                  ["Meningioma", 88.4],
                  ["No Tumor", 94.7],
                  ["Pituitary", 91.3],
                ].map(([name, value]) => (

                  <div
                    className="bar-item"
                    key={name}
                  >

                    <div className="bar-label">
                      <span>{name}</span>
                      <strong>{value}%</strong>
                    </div>

                    <div className="bar-track">

                      <div
                        className="bar-fill"
                        style={{
                          width: `${value}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>


          {/* SECOND ANALYTICS ROW */}
          <section className="analytics-grid second-row">

            {/* LINE CHART */}
            <div className="dashboard-card activity-card">

              <div className="card-header">

                <div>
                  <span className="card-kicker">
                    ACTIVITY
                  </span>

                  <h2>
                    Scan Activity
                  </h2>

                  <p>
                    MRI scans processed over recent months
                  </p>
                </div>

                <div className="activity-growth">
                  +18.4%
                  <span>vs previous period</span>
                </div>

              </div>

              <div className="line-chart">

                <div className="chart-grid-line line-1"></div>
                <div className="chart-grid-line line-2"></div>
                <div className="chart-grid-line line-3"></div>
                <div className="chart-grid-line line-4"></div>

                <div className="chart-line">
                  <span className="point p1"></span>
                  <span className="point p2"></span>
                  <span className="point p3"></span>
                  <span className="point p4"></span>
                  <span className="point p5"></span>
                  <span className="point p6"></span>
                </div>

              </div>

              <div className="chart-months">
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
              </div>

            </div>


            {/* MODEL PERFORMANCE */}
            <div className="dashboard-card performance-card">

              <div className="card-header">

                <div>
                  <span className="card-kicker">
                    MODEL
                  </span>

                  <h2>
                    Model Performance
                  </h2>

                  <p>
                    Evaluation metrics
                  </p>
                </div>

              </div>

              <div className="performance-list">

                <div className="performance-item">
                  <div>
                    <span>Accuracy</span>
                    <strong>84.44%</strong>
                  </div>

                  <div className="performance-track">
                    <span style={{ width: "84.44%" }}></span>
                  </div>
                </div>

                <div className="performance-item">
                  <div>
                    <span>Precision</span>
                    <strong>83.90%</strong>
                  </div>

                  <div className="performance-track">
                    <span style={{ width: "83.9%" }}></span>
                  </div>
                </div>

                <div className="performance-item">
                  <div>
                    <span>Recall</span>
                    <strong>82.70%</strong>
                  </div>

                  <div className="performance-track">
                    <span style={{ width: "82.7%" }}></span>
                  </div>
                </div>

                <div className="performance-item">
                  <div>
                    <span>F1 Score</span>
                    <strong>83.20%</strong>
                  </div>

                  <div className="performance-track">
                    <span style={{ width: "83.2%" }}></span>
                  </div>
                </div>

              </div>

            </div>

          </section>


          {/* MRI ANALYSIS */}
          <section className="dashboard-card analysis-dashboard">

            <div className="card-header">

              <div>
                <span className="card-kicker">
                  MRI ANALYSIS
                </span>

                <h2>
                  Analyze a Brain MRI
                </h2>

                <p>
                  Upload an MRI scan and run the trained
                  MobileNetV2 classifier.
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

            <div className="analysis-workspace">

              <label className="upload-box">

                {preview ? (

                  <div className="preview-area">

                    <img
                      src={preview}
                      alt="Uploaded MRI"
                    />

                    <div className="preview-status">
                      ✓ MRI Loaded
                    </div>

                    <div className="change-image">
                      Click to replace
                    </div>

                  </div>

                ) : (

                  <div className="upload-empty">

                    <div className="upload-symbol">
                      ↑
                    </div>

                    <h3>
                      Upload MRI Scan
                    </h3>

                    <p>
                      Drag & drop your image here or
                      <strong> browse files</strong>
                    </p>

                    <div className="format-list">
                      <span>JPG</span>
                      <span>JPEG</span>
                      <span>PNG</span>
                    </div>

                    <small>
                      Maximum recommended image quality
                    </small>

                  </div>

                )}

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />

              </label>


              <div className="analysis-result">

                {!result ? (

                  <div className="empty-result">

                    <div className="result-icon">
                      ✦
                    </div>

                    <h3>
                      Analysis Result
                    </h3>

                    <p>
                      Upload an MRI image to view the
                      AI classification and probability
                      distribution.
                    </p>

                    <button
                      className="analyze-button"
                      onClick={analyzeMRI}
                      disabled={!file || loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          ✦ Analyze MRI Scan
                          <span>→</span>
                        </>
                      )}
                    </button>

                  </div>

                ) : (

                  <div className="result-content">

                    <div className="result-title">
                      <div>
                        <span className="card-kicker">
                          ANALYSIS COMPLETE
                        </span>

                        <h3>
                          Predicted Class
                        </h3>
                      </div>

                      <span className="completed">
                        ✓ Complete
                      </span>
                    </div>

                    <div className="result-main">

                      <div className="result-prediction">

                        <span>
                          AI CLASSIFICATION
                        </span>

                        <strong>
                          {result.prediction}
                        </strong>

                        <small>
                          {getConfidenceLevel(
                            result.confidence
                          )}
                        </small>

                      </div>

                      <div
                        className="confidence-circle"
                        style={{
                          background: `conic-gradient(#1688d4 ${
                            result.confidence * 3.6
                          }deg, #e8eef5 0deg)`,
                        }}
                      >
                        <div>
                          <strong>
                            {result.confidence}%
                          </strong>

                          <span>
                            Confidence
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="result-bars">

                      {Object.entries(
                        result.probabilities
                      ).map(([name, value]) => (

                        <div
                          className="result-bar-item"
                          key={name}
                        >

                          <div>
                            <span>{name}</span>
                            <strong>
                              {value}%
                            </strong>
                          </div>

                          <div className="result-track">
                            <span
                              className={
                                name === result.prediction
                                  ? "highlight"
                                  : ""
                              }
                              style={{
                                width: `${value}%`,
                              }}
                            ></span>
                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

              </div>

            </div>

            {error && (
              <div className="error-box">
                <span>!</span>
                {error}
              </div>
            )}

            {file && !result && (
              <div className="selected-file">
                <div className="file-image">IMG</div>

                <div>
                  <span>Selected scan</span>
                  <strong>{file.name}</strong>
                </div>

                <span className="ready-badge">
                  ✓ Ready
                </span>
              </div>
            )}

          </section>


          {/* RECENT SCANS */}
          <section className="dashboard-card recent-card">

            <div className="card-header">

              <div>
                <span className="card-kicker">
                  HISTORY
                </span>

                <h2>
                  Recent MRI Scans
                </h2>

                <p>
                  Latest classification activity
                </p>
              </div>

              <button className="view-all">
                View all →
              </button>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>SCAN ID</th>
                    <th>DATE</th>
                    <th>PREDICTION</th>
                    <th>CONFIDENCE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>
                      <strong>MRI-1024</strong>
                    </td>
                    <td>Sep 25, 2026</td>
                    <td>
                      <span className="prediction-tag">
                        Glioma
                      </span>
                    </td>
                    <td>96.20%</td>
                    <td>
                      <span className="status-complete">
                        ● Completed
                      </span>
                    </td>
                    <td>
                      <button className="table-action">
                        View
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>MRI-1023</strong>
                    </td>
                    <td>Sep 25, 2026</td>
                    <td>
                      <span className="prediction-tag">
                        No Tumor
                      </span>
                    </td>
                    <td>94.70%</td>
                    <td>
                      <span className="status-complete">
                        ● Completed
                      </span>
                    </td>
                    <td>
                      <button className="table-action">
                        View
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>MRI-1022</strong>
                    </td>
                    <td>Sep 24, 2026</td>
                    <td>
                      <span className="prediction-tag">
                        Meningioma
                      </span>
                    </td>
                    <td>88.40%</td>
                    <td>
                      <span className="status-complete">
                        ● Completed
                      </span>
                    </td>
                    <td>
                      <button className="table-action">
                        View
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>MRI-1021</strong>
                    </td>
                    <td>Sep 24, 2026</td>
                    <td>
                      <span className="prediction-tag">
                        Pituitary
                      </span>
                    </td>
                    <td>91.30%</td>
                    <td>
                      <span className="status-complete">
                        ● Completed
                      </span>
                    </td>
                    <td>
                      <button className="table-action">
                        View
                      </button>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </section>


          {/* DISCLAIMER */}
          <div className="medical-disclaimer">

            <div className="disclaimer-symbol">
              !
            </div>

            <div>
              <strong>
                Educational & Research Use Only
              </strong>

              <p>
                NeuroScan AI is intended for educational and
                research purposes. AI predictions are not
                medical diagnoses and should not replace
                professional medical evaluation, advice,
                or treatment.
              </p>
            </div>

          </div>

        </main>

        <footer className="dashboard-footer">
          <span>
            NeuroScan AI · MobileNetV2 · TensorFlow · FastAPI · React
          </span>

          <span>
            © 2026 NeuroScan AI
          </span>
        </footer>

      </div>

    </div>
  );
}

export default App;