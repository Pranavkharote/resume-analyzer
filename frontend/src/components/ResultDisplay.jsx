// ResultDisplay.jsx
import React from "react";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Star, Briefcase } from "lucide-react";

const handleDownloadReport = (data) => {
  if (!data) return;
  const doc = new jsPDF("p", "pt", "a4");
  const margin = 40;
  let y = 40;

  const addHeading = (text) => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 25;
  };

  const addContent = (text) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, 500);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 15;
  };

  addHeading("AI Resume Analysis By JobLens");
  addHeading("Developed by Pranav Kharote");

  addHeading("ATS Score");
  addContent(`${data.atsScore}% Match`);

  addHeading("Missing Keywords");
  addContent(
    data.missingKeywords.length ? data.missingKeywords.join(", ") : "None"
  );

  addHeading("Feedback");
  addContent(data.feedback.length ? data.feedback.join("\n") : "None");

  addHeading("Strengths");
  addContent(data.strengths.length ? data.strengths.join("\n") : "None");

  doc.save("Resume_Analysis.pdf");
};

const ResultDisplay = ({ data }) => {
  if (!data) return null;
  const { atsScore, missingKeywords, feedback, strengths, jobRoleSuggestions } =
    data;

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 rounded-3xl bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 text-white shadow-2xl border border-white/20">
      <h2 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        AI Resume Analysis
      </h2>

      {/* ATS Score */}
      <div className="mb-12">
        <p className="text-xl font-semibold mb-4">ATS Score</p>
        <div className="w-full bg-white/20 rounded-full h-6 overflow-hidden">
          <div
            className={`h-6 rounded-full transition-all duration-700 ${
              atsScore > 80
                ? "bg-green-400"
                : atsScore > 50
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
            style={{ width: `${atsScore}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 font-medium text-white">{atsScore}% Match</p>
      </div>

      {/* Missing Keywords */}
      <div className="mb-12">
        <p className="text-xl font-semibold mb-6">Missing Keywords</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {missingKeywords?.length ? (
            missingKeywords.map((kw, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 p-4 bg-red-700/30 text-red-100 rounded-2xl shadow-md transition-all font-semibold"
              >
                <XCircle size={20} /> {kw}
              </motion.div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-green-200 font-semibold">
              <CheckCircle size={20} /> No missing keywords!
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div className="mb-12">
        <p className="text-xl font-semibold mb-6">Feedback</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback?.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/20 p-4 rounded-xl shadow-md border border-white/30 text-gray-100 transition-all"
            >
              {f}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="mb-12">
        <p className="text-xl font-semibold mb-6">Strengths</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {strengths?.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-4 bg-green-700/30 text-green-100 rounded-2xl shadow-md transition-all font-semibold"
            >
              <Star size={20} /> {s}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggested Job Roles */}
      <div className="mb-8">
        <p className="text-xl font-semibold mb-6">Suggested Job Roles</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {jobRoleSuggestions?.map((role, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-4 bg-blue-700/30 text-blue-100 rounded-2xl shadow-md transition-all font-semibold"
            >
              <Briefcase size={20} /> {role}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      {data && (
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => handleDownloadReport(data)}
            className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition-all"
          >
            Download Report
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
