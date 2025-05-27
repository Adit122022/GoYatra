const express = require("express");
const { createTrip, getTrip } = require("../controllers/trip.controller");
const { authMiddleware } = require("../middleware/user.middleware");
const { chatController } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/createtrip", authMiddleware, createTrip);

router.post("/chat", chatController);

router.get("/:tripId", authMiddleware, getTrip); // Route to get trip details

module.exports = router;