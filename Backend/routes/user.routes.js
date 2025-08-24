const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Budget = require("../models/budget.model"); // <-- Added this
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { sendOTP } = require("../config/emailServices");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// GET user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update a user's profile
router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phoneNo, profilePhoto, password } = req.body;

    if (name) user.name = name;
    if (email && email !== user.email) {
      // Prevent duplicate email
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }
    if (phoneNo) user.phoneNo = phoneNo;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res
      .status(200)
      .json({ message: "Account verified successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to register a new user
router.post("/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phoneNo, profilePhoto } = req.body;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword, // <-- hashed password
      phoneNo,
      profilePhoto,
      otp: hashedOtp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    const newUser = await user.save();

    // Ensure wallet is created for new user (avoid duplicate)
    let wallet = await Wallet.findOne({ userId: newUser._id });
    if (!wallet) {
      wallet = new Wallet({ userId: newUser._id });
      await wallet.save();
    }

    // Create a new budget with default categories for the new user (avoid duplicate)
    let budget = await Budget.findOne({ userId: newUser._id });
    if (!budget) {
      const defaultCategories = [
        { name: "Food & Mess", allocated: 0 },
        { name: "Transport", allocated: 0 },
        { name: "Shopping", allocated: 0 },
        { name: "Entertainment", allocated: 0 },
      ];
      budget = new Budget({
        userId: newUser._id,
        monthlyBudget: 0,
        categories: defaultCategories,
      });
      await budget.save();
    }

    sendOTP(email, otp);

    res.status(201).json({
      message:
        "User registered successfully. An OTP has been sent to your email.",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// POST to log in a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Account is not verified. Please check your email for the OTP.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Only send minimal user info, never send OTP or password
    res.json({
      message: "Login successful.",
      token,
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
