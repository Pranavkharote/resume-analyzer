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
    <p className="text-xl font-semibold mb-4">AI Advice</p>
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
