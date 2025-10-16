const { z } = require('zod');

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  password: z.string().min(6),
});

module.exports = {
  userSchema,
};