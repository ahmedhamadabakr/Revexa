const { z } = require("zod");

const productIdschema = z.object({
  productId: z
    .string()
    .min(24)
    .max(24)
    .regex(/^[0-9a-fA-F]{24}$/),
});

module.exports = productIdschema;
