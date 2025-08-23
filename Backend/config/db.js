const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => console.error("Could not connect to MongoDB...", err));
}

module.exports = connectDB;
