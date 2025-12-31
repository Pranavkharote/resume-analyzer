const pdfParse = require("pdf-parse");
const model = require("../config/gemini");
const chunkText = require("../utils/chunkText");
const safeJSONParse = require("../utils/safeJSONParse");
const retry = require("../utils/retry");

exports.analyzeResume = async (fileBuffer, jobPosition, description) => {
  const pdfData = await pdfParse(fileBuffer);
  const resumeText = pdfData.text?.trim();
  if (!resumeText) throw new Error("No readable text found");

  const chunks = chunkText(resumeText).slice(0, 3);

  const finalResult = {
    atsScore: 0,
    missingKeywords: [],
    feedback: [],
    strengths: [],
    matchingSummary: [],
    yourAdvice: [],
  };

  for (const chunk of chunks) {
    const prompt = `...same prompt...`;

    const result = await retry(() =>
      model.generateContent(prompt)
    );

    const text = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = safeJSONParse(text);

    if (parsed.atsScore) finalResult.atsScore += parsed.atsScore;
    parsed.missingKeywords && finalResult.missingKeywords.push(...parsed.missingKeywords);
    parsed.feedback && finalResult.feedback.push(...parsed.feedback);
    parsed.strengths && finalResult.strengths.push(...parsed.strengths);
    parsed.matchingSummary && finalResult.matchingSummary.push(parsed.matchingSummary);
    parsed.yourAdvice && finalResult.yourAdvice.push(...parsed.yourAdvice);
  }

  finalResult.atsScore = Math.round(finalResult.atsScore / chunks.length);
  for (const key in finalResult) {
    if (Array.isArray(finalResult[key])) {
      finalResult[key] = [...new Set(finalResult[key])];
    }
  }

  return finalResult;
};
