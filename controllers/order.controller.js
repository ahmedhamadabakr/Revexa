const Order = require("../models/orders.models");
const Product = require("../models/Products.model");
const { sendPushNotification } = require("../config/firebase");

/**
 * @desc Create a new order for a product
 * @route POST /api/order/:productId
 * @access Private (User)
 */
const createOrder = async (req, res) => {
  try {
    const { productId } = req.params;
    const { carDetails, appointmentDate } = req.body;

    if (!carDetails || !appointmentDate) {
      return res.status(400).json({ message: "carDetails and appointmentDate are required", data: null });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found", data: null });
    }

    const order = await Order.create({
      user: req.user.id,
      service: productId,
      carDetails,
      appointmentDate,
      totalAmount: product.price,
      status: "pending",
    });

    return res.status(201).json({ message: "Order created successfully", data: order });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * @desc Get orders — users see their own, admins/companies see all
 * @route GET /api/orders
 * @access Private
 */
const getAllOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };

    const orders = await Order.find(filter)
      .populate("service", "title price")
      .populate("user", "firstName lastName email");

    return res.status(200).json({ message: "Orders retrieved successfully", data: orders });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * @desc Get specific order by ID
 * @route GET /api/order/:orderId
 * @access Private
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const filter = req.user.role === "admin"
      ? { _id: orderId }
      : { _id: orderId, user: req.user.id };

    const order = await Order.findOne(filter)
      .populate("service", "title price")
      .populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found", data: null });
    }

    return res.status(200).json({ message: "Order retrieved successfully", data: order });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * @desc Update order status — only admin or the company that owns the service
 * @route PUT /api/order/:orderId
 * @access Private (Admin / Company)
 */
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        data: null,
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied. Only admins or companies can update order status.", data: null });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updated_at: Date.now() },
      { new: true }
    ).populate("user", "firstName lastName fcmToken");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found", data: null });
    }

    // Send push notification to user
    if (updatedOrder.user?.fcmToken) {
      try {
        await sendPushNotification(
          updatedOrder.user.fcmToken,
          "Order Update",
          `Your order status has been changed to: ${status}`
        );
      } catch (err) {
        console.error("Failed to send status notification:", err);
      }
    }

    return res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * @desc Delete an order — only the owner or admin
 * @route DELETE /api/order/:orderId
 * @access Private
 */
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const filter = req.user.role === "admin"
      ? { _id: orderId }
      : { _id: orderId, user: req.user.id };

    const order = await Order.findOne(filter);
    if (!order) {
      return res.status(404).json({ message: "Order not found", data: null });
    }

    await order.deleteOne();
    return res.status(200).json({ message: "Order deleted successfully", data: true });
  } catch (err) {
    return handleServerError(res, err);
  }
};

const handleServerError = (res, error) => {
  return res.status(500).json({ message: "Internal server error", error: error.message, data: null });
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
