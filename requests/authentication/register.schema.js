const z = require('zod');

const registerSchema = z.object({
  firstname: z.string().min(2).max(255),
  lastname: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
  gender: z.enum(['male', 'female']).optional(),
  address: z.string().max(255).optional(),
});

module.exports = registerSchema;
