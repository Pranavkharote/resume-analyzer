# AI Resume Analyzer

**AI Resume Analyzer** is a web application that leverages AI to evaluate resumes, provide ATS scores, highlight missing keywords, and give actionable feedback to help job seekers improve their resumes.

## Features

- **ATS Score:** Provides a match percentage indicating how well your resume passes Applicant Tracking Systems.
- **Missing Keywords:** Identifies important keywords missing from your resume.
- **AI Feedback:** Offers actionable suggestions for improving formatting, skills, and project descriptions.
- **Strength Analysis:** Highlights your technical and soft skill strengths.
- **PDF Upload:** Supports uploading resumes in PDF format.
- **Downloadable Report:** Export your analysis as a PDF report for reference.

## 🧱 Tech Stack

| Tech         | Usage                         |
|--------------|-------------------------------|
| **React.js** | Frontend & UI Components      |
| **TailwindCSS** | Styling                    |
| **Node.js**  | Server-side runtime           |
| **API Key** | Google Gemini API              |
| **PDF Parse** | NPM PDF Parser               |
| **Express.js** | Backend routing & API logic |
| **Vercel**   | Frontend Deployment           |
| **Render**   | Backend Hosting               |

---

## 🛠️ Local Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/Pranavkharote/resume-analyzer.git
cd resume-analyzer

# 2. Backend setup
cd backend
npm install
# Create `.env` with Mongo URI & JWT_SECRET
nodemon server.js

# 3. Frontend setup
cd frontend
npm install
npm run dev
