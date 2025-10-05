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
      const res = await axios.post("http://localhost:5000/upload", formData, {
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
      <h1 className="text-3xl font-bold mb-8 text-center">AI Resume Analyzer</h1>

      {/* File input */}
      <label className="w-full max-w-md mb-4">
        <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center">
          {file ? (
            <span className="text-gray-800 font-medium">{file.name}</span>
          ) : (
            <span className="text-gray-400">Click to select a PDF file</span>
          )}
        </div>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      {/* Upload button */}
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
