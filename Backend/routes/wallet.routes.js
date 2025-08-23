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
        receipt: `receipt_order_${Math.random()}`,
      };
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.post("/verify-payment", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId, paymentId, signature, amount, userId } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== signature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Payment verification failed");
    }

    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.balance += amount;
    await wallet.save({ session });

    const newTransaction = new Transaction({
      walletId: wallet._id,
      amount: amount,
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

module.exports = router;
