const z = require("zod");
const productsSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(1000),
  category: z.string().nonempty(),
  price: z.number(),
  images: z.array(
    z.object({
      url: z.string().url(),
      public_id: z.string()
    })
  ).min(1),
  location: z.string().optional(),
});

module.exports = productsSchema;
