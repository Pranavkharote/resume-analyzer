const express = require("express");
const cors = require("cors");
const corsConfig = require("./config/cors");
const userAuth = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.use("/users/auth", userAuth);
app.use("/upload", uploadRoutes);

module.exports = app;
