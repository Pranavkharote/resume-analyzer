const { analyzeResume } = require("../services/ats.service");

exports.uploadResume = async (req, res) => {
  try {
    const { jobPosition, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await analyzeResume(
      req.file.buffer,
      jobPosition,
      description
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Failed to analyze resume",
      details: err.message,
    });
  }
};
