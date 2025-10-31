import React from "react";
import jsPDF from "jspdf";
import { CheckCircle, XCircle, Star, Briefcase } from "lucide-react";

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

  addHeading("AI Resume Analysis By JobLens");
  addHeading("Developed by Pranav Kharote");

  addHeading("ATS Score");
  addContent(`${data.atsScore}% Match`);

  addHeading("Missing Keywords");
  addContent(data.missingKeywords.length ? data.missingKeywords.join(", ") : "None");

  addHeading("Feedback");
  addContent(data.feedback.length ? data.feedback.join("\n") : "None");

  addHeading("Strengths");
  addContent(data.strengths.length ? data.strengths.join("\n") : "None");

  doc.save("Resume_Analysis.pdf");
};

const ResultDisplay = ({ data }) => {
  if (!data) return null;

  const { atsScore, missingKeywords, feedback, strengths, jobRoleSuggestions } = data;

  return (
    <section className="w-full py-16 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600">
      <div className="max-w-5xl mx-auto px-6 md:px-0">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12 drop-shadow-lg">
          AI-Powered Resume Insights
        </h2>

        {/* ATS Score */}
        <div className="mb-12 bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-8 rounded-3xl shadow-xl border border-white/20">
          <p className="text-xl font-semibold text-white mb-4">ATS Score</p>
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
          <p className="text-center mt-2 font-medium text-white/90">{atsScore}% Match</p>
        </div>

        {/* Missing Keywords */}
        <div className="mb-12 bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <p className="text-xl font-semibold text-white mb-4">Missing Keywords</p>
          <div className="flex flex-wrap gap-3">
            {missingKeywords?.length ? (
              missingKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="bg-red-600/20 text-red-100 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-red-500/30 transition"
                >
                  {kw}
                </span>
              ))
            ) : (
              <div className="flex items-center gap-2 text-green-200 font-semibold">
                <CheckCircle size={18} /> No missing keywords!
              </div>
            )}
          </div>
        </div>

        {/* Feedback */}
        <div className="mb-12 bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <p className="text-xl font-semibold text-white mb-4">Feedback</p>
          <ul className="list-decimal pl-6 space-y-3 text-white/90">
            {feedback?.map((f, i) => (
              <li
                key={i}
                className="bg-white/10 p-4 rounded-2xl border border-white/20 shadow-sm hover:bg-white/20 transition"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Strengths */}
        <div className="mb-12 bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <p className="text-xl font-semibold text-white mb-4">Strengths</p>
          <ul className="list-disc pl-6 space-y-3 text-green-200">
            {strengths?.map((s, i) => (
              <li
                key={i}
                className="bg-green-600/20 p-3 rounded-xl shadow-inner border border-green-400/30 hover:bg-green-600/30 transition"
              >
                <Star size={16} className="inline mr-2" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Job Roles */}
        <div className="mb-12 bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          <p className="text-xl font-semibold text-white mb-4">Suggested Job Roles</p>
          <ul className="list-disc pl-6 space-y-3 text-blue-200">
            {jobRoleSuggestions?.map((role, i) => (
              <li
                key={i}
                className="bg-blue-600/20 p-3 rounded-xl shadow-inner border border-blue-400/30 hover:bg-blue-600/30 transition flex items-center gap-2"
              >
                <Briefcase size={16} />
                {role}
              </li>
            ))}
          </ul>
        </div>

        {/* Download Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => handleDownloadReport(data)}
            className="bg-white text-indigo-800 font-bold px-10 py-4 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all"
          >
            Download Full Report
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResultDisplay;
