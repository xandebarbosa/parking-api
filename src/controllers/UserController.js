const UserService = require('../services/UserService');

class UserController {
  async store(req, res) {
    const user = await UserService.create(req.body);
    return res.status(201).json(user);
  }

  async update(req, res) {
    // O ID do usuário logado vem do middleware de autenticação
    const updatedUser = await UserService.update(req.userId, req.body);
    return res.json(updatedUser);
  }

  async index(req, res) {
    const users = await UserService.listAll();
    return res.json(users);
  }

  async delete(req, res) {
    const { id } = req.params;
    const idToDelete = parseInt(id, 10);

    // Passamos o ID do usuário a ser deletado e o ID do usuário que está fazendo a requisição
    await UserService.delete(idToDelete, req.userId);
    
    return res.status(204).send();
  }
}

module.exports = new UserController();