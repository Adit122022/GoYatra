const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    bot: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports.chatModel = mongoose.model("Chat", chatSchema);