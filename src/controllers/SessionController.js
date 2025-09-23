const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authConfig = require('../config/auth'); // Certifique-se que este arquivo existe

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const { id, name, role } = user;

    const token = jwt.sign({ id, role }, authConfig.secret, {
      expiresIn: '24h', // Pode ser '1d', '7d', '365d', etc.
    });

    return res.json({
      user: {
        id,
        name,
        email,
        role,
      },
      token,
    });
  }
}

module.exports = new SessionController();