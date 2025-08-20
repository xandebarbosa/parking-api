const Vehicle = require('../models/vehicle')
const Efetivo = require('../models/efetivo')

class VehicleController {
    //Listar veículos de um efetivo especifico
    async index(req, res) {
        const { efetivo_id } = req.params;

        const efetivo = await Efetivo.findByPk(efetivo_id, {
            include: { association: 'vehicles' }
        });

        if (!efetivo) {
            return res.status(404).json({ error: 'Efetivo not found.' });
        }

        return res.json(efetivo.vehicles)
    }

    // Criar um novo veículo para um efetivo
    async store(req, res) {
     const { efetivo_id } = req.params;
     const { 
        placa, 
        modelo, 
        color, 
        ano, 
        municipio, 
        uf, 
        chassi, 
        renavan, 
        reFiscalizador, 
        periodo1Entrada, 
        periodo1Saida, 
        periodo2Entrada, 
        periodo2Saida, 
        dias, 
        validadeCartao 
    } = req.body;

     const efetivo = await Efetivo.findByPk(efetivo_id);
     if (!efetivo) {
       return res.status(404).json({ error: 'Efetivo not found.' });
     }

     const vehicle = await Vehicle.create({
       placa,
       modelo,
       color,
       ano,
       municipio,
       uf,
       chassi,
       renavan,
       reFiscalizador,
       periodo1Entrada,
       periodo1Saida,
       periodo2Entrada,
       periodo2Saida,
       dias,
       validadeCartao,
       efetivo_id,
     });

     return res.status(201).json(vehicle);
      }

  // Atualizar um veículo
  async update(req, res) {
    const { id } = req.params; // ID do veículo
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    const updatedVehicle = await vehicle.update(req.body);
    return res.json(updatedVehicle);
  }

  // Deletar um veículo
  async delete(req, res) {
    const { id } = req.params; // ID do veículo
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    await vehicle.destroy();
    return res.status(204).send();
  }
}