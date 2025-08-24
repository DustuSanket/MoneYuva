// routes/goals.routes.js
const express = require("express");
const router = express.Router();
const Goal = require("../models/goal.model");

// GET all goals for a user
router.get("/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to create a new goal
router.post("/", async (req, res) => {
  try {
    const { userId, name, targetAmount, category, targetDate } = req.body;
    const newGoal = new Goal({
      userId,
      name,
      targetAmount,
      category,
      targetDate,
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to add funds to a goal
router.post("/add-funds/:goalId", async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    goal.currentAmount += parseFloat(amount);
    await goal.save();
    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a goal
router.delete("/:goalId", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.goalId);
    res.status(200).json({ message: "Goal deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
