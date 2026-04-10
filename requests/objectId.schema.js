const z = require('zod');

const objectIdSchema = z.object({
  id: z.string().min(24).max(24),  // 0123456789abcdef
});

module.exports = objectIdSchema;
