const mongoose = require("mongoose");
const tripModel = require("../models/trip.model");
const userModel = require("../models/user.model");
const { chatSession, model } = require("../utils/AIModal");
const { AI_PROMPT } = require("../utils/options");
const { Clerk } = require('@clerk/clerk-sdk-node');
const { fetchPlacePhoto } = require("../utils/fetchPlacePhoto");

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const findOrCreateUser = async (clerkId) => {
  let user = await userModel.findOne({ clerkId });

  if (!user) {
    console.log("User not found in DB. Creating new user...");
    const clerkUser = await clerk.users.getUser(clerkId);
    if (!clerkUser) {
      throw new Error("Failed to fetch user details from Clerk.");
    }
    const email = clerkUser.emailAddresses[0].emailAddress;
    const username = clerkUser.username || email.split('@')[0];

    user = await userModel.create({
      clerkId,
      username,
      email,
    });
    console.log("New user created:", user.email);
  } else {
    console.log("User found in DB:", user.email);
  }
  return user;
};

// Normalize AI generated response structure to guarantee expected UI format
const normalizePlan = (aiResponse) => {
  if (!aiResponse || typeof aiResponse !== "object") return aiResponse;

  // 1. Normalize Hotel Options
  if (Array.isArray(aiResponse.hotelOptions)) {
    aiResponse.hotelOptions = aiResponse.hotelOptions.map((hotel) => ({
      hotelName: hotel.hotelName || hotel.name || "Recommended Hotel",
      hotelAddress: hotel.hotelAddress || hotel.address || hotel.location || "Address available upon booking",
      price: hotel.price || hotel.pricePerNight || hotel.cost || "Contact for pricing",
      hotelImageUrl: hotel.hotelImageUrl || hotel.imageUrl || null,
      geoCoordinates: hotel.geoCoordinates || hotel.coordinates || { latitude: 0, longitude: 0 },
      rating: hotel.rating || 4.5,
      description: hotel.description || hotel.details || "A top recommended hotel for your trip.",
    }));
  }

  // 2. Normalize Itinerary if returned as Array instead of Object/Map
  if (Array.isArray(aiResponse.itinerary)) {
    const itineraryObj = {};
    aiResponse.itinerary.forEach((dayData, index) => {
      const dayKey = `day${dayData.day || index + 1}`;
      const rawPlaces = dayData.plan || dayData.schedule || dayData.activities || dayData.places || [];
      
      const normalizedPlaces = Array.isArray(rawPlaces) ? rawPlaces.map((place) => ({
        placeName: place.placeName || place.name || "Attraction",
        placeDetails: place.placeDetails || place.details || place.description || "Popular destination",
        placeImageUrl: place.placeImageUrl || place.imageUrl || null,
        geoCoordinates: place.geoCoordinates || place.coordinates || { latitude: 0, longitude: 0 },
        ticketPricing: place.ticketPricing || place.ticketPrice || place.price || "Free / Varies",
        rating: place.rating || 4.5,
        timeTravel: place.timeTravel || place.duration || place.time || "1 - 2 hours",
      })) : [];

      itineraryObj[dayKey] = {
        theme: dayData.theme || `Day ${index + 1} Exploration`,
        bestTimeToVisit: dayData.bestTimeToVisit || "Morning to Evening",
        plan: normalizedPlaces,
      };
    });
    aiResponse.itinerary = itineraryObj;
  } else if (aiResponse.itinerary && typeof aiResponse.itinerary === "object") {
    // Ensure nested day plans have normalized places
    Object.keys(aiResponse.itinerary).forEach((dayKey) => {
      const dayData = aiResponse.itinerary[dayKey];
      if (dayData && typeof dayData === "object") {
        const rawPlaces = dayData.plan || dayData.schedule || dayData.activities || dayData.places || [];
        dayData.plan = Array.isArray(rawPlaces) ? rawPlaces.map((place) => ({
          placeName: place.placeName || place.name || "Attraction",
          placeDetails: place.placeDetails || place.details || place.description || "Popular destination",
          placeImageUrl: place.placeImageUrl || place.imageUrl || null,
          geoCoordinates: place.geoCoordinates || place.coordinates || { latitude: 0, longitude: 0 },
          ticketPricing: place.ticketPricing || place.ticketPrice || place.price || "Free / Varies",
          rating: place.rating || 4.5,
          timeTravel: place.timeTravel || place.duration || place.time || "1 - 2 hours",
        })) : [];
      }
    });
  }

  return aiResponse;
};

