const mongoose = require("mongoose");
const tripModel = require("../models/trip.model");
const userModel = require("../models/user.model");
const { chatSession } = require("../utils/AIModal");
const { AI_PROMPT } = require("../utils/options");
const { Clerk } = require('@clerk/clerk-sdk-node');
const { fetchPlacePhoto } = require("../utils/fetchPlacePhoto");

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

module.exports.createTrip = async (req, res) => {
  console.log("\n--- [CREATE TRIP START] ---");
  try {
    const { destination, days, budget, travelGroup } = req.body;
    const clerkId = req.auth.userId; // User is authenticated if we get here.

    if (!clerkId) {
        return res.status(401).json({ message: "User is not authenticated." });
    }

    console.log("Request Body:", { destination, days, budget, travelGroup });

    if (!destination || !days || !budget || !travelGroup) {
      console.error("Error: Missing required fields.");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (parseInt(days, 10) > 7) {
      console.error("Error: Max 7 days allowed.");
      return res.status(400).json({ message: "Max 7 days allowed" });
    }

    // --- The Fix: Find or Create User directly in the function ---
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
    // --- End of Fix ---

    // Generate AI Response
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", destination)
      .replace("{totalDays}", days)
      .replace("{traveler}", travelGroup)
      .replace("{budget}", budget)
      .replace("{totaldays}", days);

    console.log("Sending prompt to AI...");
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const rawResponse = result?.response?.text();

    if (!rawResponse) {
      console.error("Error: AI model returned an empty response.");
      return res.status(500).json({ message: "AI model returned an empty response." });
    }

    const cleanedResponse = rawResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error: Failed to parse AI response. JSON is malformed.");
      return res.status(500).json({ message: "AI returned a malformed plan. Could not parse." });
    }

    // Fetch real images for the plan
    console.log("Fetching images for itinerary and hotels...");
    if (aiResponse?.itinerary) {
      for (const day of Object.values(aiResponse.itinerary)) {
        for (const place of day.plan) {
          place.placeImageUrl = await fetchPlacePhoto(place.placeName);
        }
      }
    }
    if (aiResponse?.hotelOptions) {
      for (const hotel of aiResponse.hotelOptions) {
        hotel.hotelImageUrl = await fetchPlacePhoto(hotel.hotelName);
      }
    }
    console.log("Image fetching complete.");

    // Save the trip to the database
    console.log("Attempting to save trip to database...");
    const trip = await tripModel.create({
      userId: user._id,
      destination,
      days,
      budget,
      travelGroup,
      generatedPlan: aiResponse,
    });
    console.log("Successfully saved trip to database. Trip ID:", trip._id);

    await userModel.findByIdAndUpdate(user._id, { $push: { trips: trip._id } });
    console.log("Added trip reference to user.");

    console.log("--- [CREATE TRIP SUCCESS] ---\n");
    res.status(200).json({ trip });

  } catch (error) {
    console.error("--- [CREATE TRIP FAILED] ---");
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ message: `Failed to generate trip: ${error.message}` });
  }
};

// I am leaving getTrip as it was, as the findOrCreate logic is not critical here.
// If a user can get a trip, they must already exist.
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
      return res
        .status(403)
        .json({ message: "You are not authorized to view this trip" });
    }

    return res.status(200).json({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trip details" });
  }
};
