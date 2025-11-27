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
        console.log(result);
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
   <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-16">

  {/* Title */}
  <motion.h1
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="text-4xl md:text-5xl font-bold text-indigo-900 tracking-tight"
  >
    AI Resume Analyzer
  </motion.h1>

  <p className="text-indigo-700/70 text-center mt-3 max-w-2xl">
    Upload your resume for an AI-powered ATS and job-match analysis.
  </p>

  {/* Main Card */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mt-10 w-full max-w-5xl bg-white rounded-2xl p-10 shadow-xl border border-indigo-100"
  >
    <div className="grid md:grid-cols-2 gap-10">

      {/* Upload Section */}
      <div>
        <label className="mb-2 block text-sm font-medium text-indigo-800/80">
          Upload Resume (PDF)
        </label>

        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-52 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 hover:bg-indigo-50 transition cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 mb-2 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 4v16m8-8H4" />
            </svg>

            <p className="text-indigo-600 font-medium">
              {file ? file.name : "Click or drag your resume here"}
            </p>
            <p className="text-indigo-400 text-xs">PDF only</p>
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

      {/* Job Details */}
      <div className="flex flex-col gap-4">
        <input
          placeholder="Job Position (Optional)"
          value={jobPosition}
          onChange={(e) => setJobPosition(e.target.value)}
          className="w-full p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <textarea
          rows={6}
          placeholder="Job Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>

    </div>

    {/* Analyze Button */}
    <motion.button
      onClick={handleUpload}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-10 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:opacity-90 transition"
    >
      {loading ? "Analyzing..." : "Upload & Analyze"}
    </motion.button>

    {/* Progress */}
    {loading && (
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textColor: "#4f46e5",
              pathColor: "#6366f1",
              trailColor: "#e0e7ff",
            })}
          />
        </div>

        <p className="text-indigo-600/70 text-sm">Analyzing your resume...</p>
      </div>
    )}

    {result && (
      <div className="mt-10">
        <ResultDisplay data={result} />
      </div>
    )}
  </motion.div>

  <ToastContainer />
</div>

  );
};

export default ResumeUpload;
