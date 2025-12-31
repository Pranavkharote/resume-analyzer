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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-20">
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-5xl font-extrabold text-indigo-900 tracking-tight"
        >
          AI Resume Analyzer
        </motion.h1>

        <p className="text-indigo-700/80 mt-4 text-lg max-w-3xl mx-auto">
          Get an instant ATS score, identify missing keywords, and receive
          actionable feedback tailored to the job you’re applying for.
        </p>

        <p className="mt-2 text-sm text-indigo-600/70">
          Designed for modern ATS systems • No generic advice
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center h-60 rounded-2xl border-2 border-dashed 
        ${
          file
            ? "border-green-400 bg-green-50/60"
            : "border-indigo-300 bg-white/70"
        }
        backdrop-blur-xl hover:bg-white/80 transition cursor-pointer`}
        >
          <svg
            className="w-14 h-14 text-indigo-400 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>

          <p className="text-indigo-800 font-medium text-lg">
            {file ? file.name : "Upload your resume (PDF)"}
          </p>
          <p className="text-indigo-500 text-sm mt-1">
            PDF only • Max 5MB • Your data is not stored
          </p>

          <input
            type="file"
            id="dropzone-file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <input
            placeholder="Target Job Role (e.g., Full Stack Developer Intern)"
            value={jobPosition}
            onChange={(e) => setJobPosition(e.target.value)}
            className=" w-full py-3 px-4 rounded-xl  bg-white/60 backdrop-blur-xl border border-indigo-200 text-indigo-900 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <textarea
            rows={4}
            placeholder="Paste job description for higher accuracy (recommended)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-white/60 backdrop-blur-xl border border-indigo-200 text-indigo-900 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          />
        </div>

        <motion.button
          onClick={handleUpload}
          disabled={!file || loading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`mt-10 w-full py-4 rounded-xl font-semibold text-lg shadow-md transition
        ${
          loading || !file
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90"
        }`}
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </motion.button>

        {/* Loader */}
        {loading && (
          <div className="mt-10 flex flex-col items-center">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-300 border-t-indigo-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-700 font-semibold text-lg">
                {progress}%
              </div>
            </div>
            <p className="mt-3 text-indigo-600/70 text-sm">
              Evaluating ATS match • Extracting keywords • Generating insights
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-16">
            <ResultDisplay data={result} />
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ResumeUpload;
