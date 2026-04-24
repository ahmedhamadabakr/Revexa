// - Orders
//   - Get all orders By Status (Pagination)
//   - Get order by id
//   - Create order
//   - Update order
//   - Delete order

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");

const express = require("express");
const mustBeLoggedIn = require("../middlewares/must-be-logged");

const orederRouter = express.Router();

orederRouter.get("/api/orders", mustBeLoggedIn, getAllOrders);

orederRouter.get("/api/order/:orderId", mustBeLoggedIn, getOrderById);

orederRouter.post("/api/order/:productId", mustBeLoggedIn, createOrder);

orederRouter.put("/api/order/:orderId", mustBeLoggedIn, updateOrder);

orederRouter.delete("/api/order/:orderId", mustBeLoggedIn, deleteOrder);

module.exports = orederRouter;
