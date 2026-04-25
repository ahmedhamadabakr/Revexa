const z = require("zod");

// Status values must match orders.models.js enum exactly
const orderSchema = z.object({
  status: z.enum(["pending", "confirmed", "in-progress", "completed", "cancelled"]).optional(),
});

module.exports = { orderSchema };
