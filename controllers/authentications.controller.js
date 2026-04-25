const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { z } = require("zod");

const { registerSchema } = require("../requests/authentication/regester.Schema");
const { loginSchema } = require("../requests/authentication/login.Schema");
const User = require("../models/user.model");
const saltRounds = 10;

const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const hashPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashPassword,
      gender: data.gender,
      address: data.address,
      age: data.age,
      phone: data.phone,
      role: "user", // role is always "user" on registration — never trust client
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({
      message: error.message,
      errors: error.errorResponse?.errmsg,
    });
  }
};

const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password", data: false });
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password", data: false });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: "7d" }
    );

    user.refreshToken = token;

    // Clear FCM token from any other user to prevent notification overlap
    if (data.fcmToken) {
      await User.updateMany({ fcmToken: data.fcmToken, _id: { $ne: user._id } }, { $set: { fcmToken: null } });
      user.fcmToken = data.fcmToken;
    }

    await user.save();

    res.json({
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null, fcmToken: null });
    res.json({ message: "User logged out successfully", data: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const emailSchema = z.object({ email: z.string().email() });
    const { email } = emailSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: "Revexa Support <support@revexa.com>",
      to: user.email,
      subject: "Password Reset Request",
      text: `Use this link to reset your password (valid for 10 minutes):\n\n${resetURL}`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const passSchema = z.object({
      password: z.string().min(6, "Password must be at least 6 characters"),
    });
    const { password } = passSchema.parse(req.body);

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, saltRounds);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Password reset successful", token });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, logout, forgotPassword, resetPassword };
