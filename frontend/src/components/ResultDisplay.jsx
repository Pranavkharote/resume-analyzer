import React from "react";
import jsPDF from "jspdf";



const handleDownloadReport = (data) => {
  if (!data) return;

  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
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

    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 15;
  };

  // Title
  addHeading("AI Resume Analysis By JobLens");
  addHeading("Developed by Pranav Kharote");

  // ATS Score
  addHeading("ATS Score");
  addContent(`${data.atsScore}% Match`);

  // Missing Keywords
  addHeading("Missing Keywords");
  addContent(data.missingKeywords.length ? data.missingKeywords.join(", ") : "None");

  // Feedback
  addHeading("Feedback");
  addContent(data.feedback.length ? data.feedback.join("\n") : "None");

  // Strengths
  addHeading("Strengths");
  addContent(data.strengths.length ? data.strengths.join("\n") : "None");

  doc.save("Resume_Analysis.pdf");
};

const ResultDisplay = ({ data }) => {
  if (!data) return null;

  const { atsScore, missingKeywords, feedback, strengths, jobRoleSuggestions } = data;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        AI Resume Analysis
      </h2>

      {/* ATS Score */}
      <div className="mb-8">
        <p className="text-xl font-semibold mb-3 text-gray-700">ATS Score</p>
        <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden">
          <div
            className={`h-5 rounded-full transition-all duration-500 ${
              atsScore > 80
                ? "bg-green-500"
                : atsScore > 50
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            style={{ width: `${atsScore}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 font-medium text-gray-700">{atsScore}% Match</p>
      </div>

      {/* Missing Keywords */}
      <div className="mb-8">
        <p className="text-xl font-semibold mb-3 text-gray-700">Missing Keywords</p>
        <div className="flex flex-wrap gap-3">
          {missingKeywords?.length ? (
            missingKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-red-200 transition"
              >
                {kw}
              </span>
            ))
          ) : (
            <p className="text-green-600 font-semibold">✅ No missing keywords!</p>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div className="mb-8">
        <p className="text-xl font-semibold mb-3 text-gray-700">Feedback</p>
        <ul className="list-decimal pl-6 space-y-3 text-gray-800">
          {feedback?.map((f, i) => (
            <li key={i} className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Strengths */}
      <div>
        <p className="text-xl font-semibold mb-3 text-gray-700">Strengths</p>
        <ul className="list-disc pl-6 space-y-2 text-green-700">
          {strengths?.map((s, i) => (
            <li key={i} className="bg-green-50 p-2 rounded-lg shadow-inner border border-green-100">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xl font-semibold mb-3 text-gray-700">Suggested Job Roles</p>
        <ul className="list-disc pl-6 space-y-2 text-blue-900">
          {jobRoleSuggestions?.map((s, i) => (
            <li key={i} className="bg-green-50 p-2 rounded-lg shadow-inner border border-green-100">
              {s}
            </li>
          ))}
        </ul>
      </div>
      {data && (
  <button
    onClick={() => handleDownloadReport(data)}
    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
  >
    Download Report
  </button>
)}
    </div>
  );
};

export default ResultDisplay;
