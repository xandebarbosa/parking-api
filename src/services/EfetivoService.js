const { Op } = require('sequelize');
const Efetivo = require('../models/efetivo');
const VehicleService = require('./VehicleService'); // Usaremos o serviço de veículo
const sequelize = require('../database');

class EfetivoService {
  /**
   * Lista todos os efetivos, ordenados por nome.
   */
  async listAll() {
    return Efetivo.findAll({
      order: [['name', 'ASC']],
      include: { association: 'vehicles' }
    });
  }

  /**
   * Busca um efetivo pelo seu ID.
   */
  async findById(id) {
    const efetivo = await Efetivo.findByPk(id, {
      include: { association: 'vehicles' }
    });

    if (!efetivo) {
      const error = new Error('Efetivo não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return efetivo;
  }

  /**
   * Cria um novo efetivo.
   */
  async create(efetivoData) {
    // O erro de RE duplicado ou validação será capturado pelo error handler central
    return Efetivo.create(efetivoData);
  }

  /**
   * Cria um efetivo e seu primeiro veículo em uma única transação.
   */
  async createFull(efetivoData, vehicleData) {
    const t = await sequelize.transaction();
    try {
      // 1. Cria o Efetivo
      const efetivo = await Efetivo.create(efetivoData, { transaction: t });

      // 2. Prepara os dados do veículo, associando o ID do efetivo recém-criado
      const fullVehicleData = {
        ...vehicleData,
        efetivo_id: efetivo.id,
      };

      // 3. Chama o VehicleService para criar o veículo, PASSANDO A TRANSAÇÃO
      const vehicle = await VehicleService.create(fullVehicleData, t); // <-- Passa a transação
      
      // 4. Se tudo deu certo, commita a transação
      await t.commit();

      // Retorna os dados criados
      return { efetivo, vehicle };

    } catch (error) {
      // 5. Se qualquer passo falhar, desfaz tudo (rollback)
      await t.rollback();
      // Propaga o erro para o controller lidar
      throw error; 
    }
  }

  /**
   * Atualiza um efetivo existente.
   */
  async update(id, efetivoData) {
    const efetivo = await this.findById(id); // Reutiliza o método de busca
    return efetivo.update(efetivoData);
  }

  /**
   * Deleta um efetivo.
   */
  async delete(id) {
    const efetivo = await this.findById(id); // Reutiliza o método de busca
    await efetivo.destroy();
  }

  /**
   * Busca efetivos por nome ou RE.
   */
  async search(name, re) {
    const searchConditions = [];
    if (name) {
      searchConditions.push({ name: { [Op.iLike]: `%${name}%` } });
    }
    if (re) {
      searchConditions.push({ re: { [Op.iLike]: `%${re}%` } });
    }

    if (searchConditions.length === 0) {
      return [];
    }

    return Efetivo.findAll({
      where: { [Op.or]: searchConditions },
      limit: 20
    });
  }
}

module.exports = new EfetivoService();