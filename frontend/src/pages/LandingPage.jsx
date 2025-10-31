import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Brain, BarChart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="w-full bg-white text-gray-900 relative">
      {/* GitHub Corner */}
      <a
        href="https://github.com/pranavkharote/resume-analyzer" // replace with your repo
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-0 right-0"
        aria-label="View source on GitHub"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          style={{
            fill: "#151513",
            color: "#fff",
            position: "absolute",
            top: 0,
            border: 0,
            right: 0,
          }}
          aria-hidden="true"
        >
          <path d="M0,0 L115,0 L115,115 L0,115 Z"></path>
          <path
            d="M128.3,109.0
            C128.3,109.0 135.0,99.0 155.0,99.0
            C175.0,99.0 175.0,119.0 155.0,119.0
            C135.0,119.0 128.3,109.0 128.3,109.0 Z"
            fill="currentColor"
            style={{ transformOrigin: "130px 106px" }}
            className="octo-arm"
          ></path>
          <path
            d="M115,115 L115,115 C114,115 80,115 80,115
            C80,115 80,115 80,115"
            fill="currentColor"
            className="octo-body"
          ></path>
        </svg>
      </a>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-blue-600 to-blue-800 text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6"
        >
          Land Your Dream Job with <span className="text-yellow-300">JobLens</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg max-w-2xl mb-10 text-blue-100"
        >
          Optimize your resume instantly with AI. Get your ATS score, keyword insights, and personalized improvement suggestions — in seconds.
        </motion.p>
        <Link
          to="/upload/resume"
          className="bg-yellow-400 text-blue-900 font-semibold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all"
        >
          Try It Free →
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose JobLens?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FileText className="w-12 h-12 text-blue-600" />,
              title: "Instant ATS Scoring",
              desc: "Know your ATS compatibility score and see what recruiters’ software sees before they do.",
            },
            {
              icon: <Brain className="w-12 h-12 text-blue-600" />,
              title: "AI-Powered Insights",
              desc: "Get personalized feedback on structure, clarity, and keywords missing for your target job roles.",
            },
            {
              icon: <BarChart className="w-12 h-12 text-blue-600" />,
              title: "Actionable Reports",
              desc: "Receive a clear, detailed report highlighting improvements you can make right now.",
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

      {/* How It Works Section */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {[
            {
              step: "1",
              title: "Upload Your Resume",
              desc: "Simply drag & drop your PDF resume or upload it from your device.",
            },
            {
              step: "2",
              title: "AI Analyzes It",
              desc: "Our AI engine scans your content, layout, and keywords.",
            },
            {
              step: "3",
              title: "Get Your Report",
              desc: "Receive your ATS score, keyword match rate, and actionable improvement tips.",
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
              <div className="text-5xl font-bold text-blue-600 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-blue-900 text-blue-100 text-center">
        <p>© {new Date().getFullYear()} JobLens — Built with ❤️ by Pranav</p>
        <p className="text-sm mt-2">Empowering job seekers with AI insights.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
