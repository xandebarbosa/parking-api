const Vehicle = require('../models/vehicle');
const Efetivo = require('../models/efetivo');
const sequelize  = require('../database');
const { where } = require('sequelize');

class VehicleController {

  async getNextCardNumber(req, res) {
    try {
      const lastVehicle = await Vehicle.findOne({
        order: [['card_number', 'DESC']],
        paranoid: false,
      });

      const nextCardNumber = lastVehicle ? lastVehicle.card_number + 1 : 1;

      return res.json({ nextCardNumber });
    } catch (error) {
      console.error("Erro ao buscar próximo número do cartão:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  //Listar veículos de um efetivo especifico
  async index(req, res) {
      const { efetivo_id } = req.params;

      const efetivo = await Efetivo.findByPk(efetivo_id, {
          include: { association: 'vehicles', order: [['createdAt', 'DESC']] }
      });

      if (!efetivo) {
          return res.status(404).json({ error: 'Efetivo not found.' });
      }

      return res.json(efetivo.vehicles)
  }

  // Criar um novo veículo para um efetivo
  async store(req, res) {
    // Usamos uma transaction para garantir a integridade dos dados
    const t = await sequelize.transaction();

    try {
      const { efetivo_id } = req.params;
      const { ...vehicleData } = req.body;

      const efetivo = await Efetivo.findByPk(efetivo_id, { transaction: t });
      if (!efetivo) {
        await t.rollback();
        return res.status(404).json({ error: 'Efetivo not found.' });
      }

      // 1. Encontra o maior card_number que já existe no banco
      const lastVehicle = await Vehicle.findOne({
        order: [['card_number', 'DESC']],
        paranoid: false, // Inclui registros deletados (soft delete) se houver
        transaction: t,
      });

      // 2. Calcula o próximo número do cartão
      const nextCardNumber = lastVehicle ? lastVehicle.card_number + 1 : 1;

      // 3. Cria o novo veículo com o número do cartão gerado
      const vehicle = await Vehicle.create({
        ...vehicleData,
        efetivo_id,
        card_number: nextCardNumber, // Adiciona o número sequencial
      }, { transaction: t });

      console.log("vehicle===> ", vehicle);
      

      // Se tudo deu certo, confirma a transação
      await t.commit();

      return res.status(201).json(vehicle);
    } catch (error) {
      // Se algo deu errado, desfaz a transação
      await t.rollback();
      console.error("Erro ao criar veículo:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Atualizar um veículo
  async update(req, res) {
    const { id } = req.params; // ID do veículo
    const vehicleData = req.body;

    try {
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado.' });
      }

      // Previne que dados sensíveis ou de associação sejam atualizados diretamente
      delete vehicleData.id;
      delete vehicleData.efetivo_id;
      delete vehicleData.efetivo;

      await vehicle.update(vehicleData);
      return res.json(vehicle);

    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      return res.status(500).json({ error: 'Erro interno ao atualizar veículo.' });
    }
  }

  // Deletar um veículo
  async delete(req, res) {
    const { id } = req.params; // ID do veículo
     try {
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado.' });
      }
      await vehicle.destroy();
      return res.status(204).send(); // 204 No Content é a resposta padrão para sucesso em delete

    } catch (error) {
      console.error("Erro ao deletar veículo:", error);
      return res.status(500).json({ error: 'Erro interno ao deletar veículo.' });
    }  
  }

  async listAll(req, res) {
    try {
      const vehicles = await Vehicle.findAll({
        include: {
          model: Efetivo,
          as: 'efetivo', // IMPORTANTE: 'as' deve ser o mesmo alias definido na sua associação no Model
          attributes: ['id','name','re','postoGrad','rg','cpf','opm','funcao','secao','ramal','pgu','valCnh' ] // Boa prática: selecione apenas os campos necessários do efetivo
        },
        // Opcional: você pode ordenar aqui também, se preferir
        order: [['validadeCartao', 'DESC']]
      });

      console.log("vehicles==>", vehicles);
      

      return res.json(vehicles);

    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      return res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  }

  // Metodo para buscar um veículo pelo número do cartao
  async findByCardNumber(req, res) {
    const { number } = req.params;

    try {
      //Usamos finOne para buscar o primeiro que corresponder
      const vehicle = await Vehicle.findOne({
        where: { card_number: number },
        include: {
          model: Efetivo,
          as: 'efetivo',
        }
      });

      if (!vehicle) {
        return res.status(404).json({ error: 'Cartão não encontrado.' });
      }

      return res.json(vehicle);

    } catch (error) {
      console.error("Erro ao buscar veículo por número do cartão:", error);
      return res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  }
}

module.exports = new VehicleController();