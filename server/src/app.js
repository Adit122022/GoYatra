
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const { customAuthMiddleware } = require("./middleware/auth.middleware.js");

dotenv.config({ path: "./.env" });

const userRoutes = require("./routes/user.routes.js");
const tripPlanRoutes = require("./routes/tripPlanRoutes.js");

const allowedOrigins = [
  process.env.CORS_URI,
  "http://localhost:5173",
  "https://go-yatra.vercel.app",
  "https://5173-firebase-goyatragit-1757951790422.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev",
  "https://go-yatra-git-main-team-async.vercel.app",
  "https://go-yatra-326j5mmle-team-async.vercel.app",

];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow Authorization header
};

// Use CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests across all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply authentication middleware to all protected routes
app.use("/api/user", customAuthMiddleware, userRoutes);
app.use("/api/tripplan", customAuthMiddleware, tripPlanRoutes);

module.exports = app;
