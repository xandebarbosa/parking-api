const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authConfig = require('../config/auth');

class SessionService {
  /**
   * Autentica um usuário e cria uma sessão, retornando os dados do usuário e um token JWT.
   * @param {string} email - O e-mail do usuário.
   * @param {string} password - A senha do usuário.
   * @returns {Promise<{user: object, token: string}>}
   */
  async create({ email, password }) {
    // 1. Encontrar o usuário pelo e-mail
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      const error = new Error('Usuário ou senha inválidos.');
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // 2. Verificar se a senha está correta (usando o método do próprio model)
    if (!(await user.checkPassword(password))) {
      const error = new Error('Usuário ou senha inválidos.');
      error.statusCode = 401;
      throw error;
    }

    const { id, name, role } = user;

    // 3. Gerar o token JWT
    const token = jwt.sign({ id, role }, authConfig.secret, {
      expiresIn: authConfig.expiresIn || '7d',
    });

    // 4. Retornar os dados da sessão
    return {
      user: {
        id,
        name,
        email,
        role,
      },
      token,
    };
  }
}

module.exports = new SessionService();