const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User Registration
module.exports.userRegistration = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "failed", message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword,
    });

    const userData = await newUser.save();

    const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET);

    res.status(201).json({
      status: "success",
      message: "Verification email sent",
      token: token,
    });
  } catch (error) {
    console.error("Error in userRegistration:", error);
    res.status(500).json({ status: "failed", message: "Unable to register" });
  }
};

// Get User by ID
module.exports.userById = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to process request" });
  }
};

// User Login
module.exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "You are not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      status: "success",
      message: "Login Successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to login" });
  }
};



