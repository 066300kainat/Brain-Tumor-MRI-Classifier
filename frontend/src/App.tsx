import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const CLASS_NAMES = [
  "Glioma",
  "Meningioma",
  "No Tumor",
  "Pituitary",
];

type Page = "dashboard" | "analysis" | "history" | "settings";

interface PredictionResult {
  success: boolean;
  filename: string;
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

interface HistoryItem extends PredictionResult {
  id: string;
  date: string;
}

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [showConfidence, setShowConfidence] = useState(true);

  useEffect(() => {
    const savedHistory = localStorage.getItem("brain-tumor-history");
    const savedSettings = localStorage.getItem("brain-tumor-settings");

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        setHistory([]);
      }
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setShowConfidence(settings.showConfidence ?? true);
      } catch {
        setShowConfidence(true);
      }
    }

    checkApi();
  }, []);

  useEffect(() => {
    localStorage.setItem("brain-tumor-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(
      "brain-tumor-settings",
      JSON.stringify({ showConfidence })
    );
  }, [showConfidence]);

  const checkApi = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setApiOnline(data.success === true);
    } catch {
      setApiOnline(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError("");
    setResult(null);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError("Please upload an MRI image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed.");
      }

      setResult(data);

      const historyItem: HistoryItem = {
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
      };

      setHistory((previous) => [historyItem, ...previous]);

      setPage("analysis");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the prediction API."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  };

  const totalAnalyses = history.length;

  const averageConfidence = useMemo(() => {
    if (!history.length) return null;

    const total = history.reduce(
      (sum, item) => sum + item.confidence,
      0
    );

    return total / history.length;
  }, [history]);

  const distribution = useMemo(() => {
    return CLASS_NAMES.map((name) => ({
      name,
      count: history.filter((item) => item.prediction === name).length,
    }));
  }, [history]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setError("");
  };

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">N</div>

          <div>
            <div className="brand-name">NeuroScan</div>
            <div className="brand-subtitle">AI MRI ANALYTICS</div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-title">MAIN MENU</div>

          <button
            className={`nav-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("dashboard")}
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${
              page === "analysis" ? "active" : ""
            }`}
            onClick={() => navigate("analysis")}
          >
            <span className="nav-icon">◉</span>
            <span>MRI Analysis</span>
          </button>

          <button
            className={`nav-item ${
              page === "history" ? "active" : ""
            }`}
            onClick={() => navigate("history")}
          >
            <span className="nav-icon">↺</span>
            <span>History</span>
          </button>
        </div>

        <div className="menu-section system-section">
          <div className="menu-title">SYSTEM</div>

          <button
            className={`nav-item ${
              page === "settings" ? "active" : ""
            }`}
            onClick={() => navigate("settings")}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="model-mini-card">
            <div className="model-mini-icon">AI</div>

            <div>
              <strong>MobileNetV2</strong>
              <span>4-class classifier</span>
            </div>
          </div>

          <div className="api-status">
            <span
              className={`status-dot ${
                apiOnline ? "online" : "offline"
              }`}
            />

            <span>
              {apiOnline ? "API Connected" : "API Offline"}
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>NeuroScan</span>
            <b>/</b>
            <strong>
              {page === "dashboard"
                ? "Dashboard"
                : page === "analysis"
                ? "MRI Analysis"
                : page === "history"
                ? "History"
                : "Settings"}
            </strong>
          </div>

          <div className="topbar-right">
            <div className="system-pill">
              <span className="status-dot online" />
              System Online
            </div>

            <div className="user-avatar">KZ</div>
          </div>
        </header>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <section className="page-content">

            <div className="page-heading">
              <div>
                <div className="eyebrow">AI MEDICAL IMAGING</div>

                <h1>Analytics Dashboard</h1>

                <p>
                  Monitor your MRI classification model and
                  analysis activity.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => navigate("analysis")}
              >
                <span>＋</span>
                Analyze MRI
              </button>
            </div>

            {/* STAT CARDS */}
            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-icon blue">◈</span>
                  <span className="stat-label">MODEL ACCURACY</span>
                </div>

                <div className="stat-value">84.44%</div>
                <div className="stat-description">
                  Test dataset performance
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-icon purple">⌁</span>
                  <span className="stat-label">TOTAL ANALYSES</span>
                </div>

                <div className="stat-value">
                  {totalAnalyses}
                </div>

                <div className="stat-description">
                  Saved in this browser
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-icon green">✓</span>
                  <span className="stat-label">AVG. CONFIDENCE</span>
                </div>

                <div className="stat-value">
                  {averageConfidence !== null
                    ? `${averageConfidence.toFixed(1)}%`
                    : "—"}
                </div>

                <div className="stat-description">
                  From completed analyses
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span className="stat-icon orange">◆</span>
                  <span className="stat-label">MODEL CLASSES</span>
                </div>

                <div className="stat-value">4</div>

                <div className="stat-description">
                  Brain MRI categories
                </div>
              </div>

            </div>

            <div className="dashboard-grid">

              {/* MODEL OVERVIEW */}
              <div className="card model-overview">

                <div className="card-header">
                  <div>
                    <h2>Model Overview</h2>
                    <p>Current classifier configuration</p>
                  </div>

                  <span className="active-badge">
                    <span className="status-dot online" />
                    Active
                  </span>
                </div>

                <div className="model-overview-body">

                  <div className="model-symbol">
                    AI
                  </div>

                  <div className="model-info">
                    <h3>MobileNetV2</h3>

                    <p>
                      Transfer-learning image classification
                      model trained for four MRI image categories.
                    </p>

                    <div className="model-details">

                      <div>
                        <span>Input</span>
                        <strong>224 × 224</strong>
                      </div>

                      <div>
                        <span>Classes</span>
                        <strong>4</strong>
                      </div>

                      <div>
                        <span>Framework</span>
                        <strong>TensorFlow</strong>
                      </div>

                      <div>
                        <span>Accuracy</span>
                        <strong>84.44%</strong>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* QUICK ANALYSIS */}
              <div className="card quick-card">

                <div className="card-header">
                  <div>
                    <h2>Quick Analysis</h2>
                    <p>Start a new MRI classification</p>
                  </div>

                  <span className="card-icon">◉</span>
                </div>

                <div className="quick-content">

                  <div className="upload-mini-icon">
                    ↑
                  </div>

                  <h3>Upload an MRI scan</h3>

                  <p>
                    Use the AI classifier to analyze a JPG,
                    JPEG, PNG, or WEBP image.
                  </p>

                  <button
                    className="secondary-button full"
                    onClick={() => navigate("analysis")}
                  >
                    Open MRI Analysis
                    <span>→</span>
                  </button>

                </div>
              </div>

            </div>

            {/* STATISTICS */}
            <div className="card statistics-card">

              <div className="card-header">
                <div>
                  <h2>Analysis Statistics</h2>
                  <p>
                    Distribution of your completed classifications
                  </p>
                </div>

                <span className="card-icon">◔</span>
              </div>

              {history.length === 0 ? (
                <div className="empty-statistics">

                  <div className="empty-icon">◌</div>

                  <h3>No analysis statistics yet</h3>

                  <p>
                    Run your first MRI analysis to populate the
                    dashboard with real classification statistics.
                  </p>

                  <button
                    className="secondary-button"
                    onClick={() => navigate("analysis")}
                  >
                    Start Analysis
                  </button>

                </div>
              ) : (
                <div className="charts-area">

                  <div className="donut-wrapper">
                    <div
                      className="donut"
                      style={{
                        background: createDonutGradient(
                          distribution
                        ),
                      }}
                    >
                      <div className="donut-center">
                        <strong>{history.length}</strong>
                        <span>Analyses</span>
                      </div>
                    </div>
                  </div>

                  <div className="distribution-list">

                    {distribution.map((item, index) => (
                      <div
                        className="distribution-item"
                        key={item.name}
                      >
                        <div className="distribution-name">
                          <span
                            className={`legend-dot legend-${index}`}
                          />
                          <span>{item.name}</span>
                        </div>

                        <strong>{item.count}</strong>
                      </div>
                    ))}

                  </div>

                </div>
              )}

            </div>

          </section>
        )}

        {/* ANALYSIS */}
        {page === "analysis" && (
          <section className="page-content">

            <div className="page-heading">
              <div>
                <div className="eyebrow">AI MEDICAL IMAGING</div>

                <h1>MRI Analysis</h1>

                <p>
                  Upload a brain MRI image and run the
                  MobileNetV2 classifier.
                </p>
              </div>
            </div>

            <div className="analysis-layout">

              {/* UPLOAD */}
              <div className="card upload-card">

                <div className="card-header">
                  <div>
                    <h2>Upload MRI Scan</h2>
                    <p>
                      Supported formats: JPG, JPEG, PNG, WEBP
                    </p>
                  </div>
                </div>

                <div
                  className={`drop-zone ${
                    dragActive ? "drag-active" : ""
                  } ${selectedFile ? "has-file" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >

                  {selectedFile ? (
                    <div className="preview-area">

                      <img
                        src={previewUrl}
                        alt="MRI preview"
                        className="mri-preview"
                      />

                      <div className="file-name">
                        {selectedFile.name}
                      </div>

                      <div className="file-size">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>

                      <label className="change-file">
                        Change image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          hidden
                        />
                      </label>

                    </div>
                  ) : (
                    <>
                      <div className="upload-icon-large">
                        ↑
                      </div>

                      <h3>Drop your MRI scan here</h3>

                      <p>or select an image from your computer</p>

                      <label className="secondary-button">
                        Choose MRI Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          hidden
                        />
                      </label>
                    </>
                  )}

                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <button
                  className="primary-button analyze-button"
                  disabled={!selectedFile || loading}
                  onClick={analyzeImage}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Analyzing MRI...
                    </>
                  ) : (
                    <>
                      ◉
                      Analyze MRI
                    </>
                  )}
                </button>

              </div>

              {/* RESULT */}
              <div className="card result-card">

                <div className="card-header">
                  <div>
                    <h2>Analysis Result</h2>
                    <p>Classification output</p>
                  </div>

                  {result && (
                    <span className="result-badge">
                      Complete
                    </span>
                  )}
                </div>

                {!result ? (
                  <div className="result-empty">

                    <div className="result-empty-icon">
                      ◎
                    </div>

                    <h3>Waiting for analysis</h3>

                    <p>
                      Upload an MRI image and click Analyze
                      MRI to see the classification result.
                    </p>

                  </div>
                ) : (
                  <div className="result-content">

                    <div className="prediction-main">

                      <div className="prediction-icon">
                        ✓
                      </div>

                      <div>
                        <span className="prediction-label">
                          PREDICTED CLASS
                        </span>

                        <h3>{result.prediction}</h3>

                        {showConfidence && (
                          <p>
                            Confidence:{" "}
                            <strong>
                              {result.confidence.toFixed(2)}%
                            </strong>
                          </p>
                        )}
                      </div>

                    </div>

                    <div className="probability-section">

                      <div className="probability-heading">
                        <span>Class probabilities</span>
                        <span>Confidence</span>
                      </div>

                      {CLASS_NAMES.map((className) => {
                        const value =
                          result.probabilities[className] || 0;

                        return (
                          <div
                            className="probability-row"
                            key={className}
                          >
                            <div className="probability-label">
                              {className}
                            </div>

                            <div className="probability-track">
                              <div
                                className={`probability-fill ${
                                  className === result.prediction
                                    ? "selected"
                                    : ""
                                }`}
                                style={{
                                  width: `${Math.max(
                                    value,
                                    0
                                  )}%`,
                                }}
                              />
                            </div>

                            <div className="probability-value">
                              {value.toFixed(2)}%
                            </div>
                          </div>
                        );
                      })}

                    </div>

                    <div className="result-file">
                      <span>File</span>
                      <strong>{result.filename}</strong>
                    </div>

                    <div className="medical-note">
                      <strong>Important:</strong> This tool is for
                      educational and research purposes only. It
                      does not provide a medical diagnosis.
                    </div>

                    <button
                      className="secondary-button full"
                      onClick={clearAnalysis}
                    >
                      Analyze Another MRI
                    </button>

                  </div>
                )}

              </div>

            </div>

          </section>
        )}

        {/* HISTORY */}
        {page === "history" && (
          <section className="page-content">

            <div className="page-heading">
              <div>
                <div className="eyebrow">ANALYSIS RECORDS</div>

                <h1>Analysis History</h1>

                <p>
                  Previous MRI classifications saved in this
                  browser.
                </p>
              </div>
            </div>

            <div className="card history-card">

              {history.length === 0 ? (
                <div className="empty-history">

                  <div className="empty-icon">↺</div>

                  <h3>No analysis history</h3>

                  <p>
                    Your completed MRI analyses will appear here.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => navigate("analysis")}
                  >
                    Start MRI Analysis
                  </button>

                </div>
              ) : (
                <div className="history-table-wrapper">

                  <table className="history-table">

                    <thead>
                      <tr>
                        <th>File</th>
                        <th>Prediction</th>
                        <th>Confidence</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="history-file">
                              <span>◉</span>
                              {item.filename}
                            </div>
                          </td>

                          <td>
                            <span className="prediction-tag">
                              {item.prediction}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {item.confidence.toFixed(2)}%
                            </strong>
                          </td>

                          <td>{item.date}</td>
                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </section>
        )}

        {/* SETTINGS */}
        {page === "settings" && (
          <section className="page-content">

            <div className="page-heading">
              <div>
                <div className="eyebrow">SYSTEM CONFIGURATION</div>

                <h1>Settings</h1>

                <p>
                  Manage your NeuroScan dashboard preferences.
                </p>
              </div>
            </div>

            <div className="settings-grid">

              <div className="card settings-card">

                <div className="card-header">
                  <div>
                    <h2>Display Settings</h2>
                    <p>Customize analysis result visibility</p>
                  </div>
                </div>

                <div className="setting-row">

                  <div>
                    <strong>Show confidence scores</strong>

                    <p>
                      Display model confidence percentages
                      alongside predictions.
                    </p>
                  </div>

                  <button
                    className={`toggle ${
                      showConfidence ? "enabled" : ""
                    }`}
                    onClick={() =>
                      setShowConfidence((value) => !value)
                    }
                  >
                    <span />
                  </button>

                </div>

              </div>

              <div className="card settings-card">

                <div className="card-header">
                  <div>
                    <h2>Model Configuration</h2>
                    <p>Current AI classifier details</p>
                  </div>
                </div>

                <div className="settings-details">

                  <div>
                    <span>Model</span>
                    <strong>MobileNetV2</strong>
                  </div>

                  <div>
                    <span>Framework</span>
                    <strong>TensorFlow</strong>
                  </div>

                  <div>
                    <span>Input Size</span>
                    <strong>224 × 224</strong>
                  </div>

                  <div>
                    <span>Classes</span>
                    <strong>4</strong>
                  </div>

                  <div>
                    <span>Test Accuracy</span>
                    <strong>84.44%</strong>
                  </div>

                  <div>
                    <span>API Status</span>
                    <strong className="api-text">
                      {apiOnline ? "Connected" : "Offline"}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </section>
        )}

        <footer className="footer">
          NeuroScan AI • Brain MRI Classification Dashboard
        </footer>

      </main>
    </div>
  );
}

function createDonutGradient(
  distribution: { name: string; count: number }[]
) {
  const total = distribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  if (!total) {
    return "conic-gradient(#e8edf5 0deg 360deg)";
  }

  let current = 0;

  const colors = [
    "#315efb",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
  ];

  const parts = distribution.map((item, index) => {
    const start = current;
    const end = current + (item.count / total) * 360;

    current = end;

    return `${colors[index]} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${parts.join(", ")})`;
}

export default App;