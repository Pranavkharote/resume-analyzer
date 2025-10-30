import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Brain, BarChart, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="w-full bg-white text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-blue-600 to-blue-800 text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6"
        >
          Land Your Dream Job with <span className="text-yellow-300">AI Resume Analyzer</span>
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
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Resume Analyzer?</h2>
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
              desc: "Our Gemini-powered engine scans your content, layout, and keywords.",
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

      {/* Testimonials Section */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              name: "Priya Sharma",
              role: "Software Engineer @ TCS",
              text: "Got interview calls after optimizing my resume with this AI tool. The feedback was insanely accurate!",
            },
            {
              name: "Rahul Verma",
              role: "Data Analyst",
              text: "It found missing keywords for job postings I was applying to. Helped me cross the ATS wall easily!",
            },
            {
              name: "Sneha Iyer",
              role: "Fresh Graduate",
              text: "The AI reviewer pointed out things I never noticed. Totally worth trying before applying anywhere.",
            },
          ].map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-md"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">“{review.text}”</p>
              <div className="font-semibold">{review.name}</div>
              <div className="text-sm text-gray-500">{review.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
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
              features: ["Unlimited Scans", "Detailed AI Insights", "Keyword Recommendations", "Export Report"],
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
                plan.highlight ? "border-blue-600 scale-105" : "border-gray-200"
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
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-blue-900 text-blue-100 text-center">
        <p>© {new Date().getFullYear()} AI Resume Analyzer — Built with ❤️ by Pranav</p>
        <p className="text-sm mt-2">Empowering job seekers with AI insights.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
