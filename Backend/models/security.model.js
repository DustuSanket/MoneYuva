// models/security.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const securitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    appLockEnabled: { type: Boolean, default: true },
    biometricEnabled: { type: Boolean, default: true },
    autoLockEnabled: { type: Boolean, default: true },
    hideBalanceEnabled: { type: Boolean, default: false },
    transactionAlertsEnabled: { type: Boolean, default: true },
    loginAlertsEnabled: { type: Boolean, default: true },
    paymentPinHash: { type: String }, // Store hashed PIN
  },
  { timestamps: true }
);

// Pre-save middleware to hash the payment PIN
securitySchema.pre("save", async function (next) {
  if (this.isModified("paymentPinHash")) {
    this.paymentPinHash = await bcrypt.hash(this.paymentPinHash, 10);
  }
  next();
});

const Security = mongoose.model("Security", securitySchema);

module.exports = Security;
