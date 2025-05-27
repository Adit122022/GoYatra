const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

module.exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(`authtoken:${token}`);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    if (!decoded) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
