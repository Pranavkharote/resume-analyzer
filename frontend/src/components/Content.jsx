import React, { useState } from 'react'
import axios from "axios";

const Content = () => {
  const [uFile, setUFile] = useState();



  return (
     <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Resume Analyzer</h1>
      <input type="file" accept=".pdf" />
      <button type='submit'>Upload Resume</button>
    </div>
  )
}

export default Content