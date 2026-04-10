const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

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
      phone: data.phone,
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtConfig.secret,
      { expiresIn: "7d" }
    );
    console.log("Token generated successfully");

    res.cookie("token", token, { httpOnly: true, secure: false });

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

const logout = (req, res) => {
  try {
    res.clearCookie("token");
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

module.exports = {
  register,
  login,
  logout,
};
