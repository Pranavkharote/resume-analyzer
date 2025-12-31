const allowedOrigins = [
  "http://localhost:5173",
  "https://joblensonline.vercel.app",
  /\.vercel\.app$/,
];

module.exports = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );

    if (allowed) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
