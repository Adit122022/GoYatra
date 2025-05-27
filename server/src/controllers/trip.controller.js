const mongoose = require("mongoose");
const tripModel = require("../models/trip.model");
const userModel = require("../models/user.model");
const { chatSession } = require("../utils/AIModal"); // your AI integration
const { AI_PROMPT } = require("../utils/options");

const { fetchPlacePhoto } = require("../utils/fetchPlacePhoto"); // your helper function






module.exports.createTrip = async (req, res) => {
  try {
    const { destination, days, budget, travelGroup } = req.body;
    const userId = req.user._id;

    if (!destination || !days || !budget || !travelGroup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (parseInt(days, 10) > 7) {
      return res.status(400).json({ message: "Max 7 days allowed" });
    }

    // Generate AI Response
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", destination)
      .replace("{totalDays}", days)
      .replace("{traveler}", travelGroup)
      .replace("{budget}", budget)
      .replace("{totaldays}", days);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const aiResponse = JSON.parse(result?.response?.text());

    // 🛠️ Fetch real images for each place inside AI response
    if (aiResponse?.itinerary) {
      const days = Object.keys(aiResponse.itinerary);

      for (const day of days) {
        const dayPlan = aiResponse.itinerary[day].plan;

        for (const place of dayPlan) {
          if (
            !place.placeImageUrl ||
            place.placeImageUrl.includes("dummy") ||
            place.placeImageUrl.includes("example.com")
          ) {
            const realImageUrl = await fetchPlacePhoto(place.placeName);
            if (realImageUrl) {
              place.placeImageUrl = realImageUrl;
            }
          }
        }
      }
    }

    // 🛠️ Fetch real hotel images similarly
    if (aiResponse?.hotelOptions) {
      for (const hotel of aiResponse.hotelOptions) {
        if (
          !hotel.hotelImageUrl ||
          hotel.hotelImageUrl.includes("dummy") ||
          hotel.hotelImageUrl.includes("example.com")
        ) {
          const realHotelImageUrl = await fetchPlacePhoto(hotel.hotelName);
          if (realHotelImageUrl) {
            hotel.hotelImageUrl = realHotelImageUrl;
          }
        }
      }
    }

    // Save trip to database
    const trip = await tripModel.create({
      userId,
      destination,
      days,
      budget,
      travelGroup,
      generatedPlan: aiResponse,
    });

    await userModel.findByIdAndUpdate(userId, { $push: { trips: trip._id } });

   res.status(200).json({trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate trip" });
  }
};

module.exports.getTrip = async (req, res) => {
  try {
    let { tripId } = req.params;
    const userId = req.user._id;

    tripId = tripId.replace(":", "");

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }

    const trip = await tripModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId.toString() !== userId.toString()) {
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