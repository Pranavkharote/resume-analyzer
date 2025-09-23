import axios from "axios";
import React, { useState } from "react";

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
      const res = axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setText(res.data.text);
    } catch (err) {
      console.log(err);
      alert("failed to upload or parse a pdf");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="p-6 max-w-lg mx-auto bg-red">
      <h1 className="text-xl font-bold mb-4">Upload Resume</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
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
  )
};

export default ResumeUpload;
