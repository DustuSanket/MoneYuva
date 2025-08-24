// routes/notifications.routes.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");

// GET all active notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
      archived: false,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to mark all notifications as read
router.post("/mark-all-read/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to archive a single notification
router.post("/archive/:notificationId", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { $set: { archived: true, read: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res.status(200).json({ message: "Notification archived.", notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a single notification
router.delete("/:notificationId", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(
      req.params.notificationId
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res.status(200).json({ message: "Notification deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/archived/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
      archived: true,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
