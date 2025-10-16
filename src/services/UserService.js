const User = require('../models/user');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * Lista todos os usuários, excluindo o hash da senha.
   */
  async listAll() {
    return User.findAll({
      attributes: { exclude: ['password_hash'] },
    });
  }

  /**
   * Cria um novo usuário.
   */
  async create({ name, email, role, password }) {
    // Regra de negócio: Verificar se o e-mail já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const error = new Error('Este e-mail já está em uso.');
      error.statusCode = 400;
      // Lança um erro que o frontend pode usar para exibir no campo 'email'
      error.details = [{ field: 'email', message: 'Este e-mail já está em uso.' }];
      throw error;
    }

    // --- ALTERAÇÃO AQUI ---
    // Gera o hash da senha antes de criar o usuário no banco de dados.
    // O número 8 representa o "custo" do hash, um bom equilíbrio entre segurança e performance.
    const password_hash = await bcrypt.hash(password, 8);

    const user = await User.create({ name, email, role, password_hash });

    // Retorna uma versão segura do usuário, sem a senha
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Atualiza um usuário existente.
   */
  async update(userId, { name, email, role, oldPassword, password }) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    // Regra de negócio: Valida se o e-mail já está em uso por OUTRO usuário
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        const error = new Error('Este e-mail já está em uso.');
        error.statusCode = 400;
        error.details = [{ field: 'email', message: 'Este e-mail já está em uso.' }];
        throw error;
      }
    }

    // Regra de negócio: Lógica para alteração de senha
    if (oldPassword) {
      if (!password) {
        const error = new Error('A nova senha é obrigatória quando a senha antiga é fornecida.');
        error.statusCode = 400;
        error.details = [{ field: 'password', message: 'A nova senha é obrigatória.' }];
        throw error;
      }
      if (!(await bcrypt.compare(oldPassword, user.password_hash))) {
        const error = new Error('A senha antiga está incorreta.');
        error.statusCode = 401; // Unauthorized
        error.details = [{ field: 'oldPassword', message: 'A senha antiga está incorreta.' }];
        throw error;
      }
      user.password = password; // O hashing será feito pelo hook do model
    }

    // Atualiza os outros campos se eles foram fornecidos
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Deleta um usuário.
   */
  async delete(idToDelete, currentUserId) {
    // Regra de negócio: Impede que um usuário se auto-delete
    if (idToDelete === currentUserId) {
      const error = new Error('Você não pode excluir sua própria conta.');
      error.statusCode = 403; // Forbidden
      throw error;
    }

    const user = await User.findByPk(idToDelete);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    await user.destroy();
  }
}

module.exports = new UserService();