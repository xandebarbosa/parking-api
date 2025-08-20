const User = require('../../../models/user');

class UserController {
  async store(req, res) {
    const { name, email, password } = req.body;

    // Verifica se o e-mail já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

module.exports = new UserController();