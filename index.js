
require("dotenv").config(); 

const express = require("express");
const morgan = require("morgan");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authenticationRouter = require("./routes/authentication.routes");
const usersRouter = require("./routes/users.routes");

// Mount routes
app.use("/api/auth", authenticationRouter); 
app.use("/api/users", usersRouter);      

// Home Routes
app.get("/", (req, res) => {
  res.send("Welcome to Revexa API");
});



if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");

    app.listen(port, () => {
      console.log(`Server is running on: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(" Database connection error:", error.message);
    process.exit(1);
  }
};

startServer();