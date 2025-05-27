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
    console.error("Gemini error:", error.message || error);
    return "Sorry, I'm unable to respond right now.";
  }
}

module.exports = chatWithGemini;