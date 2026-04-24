const z = require("zod");

const orderSchema = z.object({
  quantity: z.number().int().positive().min(1),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional()
});

module.exports = { orderSchema };
