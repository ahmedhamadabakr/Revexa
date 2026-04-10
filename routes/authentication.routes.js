const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/authentications.controller");
const mustBeLoggedIn = require("../middlewares/must-be-logged");

const authenticationRouter = express.Router();

// Authentication routes
authenticationRouter.post("/register", register);
authenticationRouter.post("/login", login);
authenticationRouter.post("/logout", mustBeLoggedIn, logout);

module.exports = authenticationRouter;
