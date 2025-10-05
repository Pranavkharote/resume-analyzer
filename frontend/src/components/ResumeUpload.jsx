import React, { useState } from "react";
import axios from "axios";
import ResultDisplay from "./ResultDisplay";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const res = await axios.post("https://resume-analyzer-mmz4.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Backend response:", res.data);

      if (!res.data || res.data.error) {
        alert("Unexpected server response");
        return;
      }

      setResult(res.data);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center">
        AI Resume Analyzer
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 w-full max-w-md border border-gray-300 p-3 rounded-lg bg-gray-50"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 w-full max-w-md"
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        {loading ? "Uploading..." : "Upload & Analyze"}
      </button>

      {/* Display Result */}
      {result && <ResultDisplay data={result} />}
    </div>
  );
};

export default ResumeUpload;
