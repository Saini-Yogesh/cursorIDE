import { useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a project idea before generating.");
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setStatus("Initializing your files...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to connect to backend");
      }

      setStatus("Creating your code files...");
      const data = await res.json();

      setLoading(false);

      if (data.downloadUrl) {
        setStatus("Almost done, preparing download...");
        setDownloadUrl(import.meta.env.VITE_API_BASE_URL + data.downloadUrl);
        toast.success("Project generated successfully!");
        setStatus("✅ Done! Your code is ready to download.");
      } else {
        throw new Error("No download URL received from backend");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setStatus("❌ Something went wrong.");
      toast.error("Error generating project. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <h1>AI Code Generator</h1>
      <textarea
        className="prompt-box"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your project idea..."
      />
      <br />
      <button
        className="generate-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {loading && (
        <div className="status-message">
          <p>{status}</p>
        </div>
      )}

      {downloadUrl && (
        <div className="download-section">
          <a href={downloadUrl} download>
            <button className="download-btn">Download Code</button>
          </a>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
