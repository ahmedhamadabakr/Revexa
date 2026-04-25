const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateFcmToken,
} = require("../controllers/users.controller");
const mustBeLoggedIn = require("../middlewares/must-be-logged");

const usersRouter = express.Router();

// get all users — admin only
usersRouter.get("/", mustBeLoggedIn, getAllUsers);

// get user by id
usersRouter.get("/:userId", mustBeLoggedIn, getUserById);

// update user
usersRouter.put("/:userId", mustBeLoggedIn, updateUser);

// delete user
usersRouter.delete("/:userId", mustBeLoggedIn, deleteUser);

// update FCM Token
usersRouter.post("/fcm-token", mustBeLoggedIn, updateFcmToken);

module.exports = usersRouter;
