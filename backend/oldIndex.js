// const express = require("express");
// const multer = require("multer");
// const pdfParse = require("pdf-parse");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();
// const cors = require("cors");
// const mongoose = require("mongoose");
// const userAuth = require("./routes/user.routes");
// const app = express();

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://joblensonline.vercel.app",
//   /\.vercel\.app$/, // allows preview deploys
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // Postman / curl
//       if (
//         allowedOrigins.some((o) =>
//           o instanceof RegExp ? o.test(origin) : o === origin
//         )
//       ) {
//         return callback(null, true);
//       }
//       console.log("Blocked by CORS:", origin);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use("/users/auth", userAuth);

// const start = async () => {
//   try {
//     const connectDB = await mongoose.connect(process.env.MONGO_URI);
//     console.log("DB connected ");
//   } catch (err) {
//     console.error("DB connection failed", err.message);
//   }
// };
// start();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// function chunkText(text, maxLength = 2000) {
//   const words = text.split(/\s+/);
//   const chunks = [];
//   let current = [];
//   let currentLength = 0;

//   for (const word of words) {
//     current.push(word);
//     currentLength += word.length + 1;
//     if (currentLength >= maxLength) {
//       chunks.push(current.join(" "));
//       current = [];
//       currentLength = 0;
//     }
//   }
//   if (current.length) chunks.push(current.join(" "));
//   return chunks;
// }

// function safeJSONParse(str) {
//   try {
//     return JSON.parse(str);
//   } catch {
//     // fallback: try to extract {...} from text
//     const match = str.match(/\{[\s\S]*\}/);
//     if (match) {
//       try {
//         return JSON.parse(match[0]);
//       } catch {}
//     }
//     return { raw: str };
//   }
// }

// app.post("/upload", upload.single("resume"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const { jobPosition, description } = req.body;
//     console.log("description :", description);
//     console.log("jobPosition :", jobPosition);

//     const pdfData = await pdfParse(req.file.buffer);
//     const resumeText = pdfData.text?.trim();
//     if (!resumeText)
//       return res.status(400).json({ error: "No readable text found in PDF" });

//    const model = genAI.getGenerativeModel({
//    model: "models/gemini-2.5-flash"
// });

//     // const chunks = chunkText(resumeText, 2000);
//     const MAX_CHUNKS = 3;
//     const chunks = chunkText(resumeText, 2000).slice(0, MAX_CHUNKS);

//     async function generateWithRetry(model, prompt, retries = 3) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await model.generateContent(prompt);
//     } catch (err) {
//       if (err.message.includes("503") && i < retries - 1) {
//         await new Promise(res => setTimeout(res, 1000 * (i + 1)));
//       } else {
//         throw err;
//       }
//     }
//   }
// }


//     const finalResult = {
//       atsScore: 0,
//       missingKeywords: [],
//       feedback: [],
//       strengths: [],
//       matchingSummary: [],
//       yourAdvice: [],
//     };

//     for (const chunk of chunks) {
//       const prompt = `
// You are an expert ATS (Applicant Tracking System) evaluator.  

// Compare the candidate's resume with the provided job position and job description, and return a JSON response strictly in this format:

// {
//   "atsScore": number (0-100),
//   "missingKeywords": [list of strings],
//   "feedback": [list of strings],
//   "strengths": [list of strings],
//   "matchingSummary": string,
//   "yourAdvice": [list of strings]
// }

// Guidelines:
// - "atsScore" reflects how well the resume matches the job position and job description (skills, experience, keywords, seniority, and context). 
// - "missingKeywords" should list important skills or terms from the job description or position missing in the resume. 
// - "feedback" should provide specific, actionable improvements, e.g., “Add measurable achievements”, “Mention relevant tools like React or Docker”, “Highlight leadership experience for senior roles”. 
// - "strengths" should list what the resume does well for the job position. 
// - "matchingSummary" should be a concise summary (2-3 sentences) describing overall fit and suitability. 
// - "yourAdvice" should provide practical steps the candidate should take to improve chances of being shortlisted.

// Job Position:
// ${jobPosition}

// Job Description:
// ${description}

// Resume:
// ${chunk}
//       `;

//      const result = await generateWithRetry(model, prompt);

//       let text = result.response
//         .text()
//         .replace(/```json|```/g, "")
//         .trim();
//       const parsed = safeJSONParse(text);

//       // Merge results correctly
//       if (parsed.atsScore) finalResult.atsScore += parsed.atsScore;
//       if (parsed.missingKeywords)
//         finalResult.missingKeywords.push(...parsed.missingKeywords);
//       if (parsed.feedback) finalResult.feedback.push(...parsed.feedback);
//       if (parsed.strengths) finalResult.strengths.push(...parsed.strengths);
//       if (parsed.matchingSummary)
//         finalResult.matchingSummary.push(parsed.matchingSummary);
//       if (parsed.yourAdvice) finalResult.yourAdvice.push(...parsed.yourAdvice);
//     }

//     // Average atsScore
//     finalResult.atsScore = Math.round(finalResult.atsScore / chunks.length);

//     // Deduplicate arrays
//     finalResult.missingKeywords = [...new Set(finalResult.missingKeywords)];
//     finalResult.feedback = [...new Set(finalResult.feedback)];
//     finalResult.strengths = [...new Set(finalResult.strengths)];
//     finalResult.matchingSummary = [...new Set(finalResult.matchingSummary)];
//     finalResult.yourAdvice = [...new Set(finalResult.yourAdvice)];

//     res.json(finalResult);
//  } catch (error) {
//   console.error("❌ Error analyzing resume:", error);
//   res.status(500).json({
//     error: "Failed to analyze resume",
//     details: error.message,
//     stack: error.stack
//   });
// }

// });

// // --- Start Server ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
