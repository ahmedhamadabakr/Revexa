const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  username: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  fcmToken: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
  },
  role: {
    type: String,
    enum: ["user", "company", "admin"],
    default: "user",
  },
  address: {
    type: String,
    minlength: 3,
    maxlength: 500,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  created_at: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
