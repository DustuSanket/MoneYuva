// routes/security.routes.js
const express = require("express");
const router = express.Router();
const Security = require("../models/security.model");
const bcrypt = require("bcrypt");

// GET a user's security settings
router.get("/:userId", async (req, res) => {
  try {
    const securitySettings = await Security.findOne({
      userId: req.params.userId,
    });
    if (!securitySettings) {
      return res.status(404).json({ message: "Security settings not found." });
    }
    res.json(securitySettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to update security settings
router.put("/:userId", async (req, res) => {
  try {
    const {
      appLockEnabled,
      biometricEnabled,
      autoLockEnabled,
      hideBalanceEnabled,
      transactionAlertsEnabled,
      loginAlertsEnabled,
    } = req.body;
    const securitySettings = await Security.findOneAndUpdate(
      { userId: req.params.userId },
      {
        appLockEnabled,
        biometricEnabled,
        autoLockEnabled,
        hideBalanceEnabled,
        transactionAlertsEnabled,
        loginAlertsEnabled,
      },
      { new: true, upsert: true }
    );
    res.json(securitySettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to change payment PIN
router.post("/change-pin/:userId", async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;
    const securitySettings = await Security.findOne({
      userId: req.params.userId,
    });
    if (!securitySettings) {
      return res.status(404).json({ message: "Security settings not found." });
    }

    const isMatch = await bcrypt.compare(
      currentPin,
      securitySettings.paymentPinHash
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current PIN." });
    }

    securitySettings.paymentPinHash = newPin; // The pre-save hook will hash this
    await securitySettings.save();

    res.json({ message: "Payment PIN updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
