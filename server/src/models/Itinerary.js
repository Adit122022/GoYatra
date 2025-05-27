const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    itinerary: {
      type: Array, // This stores the AI-generated plan for each day
      required: true,
    },
  },
  { timestamps: true }
);

iteneraryModel = mongoose.model("Itinerary", itinerarySchema);

module.exports = iteneraryModel;
