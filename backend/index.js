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
  "http://localhost:5000",
   "http://localhost:5173",  
  "https://resume-analyzer-tfn3.vercel.app",
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

// --- Helper: split resume into chunks ---
function chunkText(text, maxLength = 2000) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = [];
  let currentLength = 0;

  for (const word of words) {
    current.push(word);
    currentLength += word.length + 1;
    if (currentLength >= maxLength) {
      chunks.push(current.join(" "));
      current = [];
      currentLength = 0;
    }
  }
  if (current.length) chunks.push(current.join(" "));
  return chunks;
}

// --- Helper: safely parse JSON ---
function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    // fallback: try to extract {...} from text
    const match = str.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return { raw: str };
  }
}

// --- Upload + AI Review Route ---
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();
    if (!resumeText) return res.status(400).json({ error: "No readable text found in PDF" });

    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const chunks = chunkText(resumeText, 2000);

    const finalResult = {
      atsScore: 0,
      missingKeywords: [],
      feedback: [],
      strengths: [],
    };

    for (const chunk of chunks) {
      const prompt = `
You are an ATS evaluator.
Analyze the resume text and return strictly valid JSON:
{
  "atsScore": number (0-100),
  "missingKeywords": [list of strings],
  "feedback": [list of strings],
  "strengths": [list of strings]
}
Resume section:
${chunk}
`;
      const result = await model.generateContent(prompt);
      let text = result.response.text().replace(/```json|```/g, "").trim();
      const parsed = safeJSONParse(text);

      // Merge results from chunk
      if (parsed.atsScore) finalResult.atsScore += parsed.atsScore;
      if (parsed.missingKeywords) finalResult.missingKeywords.push(...parsed.missingKeywords);
      if (parsed.feedback) finalResult.feedback.push(...parsed.feedback);
      if (parsed.strengths) finalResult.strengths.push(...parsed.strengths);
    }

    // Average atsScore if multiple chunks
    finalResult.atsScore = Math.round(finalResult.atsScore / chunks.length);

    // Deduplicate arrays
    finalResult.missingKeywords = [...new Set(finalResult.missingKeywords)];
    finalResult.feedback = [...new Set(finalResult.feedback)];
    finalResult.strengths = [...new Set(finalResult.strengths)];

    res.json(finalResult);

  } catch (error) {
    console.error("❌ Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
 