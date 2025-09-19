const mongoose = require("mongoose");

// Define sub-schemas for nested objects to provide structure and validation
const GeoCoordinatesSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const HotelOptionSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  hotelAddress: { type: String, required: true },
  price: { type: String, required: true },
  hotelImageUrl: { type: String, default: null },
  geoCoordinates: { type: GeoCoordinatesSchema, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
});

const ItineraryPlaceSchema = new mongoose.Schema({
  placeName: { type: String, required: true },
  placeDetails: { type: String, required: true },
  placeImageUrl: { type: String, default: null },
  geoCoordinates: { type: GeoCoordinatesSchema, required: true },
  ticketPricing: { type: String, required: true },
  rating: { type: Number, required: true },
  timeTravel: { type: String, required: true },
});

const DayPlanSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  bestTimeToVisit: { type: String, required: true },
  plan: [ItineraryPlaceSchema], // Array of places to visit
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      max: 7, // Limit to 7 days
    },
    budget: {
      type: String,
      enum: ["cheap", "moderate", "luxary"],
      required: true,
    },
    travelGroup: {
      type: String,
      enum: ["just_me", "couple", "friends", "family"],
      required: true,
    },

    // Detailed structure for the AI-generated plan
    generatedPlan: {
      tripDetails: {
        location: String,
        duration: String,
        travelers: String,
        budget: String,
      },
      hotelOptions: [HotelOptionSchema], // Array of hotels
      itinerary: { type: Map, of: DayPlanSchema }, // Flexible for Day 1, Day 2 etc.
    },
  },
  { timestamps: true }
);

const tripModel = mongoose.model("Trip", tripSchema);

module.exports = tripModel;
