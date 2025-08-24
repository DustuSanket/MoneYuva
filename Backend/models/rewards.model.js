const mongoose = require("mongoose");

const rewardsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    totalPoints: { type: Number, default: 0 },
    pointsEarnedThisMonth: { type: Number, default: 0 },
    recentEarnings: [
      {
        title: { type: String, required: true },
        points: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Rewards = mongoose.model("Rewards", rewardsSchema);

module.exports = Rewards;
