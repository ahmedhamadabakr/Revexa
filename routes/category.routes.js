const express = require("express");
const { createCategory, getAllCategories, deleteCategory } = require("../controllers/category.controller");
const mustBeLoggedIn = require("../middlewares/must-be-logged");
const isAdmin = require("../middlewares/is-admin");

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.post("/", mustBeLoggedIn, isAdmin, createCategory);
categoryRouter.delete("/:id", mustBeLoggedIn, isAdmin, deleteCategory);

module.exports = categoryRouter;