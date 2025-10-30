import React, { useState } from "react";
import axios from "axios";
import ResultDisplay from "./ResultDisplay";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setProgress(10);

      const res = await axios.post(
        "https://resume-analyzer-mmz4.onrender.com/upload",
        // "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      setProgress(90);
      console.log("✅ Backend response:", res.data);

      if (!res.data || res.data.error) {
        alert("Unexpected server response");
        return;
      }

      setTimeout(() => {
        setResult(res.data);
        setProgress(100);
      }, 500);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed: " + (error.response?.data?.error || error.message));
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white px-4 py-12">
      {/* Title Section */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
      >
        AI Resume Analyzer
      </motion.h1>

      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-6 border border-gray-600 p-3 rounded-lg bg-gray-900/70 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="relative w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {/* Progress Loader */}
        {loading && (
          <div className="mt-6 flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24">
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: "#3b82f6",
                  trailColor: "#1f2937",
                })}
              />
            </div>
            <p className="text-sm text-gray-400 animate-pulse">
              Analyzing your resume with AI...
            </p>
          </div>
        )}
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-10 w-full max-w-4xl"
        >
          <ResultDisplay data={result} />
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUpload;
