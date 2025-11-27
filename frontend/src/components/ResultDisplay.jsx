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
    <div className="max-w-5xl mx-auto py-8">

  {/* HEADER */}
  <div className="mb-8 border-b pb-4">
    <h2 className="text-3xl font-semibold text-gray-900">Analysis Report</h2>
    <p className="text-gray-500 text-sm mt-1">
      Generated using AI-powered resume evaluation system
    </p>
  </div>

  {/* TOP SUMMARY ROW */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

    {/* ATS SCORE */}
    <div className="p-5 border rounded-lg bg-white shadow-sm">
      <p className="text-sm text-gray-600 mb-1">ATS Score</p>
      <p className="text-3xl font-bold text-indigo-600">{atsScore}%</p>
      <div className="w-full h-2 bg-gray-200 rounded mt-3 overflow-hidden">
        <div
          style={{ width: `${atsScore}%` }}
          className="h-2 bg-indigo-500 rounded"
        ></div>
      </div>
    </div>

    {/* KEYWORDS COUNT */}
    <div className="p-5 border rounded-lg bg-white shadow-sm">
      <p className="text-sm text-gray-600 mb-1">Missing Keywords</p>
      <p className="text-xl font-semibold text-red-600">
        {missingKeywords?.length || 0}
      </p>
    </div>

    {/* STRENGTH COUNT */}
    <div className="p-5 border rounded-lg bg-white shadow-sm">
      <p className="text-sm text-gray-600 mb-1">Strength Areas</p>
      <p className="text-xl font-semibold text-green-600">
        {strengths?.length || 0}
      </p>
    </div>
  </div>

  {/* TWO-COLUMN MAIN SECTION */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* LEFT COLUMN */}
    <div className="col-span-1 space-y-6">

      {/* Missing Keywords */}
      <div className="border rounded-lg bg-white shadow-sm p-5">
        <p className="font-medium text-gray-800 mb-3">Missing Keywords</p>
        <div className="space-y-2">
          {missingKeywords?.length ? (
            missingKeywords.map((kw, idx) => (
              <div
                key={idx}
                className="text-sm flex items-center justify-between p-2 bg-red-50 border border-red-100 rounded"
              >
                <span className="text-red-700">{kw}</span>
                <XCircle size={18} className="text-red-500" />
              </div>
            ))
          ) : (
            <p className="text-green-600 text-sm">No missing keywords 🎉</p>
          )}
        </div>
      </div>

      {/* Strengths */}
      <div className="border rounded-lg bg-white shadow-sm p-5">
        <p className="font-medium text-gray-800 mb-3">Strengths</p>
        <div className="space-y-2">
          {strengths?.map((s, idx) => (
            <div
              key={idx}
              className="text-sm flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded"
            >
              <span className="text-green-800">{s}</span>
              <Star size={18} className="text-green-600" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* RIGHT WIDE COLUMN */}
    <div className="col-span-2 space-y-6">

      {/* FEEDBACK */}
      <div className="border rounded-lg bg-white shadow-sm p-5">
        <p className="font-medium text-gray-800 mb-3">Detailed Feedback</p>
        <div className="space-y-3">
          {feedback?.map((f, i) => (
            <div key={i} className="p-3 text-sm bg-gray-50 rounded border">
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="border rounded-lg bg-white shadow-sm p-5">
        <p className="font-medium text-gray-800 mb-3">Matching Summary</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {matchingSummary?.length
            ? matchingSummary.join(" ")
            : "No summary available."}
        </p>
      </div>

      {/* ADVICE */}
      <div className="border rounded-lg bg-white shadow-sm p-5">
        <p className="font-medium text-gray-800 mb-3">Actionable Advice</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {yourAdvice?.length ? (
            yourAdvice.map((a, i) => <li key={i}>{a}</li>)
          ) : (
            <li>No advice available.</li>
          )}
        </ul>
      </div>
    </div>
  </div>

  {/* DOWNLOAD BUTTON */}
  <div className="text-center mt-10">
    <button
      onClick={() => handleDownloadReport(data)}
      className="px-6 py-2.5 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700"
    >
      Download Report
    </button>
  </div>
</div>

  );
};

export default ResultDisplay;
