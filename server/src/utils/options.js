module.exports.AI_PROMPT = `Generate a detailed Travel Plan for Location: {location}, for {totalDays} Days, for {traveler} with a {budget} budget.

IMPORTANT: Return ONLY valid JSON matching this exact structure (no markdown fences, pure JSON):
{
  "tripDetails": {
    "location": "{location}",
    "duration": "{totalDays} Days",
    "travelers": "{traveler}",
    "budget": "{budget}"
  },
  "hotelOptions": [
    {
      "hotelName": "Hotel Name",
      "hotelAddress": "Full Hotel Street Address, City",
      "price": "$XX per night",
      "hotelImageUrl": "",
      "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
      "rating": 4.5,
      "description": "Short hotel description"
    }
  ],
  "itinerary": {
    "day1": {
      "theme": "Theme of Day 1",
      "bestTimeToVisit": "Morning / Afternoon / Evening",
      "plan": [
        {
          "placeName": "Place Name",
          "placeDetails": "Details about place",
          "placeImageUrl": "",
          "geoCoordinates": { "latitude": 0.0, "longitude": 0.0 },
          "ticketPricing": "$XX or Free",
          "rating": 4.5,
          "timeTravel": "1 to 2 hours"
        }
      ]
    }
  }
}`;
