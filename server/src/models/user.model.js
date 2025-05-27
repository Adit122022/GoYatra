const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: "String",
    required: [true, "Username is required"],
  },
  email: {
    type: "String",
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    minlength: [6, "Email must be at least 6 characters"],
  },
  password: {
    type: "String",
    required: [true, "password is required"],
    minlength: [6, "Password must be atleast 6 characters long"],
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
