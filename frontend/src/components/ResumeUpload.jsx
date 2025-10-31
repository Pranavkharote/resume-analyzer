import React, { useState } from "react";
import axios from "axios";
import ResultDisplay from "./ResultDisplay";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [jobPosition, setJobPosition] = useState(null);
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
    formData.append("description", description);
    formData.append("jobPosition", jobPosition);

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
    className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
  >
    AI Resume Analyzer
  </motion.h1>

  {/* Upload Card */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row items-center gap-8"
  >
  
    {/* Resume Upload */}
    <div className="flex-1 flex flex-col items-center justify-center w-full">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v4h16v-4M12 12V3m0 0L8 7m4-4 4 4" />
          </svg>
          <p className="text-gray-300 font-medium text-center">
            Click or drag to upload <br /> <span className="text-sm">(PDF only)</span>
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

     <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input type="text" value={jobPosition} onChange={(e) => setJobPosition(e.target.value.jobPosition)} id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
        </div>
    {/* Job Description */}
    <div className="flex-1 w-full flex flex-col">
      <label htmlFor="jobDescription" className="mb-2 text-sm font-medium text-gray-300">
        Job Description
      </label>
      <textarea
        id="jobDescription"
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full p-4 rounded-xl bg-gray-900/50 text-gray-200 placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
      />
    </div>
  </motion.div>

  {/* Submit Button */}
  <motion.button
    onClick={handleUpload}
    disabled={loading || !file || !description}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="mt-8 w-full max-w-md py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition-all disabled:opacity-50"
  >
    {loading ? "Analyzing..." : "Upload & Analyze"}
  </motion.button>

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
      <p className="text-sm text-gray-400 animate-pulse">Analyzing your resume with AI...</p>
    </div>
  )}

  {/* Result */}
  {result && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-10 w-full max-w-5xl"
    >
      <ResultDisplay data={result} />
    </motion.div>
  )}
</div>

  );
};

export default ResumeUpload;
