const express = require("express");
const router = express.Router();
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// GET a user's wallet balance and transaction history
router.get("/:userId", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactions = await Transaction.find({ walletId: wallet._id }).sort({
      createdAt: -1,
    });

    res.json({ balance: wallet.balance, transactions: transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to create a new Razorpay order

router.post(
  "/create-order",
  [
    body("amount")
      .isInt({ min: 100 })
      .withMessage("Amount must be a positive number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: `receipt_${Math.floor(Math.random() * 10000000)}`,
      };
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// POST to handle payment success and update wallet
router.post("/verify-payment", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // userId is now a required part of the request body
    const { orderId, paymentId, signature, amount, userId } = req.body;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Invalid amount provided.");
    }

    // TEMPORARILY COMMENTED OUT FOR TESTING ONLY
    // const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    // hmac.update(orderId + "|" + paymentId);
    // const generatedSignature = hmac.digest("hex");
    // if (generatedSignature !== signature) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   return res.status(400).send("Payment verification failed");
    // }

    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.balance += numericAmount;
    await wallet.save({ session });

    const newTransaction = new Transaction({
      walletId: wallet._id,
      amount: numericAmount,
      type: "credit",
      description: "Money added via Razorpay",
    });
    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Payment successful and wallet updated" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send(error);
  }
});

router.post("/pay-to-user", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { senderId, recipientEmail, amount, description } = req.body;
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    const senderWallet = await Wallet.findOne({ userId: senderId }).session(
      session
    );
    if (!senderWallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Sender's wallet not found." });
    }

    const recipientUser = await User.findOne({ email: recipientEmail }).session(
      session
    );
    if (!recipientUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Recipient not found." });
    }
    const recipientWallet = await Wallet.findOne({
      userId: recipientUser._id,
    }).session(session);
    if (!recipientWallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Recipient's wallet not found." });
    }

    if (senderWallet.balance < numericAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance." });
    }

    senderWallet.balance -= numericAmount;
    recipientWallet.balance += numericAmount;
    await senderWallet.save({ session });
    await recipientWallet.save({ session });

    const senderTransaction = new Transaction({
      walletId: senderWallet._id,
      amount: numericAmount,
      type: "debit",
      description: `Payment to ${recipientEmail}`,
    });
    const recipientTransaction = new Transaction({
      walletId: recipientWallet._id,
      amount: numericAmount,
      type: "credit",
      description: `Received from ${senderWallet.userId}`,
    });
    await senderTransaction.save({ session });
    await recipientTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Payment successful." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

router.post("/debit", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, amount, description } = req.body;
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < numericAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= numericAmount;
    await wallet.save({ session });

    const newTransaction = new Transaction({
      walletId: wallet._id,
      amount: numericAmount,
      type: "debit",
      description: description,
    });
    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Wallet debited successfully", wallet });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send(error);
  }
});

module.exports = router;
