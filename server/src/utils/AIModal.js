const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const MODEL = "gemini-2.0-flash-lite";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const INITIAL_HISTORY = [
  {
    role: "user",
    parts: [
      {
        text: "Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: '{\n  "tripDetails": {\n    "location": "Las Vegas",\n    "duration": "3 Days",\n    "travelers": "Couple",\n    "budget": "Cheap"\n  },\n  "hotelOptions": [],\n  "itinerary": {}\n}',
      },
    ],
  },
];

// chatSession is an object with a sendMessage method compatible with the old interface
const chatSession = {
  sendMessage: async (message) => {
    const chat = ai.chats.create({
      model: MODEL,
      config: generationConfig,
      history: INITIAL_HISTORY,
    });
    const result = await chat.sendMessage({ message });
    return {
      response: {
        text: () => result.text,
      },
    };
  },
};

module.exports = { chatSession };
