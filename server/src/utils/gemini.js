const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure the API key is available
if (!process.env.GOOGLE_API_KEY) {
  console.error(
    "Error: GOOGLE_API_KEY is not set in the environment variables."
  );
  throw new Error("Missing GOOGLE_API_KEY");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function chatWithGemini(message) {
  try {
    if (!message || typeof message !== "string") {
      throw new Error("Invalid input message. It must be a non-empty string.");
    }

    // Obtain the model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Structure the prompt correctly
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    // Access the response text
    const responseText = result.response.candidates[0].content.parts[0].text;

    return responseText;
  } catch (error) {
    console.error("Gemini error:", error.message || error);const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure the API key is available
if (!process.env.GOOGLE_API_KEY) {
  console.error("Error: GOOGLE_API_KEY is not set in the environment variables.");
  throw new Error("Missing GOOGLE_API_KEY");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Use Gemini 2.0 model
const GEMINI_MODEL = "gemini-2.0-pro";

/**
 * Chat with Gemini 2.0 as a travel planner
 * @param {string} message - The user's query
 * @returns {Promise<string>} - The chatbot's response
 */
async function chatWithGemini(message) {
  try {
    if (!message || typeof message !== "string" || !message.trim()) {
      throw new Error("Invalid input message. It must be a non-empty string.");
    }

    // Get the Gemini 2.0 model
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Structure the prompt with system context
    const prompt = [
      {
        role: "user",
        parts: [
          {
            text: `
You're an AI called "GoYatra", an expert travel planner.
Your job is to help users plan personalized trips by suggesting destinations, estimating budgets, offering weather and visa tips, and recommending unique experiences.

Be concise, friendly, and proactive with follow-up questions like:
- What's your travel budget?
- Are you traveling solo or with someone?
- Do you prefer nature, history, or nightlife?
- Any specific countries or dates in mind?

Now respond to the user’s query:
${message}
            `.trim(),
          },
        ],
      },
    ];

    // Generate the response
    const result = await model.generateContent({ contents: prompt });

    // Extract the response text
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    return responseText || "I'm here to help with your travel plans! Can you clarify your request?";
  } catch (error) {
    console.error("Gemini error:", error.message || error);
    return "Sorry, I'm unable to respond right now. Please try again later.";
  }
}

module.exports = chatWithGemini;

    return "Sorry, I'm unable to respond right now.";
  }
}

module.exports = chatWithGemini;