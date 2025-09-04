import { useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const stepMessages = [
    "📂 Creating project folder...",
    "📝 Generating base structure...",
    "📦 Adding configuration files...",
    "🎨 Writing stylesheets...",
    "⚡ Building JavaScript logic...",
    "🚀 Finalizing project files...",
    "🗜️ Zipping project for download...",
  ];

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

      if (!res.ok) throw new Error("Failed to generate project");

      setStatus("Creating your code files...");

      // Convert stream to blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a download link
      const link = document.createElement("a");
      link.href = url;
      link.download = "project.zip";
      link.click();

      setStatus("✅ Done! Your code is ready.");
      toast.success("Project generated successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong.");
      toast.error("Error generating project. Please try again.");
    } finally {
      setLoading(false);
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
