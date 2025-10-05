const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const allowedOrigins = [
  'http://localhost:5000', // ✅ Dev
  'https://resume-analyzer-tfn3.vercel.app/', // ✅ Your deployed frontend
];


// --- Multer setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Gemini setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Combined Upload + AI Review Route ---
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // Step 1: Check file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 2: Parse PDF text
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText.trim()) {
      return res.status(400).json({ error: "No readable text found in PDF" });
    }

    // Step 3: Send to Gemini for review
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

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

    // const result = await model.generateContent(prompt);
    // const output = result.response.text();
    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();

      // Remove code block wrappers if they exist
      text = text.replace(/```json|```/g, "").trim();

      // Attempt to parse the JSON safely
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.warn("⚠️ Gemini returned non-JSON text, sending raw instead.");
        parsed = { raw: text };
      }

      // Always respond safely
      res.json(parsed);
    } catch (error) {
      console.error("Error in Gemini request:", error);
      res.status(500).json({ error: "Failed to process AI response" });
    }

    // Step 4: Try parsing clean JSON
    let review;
    try {
      review = JSON.parse(output);
    } catch (e) {
      review = { raw: output }; // fallback if model returns non-JSON
    }

    // Step 5: Respond
    // res.json({
    //   success: true,
    //   extractedText: resumeText,
    //   review,
    // });
  } catch (error) {
    console.error("Error in upload/review route:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// --- Start Server ---
app.listen(5000, () => console.log("App is listening on port 5000"));
