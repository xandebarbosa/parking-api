const SessionService = require('../services/SessionService');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    // Delega toda a lógica de criação da sessão para o serviço
    const session = await SessionService.create({ email, password });

    return res.json(session);
  }
}

module.exports = new SessionController();