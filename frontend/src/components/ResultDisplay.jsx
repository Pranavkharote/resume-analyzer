// ResultDisplay.jsx
import React from "react";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Star, Briefcase } from "lucide-react";

const handleDownloadReport = (data) => {
  if (!data) return;

  const doc = new jsPDF("p", "pt", "a4");
  const pageHeight = doc.internal.pageSize.height;
  const margin = 40;
  const maxWidth = 500;
  let y = 60;

  // Helper function: check for overflow and add new page
  const checkPageOverflow = (addedHeight = 0) => {
    if (y + addedHeight > pageHeight - 60) {
      doc.addPage();
      y = 60;
    }
  };

  const addHeading = (text) => {
    checkPageOverflow(30);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 25;
  };

  const addContent = (text) => {
    if (!text) text = "None";

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = 14;

    for (let i = 0; i < lines.length; i++) {
      checkPageOverflow(lineHeight);
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }

    y += 10; // spacing after content block
  };

  // === Header Section ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AI Resume Analysis By JobLens", margin, y);
  y += 25;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Developed by Pranav Kharote", margin, y);
  y += 25;

  // === Content Sections ===
  addHeading("ATS Score");
  addContent(`${data.atsScore || "N/A"}% Match`);

  addHeading("Missing Keywords");
  addContent(
    Array.isArray(data.missingKeywords)
      ? data.missingKeywords.join(", ")
      : data.missingKeywords || "None"
  );

  addHeading("Feedback");
  addContent(
    Array.isArray(data.feedback)
      ? data.feedback.join("\n")
      : data.feedback || "None"
  );

  addHeading("Strengths");
  addContent(
    Array.isArray(data.strengths)
      ? data.strengths.join("\n")
      : data.strengths || "None"
  );

  addHeading("Matching Summary");
  addContent(
    Array.isArray(data.matchingSummary)
      ? data.matchingSummary.join("\n")
      : data.matchingSummary || "None"
  );

  addHeading("AI Advice");
  addContent(
    Array.isArray(data.yourAdvice)
      ? data.yourAdvice.join("\n")
      : data.yourAdvice || "None"
  );

  // === Add Page Numbers ===
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      pageHeight - 20,
      { align: "center" }
    );
  }

  doc.save("Resume_Analysis_by_Pranav.pdf");
};

const ResultDisplay = ({ data }) => {
  if (!data) return null;
  const {
    atsScore,
    missingKeywords,
    feedback,
    strengths,
    matchingSummary,
    yourAdvice,
  } = data;

  return (
    <div className="max-w-5xl mx-auto mt-16">

  {/* Header Section */}
  <div className="text-center mb-14">
    <h2 className="text-4xl font-bold text-indigo-900 tracking-tight">
      Resume Analysis Report
    </h2>
    <p className="text-indigo-600/70 mt-2">
      Here is your AI-generated ATS and skill evaluation summary.
    </p>
  </div>

  {/* ATS SCORE CARD */}
  <div className="bg-white shadow-lg rounded-2xl border border-indigo-100 p-8 mb-12">
    <p className="text-lg font-semibold text-indigo-900 mb-4">ATS Score</p>

    <div className="w-full bg-indigo-100 rounded-full h-4 overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all duration-700 ${
          atsScore > 80
            ? "bg-indigo-600"
            : atsScore > 50
            ? "bg-indigo-400"
            : "bg-indigo-300"
        }`}
        style={{ width: `${atsScore}%` }}
      ></div>
    </div>

    <p className="text-indigo-700 font-semibold text-center mt-3 text-lg">
      {atsScore}% Match
    </p>
  </div>

  {/* GRID WRAPPER */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* Missing Keywords */}
    <div className="bg-white shadow-lg rounded-2xl border border-indigo-100 p-8">
      <p className="text-lg font-semibold text-indigo-900 mb-5">Missing Keywords</p>

      <div className="space-y-3">
        {missingKeywords?.length ? (
          missingKeywords.map((kw, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100"
            >
              <span className="text-indigo-900 font-medium">{kw}</span>
              <XCircle size={20} className="text-indigo-500" />
            </motion.div>
          ))
        ) : (
          <div className="flex items-center gap-2 text-indigo-700 font-medium">
            <CheckCircle size={20} /> All important keywords covered!
          </div>
        )}
      </div>
    </div>

    {/* Strengths */}
    <div className="bg-white shadow-lg rounded-2xl border border-indigo-100 p-8">
      <p className="text-lg font-semibold text-indigo-900 mb-5">Strengths</p>

      <div className="space-y-3">
        {strengths?.map((s, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-xl border border-green-100"
          >
            <span className="text-green-900 font-medium">{s}</span>
            <Star size={20} className="text-green-600" />
          </motion.div>
        ))}
      </div>
    </div>
  </div>

  {/* Feedback */}
  <div className="mt-12 bg-white shadow-lg rounded-2xl border border-indigo-100 p-8">
    <p className="text-lg font-semibold text-indigo-900 mb-5">AI Feedback</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {feedback?.map((f, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.01 }}
          className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900"
        >
          {f}
        </motion.div>
      ))}
    </div>
  </div>

  {/* Matching Summary */}
  <div className="mt-12 bg-white shadow-lg rounded-2xl border border-indigo-100 p-8">
    <p className="text-lg font-semibold text-indigo-900 mb-5">Matching Summary</p>

    <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-indigo-900 leading-relaxed">
      {matchingSummary?.length
        ? matchingSummary.join(" ")
        : "No summary available."}
    </div>
  </div>

  {/* Advice */}
  <div className="mt-12 bg-white shadow-lg rounded-2xl border border-indigo-100 p-8">
    <p className="text-lg font-semibold text-indigo-900 mb-5">Actionable Advice</p>

    <ul className="list-disc list-inside space-y-2 text-indigo-900">
      {yourAdvice?.length ? (
        yourAdvice.map((advice, i) => <li key={i}>{advice}</li>)
      ) : (
        <li>No advice available.</li>
      )}
    </ul>
  </div>

  {/* Download */}
  {data && (
    <div className="text-center mt-12">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => handleDownloadReport(data)}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
      >
        Download Report
      </motion.button>
    </div>
  )}
</div>

  );
};

export default ResultDisplay;
