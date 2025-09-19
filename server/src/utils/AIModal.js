const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

module.exports.chatSession = model.startChat({
  generationConfig,
  history: [
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
          text: '{\n  "tripDetails": {\n    "location": "Las Vegas",\n    "duration": "3 Days",\n    "travelers": "Couple",\n    "budget": "Cheap"\n  },\n  "hotelOptions": [\n    {\n      "hotelName": "Circus Circus Hotel & Casino",\n      "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",\n      "price": "$40 - $80 per night",\n      "hotelImageUrl": "https://example.com/circuscircus.jpg",\n      "geoCoordinates": {\n        "latitude": 36.1348,\n        "longitude": -115.1641\n      },\n      "rating": 3.5,\n      "description": "A budget-friendly option on the Strip with its own theme park and free circus acts. Older but offers good value."\n    },\n    {\n      "hotelName": "Excalibur Hotel & Casino",\n      "hotelAddress": "3850 S Las Vegas Blvd, Las Vegas, NV 89109",\n      "price": "$50 - $90 per night",\n      "hotelImageUrl": "https://example.com/excalibur.jpg",\n      "geoCoordinates": {\n        "latitude": 36.0974,\n        "longitude": -115.1742\n      },\n      "rating": 3.8,\n      "description": "A castle-themed hotel on the south end of the Strip offering basic rooms, several dining options, and a pool area."\n    }\n  ],\n  "itinerary": {\n    "day1": {\n      "theme": "Exploring the Strip (South)",\n      "bestTimeToVisit": "Afternoon & Evening",\n      "plan": [\n        {\n          "placeName": "Welcome to Fabulous Las Vegas Sign",\n          "placeDetails": "Iconic sign at the south end of the Strip, perfect for a classic photo opportunity.",\n          "placeImageUrl": "https://example.com/welcomesign.jpg",\n          "geoCoordinates": {\n            "latitude": 36.0827,\n            "longitude": -115.1726\n          },\n          "ticketPricing": "Free",\n          "rating": 4.6,\n          "timeTravel": "10 mins drive from hotels"\n        }\n      ]\n    }\n  }\n}',
        },
      ],
    },
  ],
});
