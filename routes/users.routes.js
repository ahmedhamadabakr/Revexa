const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

// get all users
usersRouter.get("/api/users", getAllUsers);

// get user by id
usersRouter.get("/api/users/:userId", getUserById);

// update user
usersRouter.put("/api/update/:userId", updateUser);

// delete user
usersRouter.delete("/api/delete/:userId", deleteUser);

module.exports = usersRouter;
