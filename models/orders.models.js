const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //this is the user id from the user model
    ref: "User", //this is the user model name that we have exported
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  carDetails: {
    model: { type: String, required: true }, // نوع السيارة سنة الصنع
    plateNumber: { type: String, required: true }, // رقم اللوحة
    color: { type: String }
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: "pending" 
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at timestamp before saving
OrdersSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Order = mongoose.model("Order", OrdersSchema);
module.exports = Order;
