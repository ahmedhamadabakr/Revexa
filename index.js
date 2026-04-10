require("dotenv").config(); 
const express = require("express");
const morgan = require("morgan");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000; 

// 1. إنشاء دالة للاتصال بقاعدة البيانات (Singleton Pattern)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
  }
};

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Middleware للاتصال بالقاعدة قبل معالجة أي طلب (مهم لـ Vercel)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
const authenticationRouter = require("./routes/authentication.routes");
const usersRouter = require("./routes/users.routes");

app.use("/api/auth", authenticationRouter); 
app.use("/api/users", usersRouter);      

app.get("/", (req, res) => {
  res.send("Welcome to Revexa API");
});

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

// 3. تشغيل السيرفر محلياً فقط (Local Development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(` Server running locally on: http://localhost:${port}`);
  });
}

module.exports = app;