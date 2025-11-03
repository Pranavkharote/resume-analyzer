import React from "react";
import { motion } from "framer-motion";
import { FileText, Brain, BarChart, CheckCircle, Star, Code, Cpu, Download } from "lucide-react";
import { Link } from "react-router-dom";
import GithubCorner from "react-github-corner";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiTailwindcss, SiMongodb, SiExpress } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const router = useNavigate();      
  const isLoggedIn = () => {
  const token = localStorage.getItem("token")

  if(token){
    router("/upload/resume");
  } else {
    router("/user/auth");
  }
}
  return (
    <div className="w-full bg-white text-gray-900">
      <GithubCorner href="https://github.com/pranavkharote/resume-analyzer" />

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-indigo-700 to-blue-900 text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6"
        >
          Level Up Your Career with <span className="text-yellow-300">JobLens</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg max-w-2xl mb-10 text-blue-100"
        >
          JobLens is your personal AI recruiter — analyzing your resume against real job descriptions,
          giving you instant ATS scores, missing keywords, and actionable insights to help you land
          your next big opportunity.
        </motion.p>

        <button
        onClick={isLoggedIn}
         
          className="bg-yellow-400 text-blue-900 font-semibold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all"
        >
          Try JobLens Free →
        </button>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-indigo-700">JobLens</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FileText className="w-12 h-12 text-indigo-600" />,
              title: "Instant ATS Scoring",
              desc: "Get your resume’s real ATS compatibility score and fix gaps instantly.",
            },
            {
              icon: <Brain className="w-12 h-12 text-indigo-600" />,
              title: "AI Keyword Insights",
              desc: "JobLens scans job descriptions to highlight missing or weak keywords.",
            },
            {
              icon: <BarChart className="w-12 h-12 text-indigo-600" />,
              title: "Actionable Feedback",
              desc: "Get specific suggestions to improve your content, tone, and layout.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

        <section className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Powerful AI-Powered Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {[
            {
              icon: <Brain className="w-10 h-10 text-blue-700" />,
              title: "AI Resume Scoring",
              desc: "Get a smart ATS score and feedback based on your resume and job description.",
            },
            {
              icon: <FileText className="w-10 h-10 text-blue-700" />,
              title: "Keyword Insights",
              desc: "Detect missing job-specific keywords and improve your resume instantly.",
            },
            {
              icon: <Download className="w-10 h-10 text-blue-700" />,
              title: "Download Report",
              desc: "Get a professional AI-generated report of your strengths and improvement areas.",
            },
            {
              icon: <BarChart className="w-10 h-10 text-blue-700" />,
              title: "Visual Performance Charts",
              desc: "Understand your score visually with interactive charts and analytics.",
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-blue-700" />,
              title: "Smart Matching",
              desc: "See how well your resume aligns with a specific job position in seconds.",
            },
            {
              icon: <Star className="w-10 h-10 text-blue-700" />,
              title: "Personalized Feedback",
              desc: "Receive actionable AI tips to boost your resume’s chances of getting shortlisted.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How JobLens Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {[
            {
              step: "1",
              title: "Upload Resume",
              desc: "Upload your resume in PDF format. JobLens parses and reads it instantly.",
            },
            {
              step: "2",
              title: "Paste Job Description",
              desc: "Add your target job description — AI will find the gaps and keyword mismatches.",
            },
            {
              step: "3",
              title: "View AI Report",
              desc: "Get an ATS score, missing skills, and improvement plan — all in seconds.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center max-w-xs"
            >
              <div className="text-5xl font-bold text-indigo-600 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TECH STACK SECTION */}
<section className="py-20 px-6 bg-gray-50">
  <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">⚙️ Built With</h2>
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center">
    {[
      { icon: <FaReact className="text-blue-500 hover:scale-125 transition-transform duration-300" />, name: "React" },
      { icon: <SiTailwindcss className="text-teal-400 hover:scale-125 transition-transform duration-300" />, name: "TailwindCSS" },
      { icon: <FaNodeJs className="text-green-600 hover:scale-125 transition-transform duration-300" />, name: "Node.js" },
      { icon: <SiExpress className="text-gray-700 hover:scale-125 transition-transform duration-300" />, name: "Express" },
      { icon: <SiMongodb className="text-green-700 hover:scale-125 transition-transform duration-300" />, name: "MongoDB" },
      { icon: <FaDatabase className="text-yellow-600 hover:scale-125 transition-transform duration-300" />, name: "Mongoose" },
    ].map((tech, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: i * 0.1 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="text-6xl">{tech.icon}</div>
        <span className="text-sm font-medium text-gray-700">{tech.name}</span>
      </motion.div>
    ))}
  </div>
</section>


      {/* PRICING SECTION */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans <span className="text-gray-400 text-base">(Coming Soon)</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            {
              title: "Free Plan",
              price: "$0",
              features: ["1 Resume Scan", "Basic ATS Score", "Essential Feedback"],
            },
            {
              title: "Pro Plan",
              price: "$9/mo",
              features: ["Unlimited Scans", "Detailed Insights", "Keyword Suggestions", "Export Report"],
              highlight: true,
            },
            {
              title: "Team Plan",
              price: "$29/mo",
              features: ["Up to 5 Members", "Custom Reports", "Priority Support", "API Access"],
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl shadow-md border ${
                plan.highlight ? "border-indigo-600 scale-105" : "border-gray-200"
              } transition-all`}
            >
              <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-6">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold ${
                  plan.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-blue-900 text-blue-100 text-center">
        <p>© {new Date().getFullYear()} JobLens — Built with ❤️ by Pranav</p>
        <p className="text-sm mt-2">Empowering job seekers with AI insights.</p>
        <div className="mt-2 flex justify-center gap-4 text-xl">
                  <a
                    href="https://github.com/pranavkharote"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                    title="GitHub"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://linkedin.com/in/pranavkharote"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                </div>
      </footer>
    </div>
  );
};

export default LandingPage;
