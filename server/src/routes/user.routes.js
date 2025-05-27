const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  checkAuth,
} = require("../controllers/user.controller");
const router = express.Router();

const { authMiddleware } = require("../middleware/user.middleware");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/check-auth", authMiddleware, checkAuth);

module.exports = router;
