const express = require("express");
const { createTrip, getTrip, getTripHistory } = require("../controllers/trip.controller");
const { clerkAuthMiddleware } = require("../middleware/clerk.middleware");
const { chatController } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/createtrip", clerkAuthMiddleware, createTrip);

router.post("/chat", chatController);

// Swapped the order of the next two routes
router.get("/history", clerkAuthMiddleware, getTripHistory);

router.get("/:tripId", clerkAuthMiddleware, getTrip);

module.exports = router;