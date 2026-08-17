const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("Warning: GOOGLE_API_KEY is not set in environment variables.");
}

const model = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  apiKey: apiKey,
  temperature: 1,
  maxOutputTokens: 8192,
});

// chatSession adapter for non-stream usage to preserve backwards compatibility
const chatSession = {
  sendMessage: async (message) => {
    const response = await model.invoke(message);
    const textContent = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
    return {
      response: {
        text: () => textContent,
      },
    };
  },
};

module.exports = { model, chatSession };
