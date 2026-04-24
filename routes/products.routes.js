const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/Products.controller");
const isAdmin = require("../middlewares/is-admin");
const isCompany = require("../middlewares/is-company");
const mustBeLoggedIn = require("../middlewares/must-be-logged");
const { upload } = require("../config/cloudinary");

const productRouter = express.Router();

productRouter.get("/api/products", getAllProducts);

productRouter.get("/api/products/:productId", getProductById);

productRouter.post("/api/products",
   mustBeLoggedIn,
   isCompany,
   upload.array("images", 5), // السماح برفع حتى 5 صور
    createProduct);

productRouter.put(
  "/api/products/:productId",
  mustBeLoggedIn,
  isCompany,
  updateProduct
);

productRouter.delete(
  "/api/products/:productId",
  mustBeLoggedIn,
  isCompany,
  deleteProduct
);

module.exports = productRouter;
