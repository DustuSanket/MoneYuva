const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [4, "pasword must be at least of 4 characters"],
  },
  phoneNo: {
    type: Number,
    minlength: [10, "incorrect phone no."],
    trim: true,
  },
});

const walletSchema = new mongoose.Schema({
  walletBalance: {
    type: Number,
    required: true,
    default: 0,
  },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
