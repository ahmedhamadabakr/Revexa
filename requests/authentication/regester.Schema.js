const z = require("zod");
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(7).max(20),
  address: z.string().max(500).optional(),
  age: z.number().int().positive().min(18),
  gender: z.enum(["male", "female"]),
});

module.exports = { registerSchema };
