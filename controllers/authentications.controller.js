const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { z } = require("zod");

const {
  registerSchema,
} = require("../requests/authentication/regester.Schema");
const { loginSchema } = require("../requests/authentication/login.Schema");
const User = require("../models/user.model");
const saltRounds = 10;

const register = async (req, res) => {
  try {
    const data = req.body;
    registerSchema.parse(data); // validate the request body
    const hashPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashPassword,
      gender: data.gender,
      address: data.address,
      age: data.age,
      role: data.role || "user",
      phone: data.phone,
    });

    // Generate token with role
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
    res.status(500).json({
      message: error.message,
      errors: error.errors || error.errorResponse?.errmsg,
    });
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    console.log("Login attempt with data:", { email: data.email });

    loginSchema.parse(data);

    const user = await User.findOne({ email: data.email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        data: false,
      });
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        data: false,
      });
    }

    // نحتفظ بـ Access Token في الـ Payload لسهولة الوصول للـ Role في الـ Middleware
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: "7d" }
    );

    user.refreshToken = token;

    // تخزين FCM Token باحترافية: مسحه من أي مستخدم آخر أولاً لمنع تداخل الإشعارات
    if (data.fcmToken) {
      await User.updateMany({ fcmToken: data.fcmToken }, { $set: { fcmToken: null } });
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
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: error.message,
      errors: error.errors,
    });
  }
};

const logout = async (req, res) => {
  try {
    // مسح التوكن من قاعدة البيانات عند تسجيل الخروج
    // احترافياً: نمسح الـ fcmToken أيضاً لمنع وصول إشعارات لمستخدم خرج من حسابه
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null, fcmToken: null });
    
    res.json({
      message: "User logged out successfully",
      data: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      errors: error.errors,
    });
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    // التحقق من صحة الإيميل باستخدام Zod
    const emailSchema = z.object({ email: z.string().email() });
    const { email } = emailSchema.parse(req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    // 1. Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash it and save to DB (for security)
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

    await user.save({ validateBeforeSave: false });

    // 3. Send via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // إيميلك
        pass: process.env.EMAIL_PASS, // كود الـ App Password
      },
    });

    const resetURL = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: "Revexa Support <support@revexa.com>",
      to: user.email,
      subject: "Password Reset Request",
      text: `Your reset token is: ${resetToken}\nOr use this link: ${resetURL}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Token sent to email!" });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    // التحقق من صحة كلمة المرور الجديدة
    const passSchema = z.object({ 
      password: z.string().min(6, "Password must be at least 6 characters") 
    });
    const { password } = passSchema.parse(req.body);

    // 1. Get user based on the hashed token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    // 2. Set new password and hash it
    user.password = await bcrypt.hash(password, saltRounds);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3. Log user in (generate token)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Password reset successful",
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
