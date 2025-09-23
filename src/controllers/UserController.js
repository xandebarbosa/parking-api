const User = require('../models/user');
const bcrypt = require('bcryptjs');

class UserController {
  async store(req, res) {
    const { name, email, role, password } = req.body;

    // Verifica se o e-mail já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const user = await User.create({ name, email, role ,password });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  }

  async update(req, res) {
    const { name, role, email, oldPassword, password } = req.body;
    const userId = req.userId;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário nõ encontrado.' });
      }

      // valida se o e-mail já esta em uso por OUTRO usuário
      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email }});
        if (userExists) {
          return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }
      }

      // Lógica para alteração de senha
      if (oldPassword && !password) {
        return res.status(400).json({ error: 'A nova senha é obrigatória.' });
      }

      if (oldPassword && !(await bcrypt.compare(oldPassword, user.password_hash))) {
        return res.status(401).json({ error: 'A senha antiga está incorreta. '});
      }

      // Atualiza os dados do usário
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) user.password = password;
      // O hashing será feito pelo hook beforeSave no model

      await user.save();

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  }


  //Método para listar todos os usuários
  async index(req, res) {
    try {
      const users = await User.findAll({
        // Boa prática: nunca retorne o hash da senha
        attributes: { exclude: ['password_hash']},
      });
      return res.json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ error: 'Erro interno ao listar usuários.' });
    }
  }

  //Método para Deletar um usuário
  async delete(req, res) {
    const { id } = req.params;
    const idToDelete = parseInt(id, 10);

    try {
      // Ponto de segurança: Impede que um usuário se auto-delete
      if (idToDelete === req.userId) {
        return res.status(403).json({ error: 'Você não pode excluir sua própria conta.' });
      }

      const user = await User.findByPk(idToDelete);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      await user.destroy();
      return res.status(204).send();
        
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).json({ error: 'Erro interno ao deletar usuário.' });
    }
  }
}



module.exports = new UserController();