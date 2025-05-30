const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure the API key is available
if (!process.env.GOOGLE_API_KEY) {
  console.error("Error: GOOGLE_API_KEY is not set in the environment variables.");
  throw new Error("Missing GOOGLE_API_KEY");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Use the correct model
const GEMINI_MODEL = "gemini-1.5-flash";


/**
 * Chat with Gemini as GoYatra's travel support assistant
 * @param {string} message - The user's query
 * @returns {Promise<string>} - The chatbot's response
 */
async function chatWithGemini(message) {
  try {
    if (!message || typeof message !== "string" || !message.trim()) {
      throw new Error("Invalid input message. It must be a non-empty string.");
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // System instructions with custom GoYatra details
    const prompt = [
      {
        role: "user",
        parts: [
          {
            text: `
You are "GoYatra Assistant", a helpful and friendly **customer support AI agent** for our travel website **GoYatra**.

Your job is to assist users with:
- Booking issues (flights, hotels, packages)
- Payment problems or refunds
- Account and profile support
- Cancellation or rescheduling
- General travel help related to our services

✅ Here's what you should **know about GoYatra**:
- Flight booking is currently **under development**, so kindly inform users that it's not available yet.
- Hotel and package bookings are available.
- Weather details are included in the **Itinerary** section. If users ask about weather, guide them to check their itinerary.
- To **reset passwords**, users must contact the developer via **support@goyatra.com**.
- Refunds may take **5–7 business days** to process depending on the payment provider.
- Users can view and manage bookings in their **profile section**.

❗ If a user asks something unrelated to travel or customer support (e.g., jokes, astrology, programming help, etc.), reply:
**"I'm your travel support assistant! Feel free to ask me anything related to bookings, payments, cancellations, or travel help."**

Always be polite, clear, and empathetic. Sound human and supportive in your tone.

Now respond to the user’s query:
"${message}"
          `.trim(),
          },
        ],
      },
    ];

    const result = await model.generateContent({ contents: prompt });

    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    return responseText || "I'm here to help with your travel plans! Can you clarify your request?";
  } catch (error) {
    console.error("Gemini error:", error.message || error);
    return "Sorry, I'm unable to respond right now. Please try again later.";
  }
}

module.exports = chatWithGemini;
