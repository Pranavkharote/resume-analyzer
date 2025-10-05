const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ Allow your frontend origin only
const allowedOrigins = [
  "http://localhost:5000", // Dev
  "https://resume-analyzer-tfn3.vercel.app", // Prod
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// --- Multer setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Gemini setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Upload + AI Review Route ---
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // Step 1: File validation
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 2: Extract PDF text
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();

    if (!resumeText) {
      return res.status(400).json({ error: "No readable text found in PDF" });
    }

    // Step 3: Prepare Gemini model & prompt
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const prompt = `
You are an ATS evaluator.
Analyze the resume text and return strictly valid JSON:
{
  "atsScore": number (0-100),
  "missingKeywords": [list of strings],
  "feedback": [list of strings],
  "strengths": [list of strings]
}
Resume:
${resumeText}
`;

    // Step 4: Generate AI review
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Step 5: Clean up AI output
    text = text.replace(/```json|```/g, "").trim();

    // Step 6: Try parsing AI JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.warn("⚠️ Gemini returned non-JSON text, sending raw instead.");
      parsed = { raw: text };
    }
    console.log(parsed)
    // Step 7: Send final response
    res.json(parsed);

  } catch (error) {
    console.error("❌ Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
