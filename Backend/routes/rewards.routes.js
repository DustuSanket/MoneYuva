// routes/rewards.routes.js
const express = require("express");
const router = express.Router();
const Rewards = require("../models/rewards.model");
const Wallet = require("../models/wallet.model");

// GET a user's rewards data
router.get("/:userId", async (req, res) => {
  try {
    const rewardsData = await Rewards.findOne({ userId: req.params.userId });
    if (!rewardsData) {
      return res.status(404).json({ message: "Rewards data not found." });
    }
    res.json(rewardsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to claim a reward
router.post("/claim/:userId", async (req, res) => {
  try {
    // Logic to deduct points and add reward to wallet
    const rewardsData = await Rewards.findOne({ userId: req.params.userId });
    const wallet = await Wallet.findOne({ userId: req.params.userId });

    // ... (Your claim logic here) ...

    res.status(200).json({ message: "Reward claimed successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
