const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// init Gemini with API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/review", async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "No resume text provided" });
    }

    // pick model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // structured JSON prompt
    const prompt = `
    You are an ATS evaluator.
    Review the following resume text and return strictly valid JSON:
    {
      "atsScore": number (0-100),
      "missingKeywords": [list of strings],
      "feedback": [list of strings],
      "strengths": [list of strings]
    }

    Resume Text:
    ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    // Try parsing JSON safely
    let review;
    try {
      review = JSON.parse(output);
    } catch (e) {
      review = { raw: output }; // fallback if Gemini doesn't return clean JSON
    }

    res.json({ success: true, review });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({ error: "Error analyzing resume" });
  }
});

module.exports = router;
