const EfetivoService = require('../services/EfetivoService');

class EfetivoController {
  async index(req, res) {
    const efetivos = await EfetivoService.listAll();
    return res.json(efetivos);
  }

  async show(req, res) {
    const { id } = req.params;
    const efetivo = await EfetivoService.findById(id);
    return res.json(efetivo);
  }

  async store(req, res) {
    const efetivo = await EfetivoService.create(req.body);
    return res.status(201).json(efetivo);
  }

  async fullStore(req, res) {
    const { efetivoData, vehicleData } = req.body;
    const { efetivo, vehicle } = await EfetivoService.createFull(efetivoData, vehicleData);
    return res.status(201).json({ efetivo, vehicle });
  }

  async update(req, res) {
    const { id } = req.params;
    const updatedEfetivo = await EfetivoService.update(id, req.body);
    return res.json(updatedEfetivo);
  }

  async delete(req, res) {
    const { id } = req.params;
    await EfetivoService.delete(id);
    return res.status(204).send();
  }

  async searchByNameAndRE(req, res) {
    const { name, re } = req.query;
    const efetivos = await EfetivoService.search(name, re);
    return res.json(efetivos);
  }

  // O método 'search' que você tinha era redundante. 
  // O 'searchByNameAndRE' já cumpre a função de forma mais flexível.
  // Se quiser manter a rota /search?q=valor, você pode fazer:
  async search(req, res) {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: "Parâmetro de busca 'q' é obrigatório." });
    }
    // Reutiliza a mesma lógica do serviço, passando 'q' para ambos os campos
    const efetivos = await EfetivoService.search(q, q);
    return res.json(efetivos);
  }
}

module.exports = new EfetivoController();