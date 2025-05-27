const dotenv = require("dotenv");
dotenv.config();
const app = require('./src/app')
const http = require("http");
const server = http.createServer(app);

const connct = require("./src/db/db");


const socketIo = require("socket.io");

const jwt = require("jsonwebtoken"); // JWT for token verification



connct();

// server.js

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Authenticate socket connections using JWT
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("Connection rejected: No token provided");
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.user?.name || "Unknown User"); // Access the authenticated user

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    console.log("Message received: ", msg);
    io.emit("chat message", msg); // Broadcast the message to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
