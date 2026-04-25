const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const notificationRoutes = require("./routes/notificationRoutes");
const authenticationRouter = require("./routes/authentication.routes");
const usersRouter = require("./routes/users.routes");
const productRouter = require("./routes/products.routes");
const categoryRouter = require("./routes/category.routes");
const orderRouter = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!dbUri) {
  console.error("Critical Error: MONGODB_URI not found in .env file");
  process.exit(1);
}

mongoose
  .connect(dbUri)
  .then(async () => {
    console.log("Connected to MongoDB");
    // Drop old username index that doesn't have sparse:true — run once then auto-ignored
    await mongoose.connection.collection("users").dropIndex("username_1").catch(() => {});
  })
  .catch((err) => console.error("DB Connection Error:", err));

// Routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authenticationRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    data: null,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
