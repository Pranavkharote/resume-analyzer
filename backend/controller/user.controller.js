const { User } = require("../models/user.model.js");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    let isPassword = await bcrypt.compare(password, user.password);
    if (isPassword) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res
        .status(200)
        .json({ token: token, message: "LoggedIn Successfully" });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `something went wrong. ${e}` });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (existingUser) {
      return res.status(409).json({
        message: "User already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      message: "User Created Successfully!",
    });
    
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong ${e}`,
    });
  }
};

module.exports = { login, register };
