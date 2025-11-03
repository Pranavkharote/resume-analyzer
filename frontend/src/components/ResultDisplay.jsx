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
  addHeading("matchingSummary");
  addContent(data.matchingSummary.length ? data.matchingSummary.join("\n") : "None");
  addHeading("yourAdvice");
  addContent(data.yourAdvice.length ? data.yourAdvice.join("\n") : "None");

  doc.save("Resume_Analysis_by_Pranav.pdf");
};

const ResultDisplay = ({ data }) => {
  if (!data) return null;
  const { atsScore, missingKeywords, feedback, strengths, matchingSummary, yourAdvice } =
    data;

  return (
 <div className="max-w-6xl mx-auto mt-12 p-8 rounded-3xl bg-white text-gray-800 shadow-xl border border-gray-200">
  <h2 className="text-4xl font-extrabold mb-10 text-center tracking-wide text-gray-900">
    AI Resume Analysis
  </h2>

  {/* ATS Score */}
  <div className="mb-12">
    <p className="text-xl font-semibold mb-4">ATS Score</p>
    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
      <div
        className={`h-6 rounded-full transition-all duration-700 ${
          atsScore > 80 ? "bg-green-600" : atsScore > 50 ? "bg-yellow-500" : "bg-red-500"
        }`}
        style={{ width: `${atsScore}%` }}
      ></div>
    </div>
    <p className="text-center mt-2 font-medium">{atsScore}% Match</p>
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
            className="flex items-center gap-2 p-4 bg-red-100 text-red-800 rounded-2xl shadow-sm font-semibold transition-all"
          >
            <XCircle size={20} /> {kw}
          </motion.div>
        ))
      ) : (
        <div className="flex items-center gap-2 text-green-800 font-semibold">
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
          className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 text-gray-800 transition-all"
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
          className="flex items-center gap-2 p-4 bg-green-100 text-green-800 rounded-2xl shadow-sm font-semibold transition-all"
        >
          <Star size={20} /> {s}
        </motion.div>
      ))}
    </div>
  </div>

  {/* Matching Summary */}
  <div className="mb-12">
    <p className="text-xl font-semibold mb-4">Matching Summary</p>
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 text-gray-800">
      {matchingSummary?.length ? matchingSummary.join(" ") : "No summary available."}
    </div>
  </div>

  {/* Your Advice */}
  <div className="mb-12">
    <p className="text-xl font-semibold mb-4">Your Advice</p>
    <ul className="list-disc list-inside bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 text-gray-800">
      {yourAdvice?.length ? (
        yourAdvice.map((advice, i) => <li key={i}>{advice}</li>)
      ) : (
        <li>No advice available.</li>
      )}
    </ul>
  </div>

  

  {/* Download Button */}
  {data && (
    <div className="text-center mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => handleDownloadReport(data)}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all"
      >
        Download Report
      </motion.button>
    </div>
  )}
</div>

  );
};

export default ResultDisplay;
