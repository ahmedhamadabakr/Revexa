const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");
const mustBeLoggedIn = require("../middlewares/must-be-logged");

const usersRouter = express.Router();

// get all users
usersRouter.get("/", getAllUsers);

// get user by id
usersRouter.get("/:userId", getUserById);

// update user
usersRouter.put("/:userId", mustBeLoggedIn, updateUser);

// delete user
usersRouter.delete("/:userId", mustBeLoggedIn, deleteUser);

module.exports = usersRouter;
