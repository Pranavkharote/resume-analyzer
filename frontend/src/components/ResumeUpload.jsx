import React, { useState } from "react";
import axios from "axios";
import "../index.css"; 

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Backend response:", res.data);

      if (res.data && res.data.text) {
        setText(res.data.text);
      } else if (res.data && res.data.error) {
        alert("Server Error: " + res.data.error);
      } else {
        alert("Unexpected response from server"); // Only shows if response has no text or error
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload or parse PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Resume</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 bg-red px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {text && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2">Extracted Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
