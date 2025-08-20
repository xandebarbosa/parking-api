const Efetivo = require('../../../models/efetivo');

class EfetivoController {
  // Listar todos os efetivo
  async index(req, res) {
    const efetivo = await Efetivo.findAll({
      order: [['name', 'ASC']],
      include: { association: 'vehicles' } // Inclui os veículos associados
    });
    return res.json(efetivo);
  }

  // Buscar um efetivo específico
  async show(req, res) {
    const { id } = req.params;
    const efetivo = await Efetivo.findByPk(id, {
      include: { association: 'vehicles' }
    });

    if (!efetivo) {
      return res.status(404).json({ error: 'efetivo not found.' });
    }
    return res.json(efetivo);
  }

  // Criar um novo Efetivo
  async store(req, res) {
    const { name, document, phone } = req.body;
    const efetivo = await Efetivo.create({ name, document, phone });
    return res.status(201).json(efetivo);
  }

  // Atualizar um Efetivo
  async update(req, res) {
    const { id } = req.params;
    const efetivo = await Efetivo.findByPk(id);

    if (!efetivo) {
      return res.status(404).json({ error: 'Efetivo not found.' });
    }

    const updatedEfetivo = await efetivo.update(req.body);
    return res.json(updatedEfetivo);
  }

  // Deletar um Efetivo
  async delete(req, res) {
    const { id } = req.params;
    const efetivo = await Efetivo.findByPk(id);

    if (!efetivo) {
      return res.status(404).json({ error: 'Efetivo not found.' });
    }

    await efetivo.destroy();
    return res.status(204).send(); // 204: No Content
  }
}

module.exports = new EfetivoController();