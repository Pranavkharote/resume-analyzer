const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const pdfParse = require("pdf-parse");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const pdfData = await pdfParse(req.file.buffer);
    res.json({ text: pdfData.text });
  } catch (err) {
    res.status(500).json({ error: "failed to parse PDF" });
  }
});

app.get("/", (req, res) => {
  res.send("working route");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
