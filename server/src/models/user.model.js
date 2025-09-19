const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String, // Corrected from "String" to String
    required: [true, "Username is required"],
  },
  email: {
    type: String, // Corrected from "String" to String
    required: [true, "Email is required"],
  },
  trips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
  ],
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
