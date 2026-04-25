const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/Products.controller");
const isCompany = require("../middlewares/is-company");
const mustBeLoggedIn = require("../middlewares/must-be-logged");
const { upload } = require("../config/cloudinary");

const productRouter = express.Router();

productRouter.get("/", getAllProducts);

productRouter.get("/:productId", getProductById);

productRouter.post("/", mustBeLoggedIn, isCompany, upload.array("images", 5), createProduct);

productRouter.put("/:productId", mustBeLoggedIn, isCompany, updateProduct);

productRouter.delete("/:productId", mustBeLoggedIn, deleteProduct);

module.exports = productRouter;
