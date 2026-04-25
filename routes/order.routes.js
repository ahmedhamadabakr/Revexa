const express = require("express");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const mustBeLoggedIn = require("../middlewares/must-be-logged");

const orderRouter = express.Router();

orderRouter.get("/", mustBeLoggedIn, getAllOrders);
orderRouter.get("/:orderId", mustBeLoggedIn, getOrderById);
orderRouter.post("/:productId", mustBeLoggedIn, createOrder);
orderRouter.put("/:orderId", mustBeLoggedIn, updateOrder);
orderRouter.delete("/:orderId", mustBeLoggedIn, deleteOrder);

module.exports = orderRouter;
