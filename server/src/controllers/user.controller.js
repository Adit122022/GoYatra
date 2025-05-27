const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


module.exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      { id: user._id, name: user.username },
      process.env.JWT_TOKEN
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.username },
      process.env.JWT_TOKEN
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.logoutController = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};

module.exports.checkAuth = (req, res) => {
  try {
    // If the request reaches here, the user is authenticated (thanks to authMiddleware)
    res.status(200).json({ message: "Authenticated", userId: req.user._id });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
