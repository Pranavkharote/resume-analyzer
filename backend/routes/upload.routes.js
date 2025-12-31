const express = require("express");
const multer = require("multer");
const { uploadResume } = require("../controller/resume.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), uploadResume);

module.exports = router;
