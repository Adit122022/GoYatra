const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/user.routes.js");
const tripPlanRoutes = require("./routes/tripPlanRoutes.js");

app.use(
  cors({
    origin: "http://localhost:5173", // Add all allowed frontend origins here
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/tripplan", tripPlanRoutes);

module.exports = app;
