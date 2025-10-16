const VehicleService = require('../services/VehicleService');

class VehicleController {

  async getNextCardNumber(req, res) {
    const nextCardNumber = await VehicleService.getNextCardNumber();
    return res.json({ nextCardNumber });
  }

  async index(req, res) {
    const { efetivo_id } = req.params;
    const vehicles = await VehicleService.listByEfetivo(efetivo_id);

    if (vehicles === null) {
      return res.status(404).json({ error: 'Efetivo not found.' });
    }
    return res.json(vehicles);
  }

  async store(req, res) {
    const { efetivo_id } = req.params;
    const vehicle = await VehicleService.create(efetivo_id, req.body);
    return res.status(201).json(vehicle);
  }

  async update(req, res) {
    const { id } = req.params;
    const updatedVehicle = await VehicleService.update(id, req.body);
    return res.json(updatedVehicle);
  }

  async delete(req, res) {
    const { id } = req.params;
    await VehicleService.delete(id);
    return res.status(204).send();
  }

  async listAll(req, res) {
    const vehicles = await VehicleService.listAll();
    return res.json(vehicles);
  }

  async findByCardNumber(req, res) {
    const { number } = req.params;
    const vehicle = await VehicleService.findByCardNumber(number);
    return res.json(vehicle);
  }

  async getVehicleCount(req, res) {
    const count = await VehicleService.count();
    return res.json(count);
  }
}

module.exports = new VehicleController();