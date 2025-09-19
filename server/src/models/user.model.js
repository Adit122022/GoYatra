const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: "String",
    required: [true, "Username is required"],
  },
  email: {
    type: "String",
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
