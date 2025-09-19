const userModel = require("../models/user.model");

module.exports.checkAuth = async (req, res) => {
  try {
    res.status(200).json({ message: "Authenticated", user: req.user });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
