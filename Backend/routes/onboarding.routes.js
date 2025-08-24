const express = require("express");
const router = express.Router();
const Goal = require("../models/goal.model");
const Budget = require("../models/budget.model");
const mongoose = require("mongoose");

// POST to save a savings goal
router.post("/goals", async (req, res) => {
  try {
    const { userId, name, targetAmount, targetDate } = req.body;
    const newGoal = new Goal({ userId, name, targetAmount, targetDate });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all goals for a user
router.get("/goals/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to save the monthly budget and categories
router.post("/budget", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, monthlyBudget, categories } = req.body;
    const newBudget = new Budget({ userId, monthlyBudget, categories });
    await newBudget.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newBudget);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
});

// GET a user's budget and categories
router.get("/budget/:userId", async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.params.userId });
    if (!budget) {
      return res
        .status(404)
        .json({ message: "Budget not found for this user." });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update an existing budget
router.put("/budget/:userId", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { monthlyBudget, categories } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.params.userId },
      { monthlyBudget, categories },
      { new: true }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(budget);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
