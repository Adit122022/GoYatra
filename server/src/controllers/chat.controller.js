const { chatModel } = require("../models/chat");
const chatWithGemini = require("../utils/gemini");




module.exports.chatController = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message must be a string." });
  }

  try {
    let reply = null;

    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        const match = message.match(pattern);
        if (match) {
          if (intent.action) {
            reply = await intent.action(match);
          } else {
            reply = intent.response;
          }
          break;
        }
      }
      if (reply) break;
    }

    // Fallback to Gemini if no intent matched
    if (!reply) {
      reply = await chatWithGemini(message);
    }

    await new chatModel({ user: message, bot: reply }).save();

    res.json({ reply });
  } catch (err) {
    console.error("ChatController error:", err.message);
    res.status(500).json({ reply: "An internal error occurred." });
  }
};