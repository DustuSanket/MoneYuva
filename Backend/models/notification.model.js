// models/notification.model.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["system", "reward", "goal", "transaction", "tip"],
      default: "system",
    },
    amount: { type: Number },
    // You can add more fields like links, timestamps, etc.
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