const safeFetchPhotos = async (aiResponse) => {
  if (!aiResponse) return;

  try {
    if (aiResponse.itinerary && typeof aiResponse.itinerary === "object") {
      for (const day of Object.values(aiResponse.itinerary)) {
        if (!day || !Array.isArray(day.plan)) continue;
        for (const place of day.plan) {
          if (place && place.placeName) {
            place.placeImageUrl = await fetchPlacePhoto(place.placeName);
          }
        }
      }
    }

    if (Array.isArray(aiResponse.hotelOptions)) {
      for (const hotel of aiResponse.hotelOptions) {
        if (hotel && hotel.hotelName) {
          hotel.hotelImageUrl = await fetchPlacePhoto(hotel.hotelName);
        }
      }
    }
  } catch (err) {
    console.error("Error fetching photos for trip plan:", err);
  }
};

module.exports.createTrip = async (req, res) => {
  console.log("\n--- [CREATE TRIP START] ---");
  try {
    const { destination, days, budget, travelGroup } = req.body;
    const clerkId = req.auth.userId;

    if (!destination || !days || !budget || !travelGroup) {
      console.error("Error: Missing required fields.");
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await findOrCreateUser(clerkId);

    const FINAL_PROMPT = AI_PROMPT.replace(/\{location\}/g, destination)
      .replace(/\{totalDays\}/g, days)
      .replace(/\{traveler\}/g, travelGroup)
      .replace(/\{budget\}/g, budget);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const rawResponse = result?.response?.text();
    const cleanedResponse = rawResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    let aiResponse = JSON.parse(cleanedResponse);

    // Normalize AI structure & fetch images
    aiResponse = normalizePlan(aiResponse);
    await safeFetchPhotos(aiResponse);

    const trip = await tripModel.create({
      userId: user._id,
      destination,
      days,
      budget,
      travelGroup,
      generatedPlan: aiResponse,
    });

    await userModel.findByIdAndUpdate(user._id, { $push: { trips: trip._id } });

    console.log("--- [CREATE TRIP SUCCESS] ---\n");
    res.status(200).json({ trip });

  } catch (error) {
    console.error("--- [CREATE TRIP FAILED] ---", error);
    res.status(500).json({ message: `Failed to generate trip: ${error.message}` });
  }
};

module.exports.streamTrip = async (req, res) => {
  console.log("\n--- [STREAM TRIP START] ---");
  try {
    const { destination, days, budget, travelGroup } = req.body;
    const clerkId = req.auth.userId;

    if (!destination || !days || !budget || !travelGroup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await findOrCreateUser(clerkId);

    const FINAL_PROMPT = AI_PROMPT.replace(/\{location\}/g, destination)
      .replace(/\{totalDays\}/g, days)
      .replace(/\{traveler\}/g, travelGroup)
      .replace(/\{budget\}/g, budget);

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders && res.flushHeaders();

    const stream = await model.stream(FINAL_PROMPT);
    let fullText = "";

    for await (const chunk of stream) {
      const textChunk = typeof chunk.content === "string" 
        ? chunk.content 
        : Array.isArray(chunk.content) 
          ? chunk.content.map(c => typeof c === "string" ? c : c.text || "").join("") 
          : "";
          
      fullText += textChunk;
      // Send chunk event
      res.write(`data: ${JSON.stringify({ chunk: textChunk })}\n\n`);
    }

    const cleanedResponse = fullText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanedResponse);
    } catch (parseErr) {
      console.error("JSON parse error on streamed response:", parseErr);
      res.write(`data: ${JSON.stringify({ error: "Failed to parse generated AI trip response." })}\n\n`);
      return res.end();
    }

    // Normalize AI structure & fetch images
    aiResponse = normalizePlan(aiResponse);
    await safeFetchPhotos(aiResponse);

    const trip = await tripModel.create({
      userId: user._id,
      destination,
      days,
      budget,
      travelGroup,
      generatedPlan: aiResponse,
    });

    await userModel.findByIdAndUpdate(user._id, { $push: { trips: trip._id } });

    console.log("--- [STREAM TRIP SUCCESS] ---\n");
    res.write(`data: ${JSON.stringify({ done: true, tripId: trip._id, trip })}\n\n`);
    res.end();
  } catch (error) {
    console.error("--- [STREAM TRIP FAILED] ---", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

module.exports.getTrip = async (req, res) => {
  try {
    let { tripId } = req.params;
    const clerkId = req.auth.userId;
    tripId = tripId.replace(":", "");

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }

    const trip = await tripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const user = await userModel.findOne({ clerkId });
    if (!user || trip.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to view this trip" });
    }

    return res.status(200).json({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trip details" });
  }
};

module.exports.getTripHistory = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await findOrCreateUser(clerkId);

    const trips = await tripModel.find({ userId: user._id });

    return res.status(200).json({ trips });
  } catch (error) {
    console.error("Error in getTripHistory:", error);
    res.status(500).json({ message: "Failed to fetch trip history" });
  }
};

module.exports.deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const clerkId = req.auth.userId;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }

    const trip = await tripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const user = await userModel.findOne({ clerkId });
    if (!user || trip.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this trip" });
    }

    await tripModel.findByIdAndDelete(tripId);
    await userModel.findByIdAndUpdate(user._id, { $pull: { trips: tripId } });

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
};