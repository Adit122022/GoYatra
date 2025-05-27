const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.error("Could not connect to MongoDB:", err));
};

module.exports = connect;
