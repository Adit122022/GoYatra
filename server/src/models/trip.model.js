const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    budget: {
      type: String,
      enum: ["cheap", "moderate", "luxary"],
      required: true,
    },
    travelGroup: {
      type: String,
      enum: ["just_me", "couple", "friends", "family"],
      required: true,
    },

    // Flexible structure for the AI-generated plan
    generatedPlan: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const tripModel = mongoose.model("Trip", tripSchema);

module.exports = tripModel;
