const { z } = require("zod");

const orderIdschema = z.object({
  orderId: z
    .string()
    .min(24)
    .max(24)
    .regex(/^[0-9a-fA-F]{24}$/),
});

module.exports = orderIdschema;
