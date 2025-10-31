// ResumeUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import ResultDisplay from "./ResultDisplay";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [jobPosition, setJobPosition] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      toast.info("Resume upload is required to start analysis.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobPosition", jobPosition);
    formData.append("description", description);

    try {
      setLoading(true);
      setProgress(10);

      const res = await axios.post(
        "https://resume-analyzer-mmz4.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        }
      );

      setProgress(90);

      if (!res.data || res.data.error) {
        toast.error("Unexpected server response");
        return;
      }

      setTimeout(() => {
        setResult(res.data);
        setProgress(100);
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error(
        "Upload failed: " + (error.response?.data?.error || error.message)
      );
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-400 via-blue-400 to-red-200 text-white px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-cyan-800"
      >
        AI Resume Analyzer
      </motion.h1>

      <p className="text-gray-200 text-center mb-8 max-w-2xl">
        Upload your resume for a comprehensive AI-driven analysis. Job title and
        description are optional but can enhance result precision.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row gap-6 items-start"
      >
        {/* Resume Upload */}
        <div className="flex-1 flex flex-col items-center w-full">
          <label className="mb-2 text-sm font-medium text-gray-300">
            Upload Your Resume <span className="text-red-500">*</span>
          </label>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-500 rounded-xl cursor-pointer bg-gray-900/50 hover:bg-gray-800 transition-colors"
          >
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v4h16v-4M12 12V3m0 0L8 7m4-4 4 4"
                />
              </svg>
              <p className="text-gray-300 font-medium text-center">
                {!file ? "Click or drag to upload (PDF only)" : file.name}
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {/* Job Position & Description */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <input
            placeholder="Job Position (Optional)"
            value={jobPosition}
            onChange={(e) => setJobPosition(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <textarea
            rows={6}
            placeholder="Job Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
          />
        </div>
      </motion.div>

      <motion.button
        onClick={handleUpload}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 w-full max-w-md py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition-all"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </motion.button>

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

      {result && <ResultDisplay data={result} />}

      <ToastContainer />
    </div>
  );
};

export default ResumeUpload;
