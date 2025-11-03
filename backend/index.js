const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userAuth = require("./routes/user.routes")
const app = express();

// 1️⃣ MUST be first
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, curl, server-to-server
    const allowed = [
      "http://localhost:5173",
      "https://joblensonline.vercel.app",
      /\.vercel\.app$/   // allows preview deploys
    ];
    if (allowed.some(a => a instanceof RegExp ? a.test(origin) : a === origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use(express.json());
app.use("/users/auth", userAuth);



const start = async () => {
  try{
    const connectDB = await mongoose.connect(process.env.MONGO_URI)
    console.log("DB connected ")
  } catch(err) {
    console.error("DB connection failed", err.message)
  }

}
start();


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
    const jobPosition = req.body.jobPosition;
    const description = req.body.description;
    console.log("description :", description);
    console.log("jobPosition :", jobPosition);
    // if (!description)
    //   return res.status(400).json({ error: "No description added" });
    // console.log(req.body.description);
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();
    if (!resumeText)
      return res.status(400).json({ error: "No readable text found in PDF" });

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });
    const chunks = chunkText(resumeText, 2000);

    const finalResult = {
      atsScore: 0,
      missingKeywords: [],
      feedback: [],
      strengths: [],
      yourAdvice:[],
    };

    for (const chunk of chunks) {
      const prompt = `
You are an expert ATS (Applicant Tracking System) evaluator.

Compare the candidate's resume with the provided job position and job description, and return a JSON response strictly in this format:
{
  "atsScore": number (0-100),
  "missingKeywords": [list of strings],
  "feedback": [list of strings],
  "strengths": [list of strings],
  "matchingSummary": string,
  "yourAdvice: [list of strings]
}

Guidelines:
- "atsScore" reflects how well the resume matches the job position and job description (skills, experience, keywords, and seniority/context).
- "missingKeywords" should list important terms or skills from the job description or job position that are missing in the resume.
- "feedback" should give specific, actionable improvements (e.g., “Add measurable achievements”, “Mention relevant tools like React or Docker”, “Highlight leadership experience for senior roles”).
- "strengths" should list what the resume does well in relation to the job position and description.
- "matchingSummary" should be a concise summary (2–3 sentences) describing the overall fit and suitability for the role.

Job Position:
${jobPosition}

Job Description:
${description}

Resume:
${chunk}
`;

      const result = await model.generateContent(prompt);
      let text = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      const parsed = safeJSONParse(text);

      // Merge results from chunk
      if (parsed.atsScore) finalResult.atsScore += parsed.atsScore;
      if (parsed.missingKeywords)
        finalResult.missingKeywords.push(...parsed.missingKeywords);
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
