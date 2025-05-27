const { chatModel } = require("../models/chat");
const chatWithGemini = require("../utils/gemini");
const getWeather = require("../utils/weather");


const intents = [
  {
    category: "Account Management",
    patterns: [/login/i, /reset.*password/i],
    response:
      "For login or password reset issues, please visit your account settings or use the 'Forgot Password' option.",
  },
  {
    category: "Booking & Reservations",
    patterns: [
      /book.*flight/i,
      /hotel.*(reserve|book|find)/i,
      /rental.*car/i,
      /rent.*car/i,
    ],
    response:
      "I'd love to help you with bookings. Please provide the destination, dates, and your budget.",
  },
  {
    category: "Weather",
    patterns: [
      /weather.*in ([a-zA-Z\s]+)/i,
      /what.*weather.*in ([a-zA-Z\s]+)/i,
      /how.*weather.*in ([a-zA-Z\s]+)/i,
    ],
    action: async (match) => await getWeather(match[1]),
  },
  {
    category: "Forecast",
    patterns: [
      /will it rain.*in ([a-zA-Z\s]+)/i,
      /forecast.*in ([a-zA-Z\s]+)/i,
      /rain.*tomorrow.*in ([a-zA-Z\s]+)/i,
    ],
    action: async (match) => await getWeather(match[1]),
  },
  {
    category: "Travel Assistance",
    patterns: [
      /visa.*(for)? ([a-zA-Z\s]+)/i,
      /do i need.visa.([a-zA-Z\s]+)/i,
      /exchange.*rate/i,
      /top.*(spots|places).*in ([a-zA-Z\s]+)/i,
      /what.tourist.(spots|places).*in ([a-zA-Z\s]+)/i,
    ],
    response:
      "I can assist with visa information, currency exchange rates, and local attractions. Please specify the country or city you're interested in.",
  },
  {
    category: "Technical Support",
    patterns: [
      /app.*(crash|not working)/i,
      /payment.*(fail|issue)/i,
      /dark mode/i,
    ],
    response:
      "Thank you for your feedback. For app crashes, please try reinstalling the application. We're continuously working on improvements, including features like dark mode.",
  },
];


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