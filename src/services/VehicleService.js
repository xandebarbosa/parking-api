const Vehicle = require("../models/vehicle");
const Efetivo = require("../models/efetivo");
const sequelize = require("../database");

class VehicleService {
  /**
   * Calcula o próximo número de cartão disponível.
   */
  async getNextCardNumber() {
    const lastVehicle = await Vehicle.findOne({
      order: [["card_number", "DESC"]],
      paranoid: false, // Garante que a contagem seja sempre sequencial
    });
    return lastVehicle ? lastVehicle.card_number + 1 : 1;
  }

  /**
   * Lista todos os veículos de um efetivo específico.
   */
  async listByEfetivo(efetivoId) {
    const efetivo = await Efetivo.findByPk(efetivoId, {
      include: { association: "vehicles", order: [["createdAt", "DESC"]] },
    });
    return efetivo ? efetivo.vehicles : null;
  }

  /**
   * Cria um novo veículo para um efetivo, gerenciando a transação e o número do cartão.
   */
  async create(vehicleData, transaction = null) {
    try {
      const { efetivo_id } = vehicleData;

      // Busca o Efetivo DENTRO da transação, se ela existir
      const efetivo = await Efetivo.findByPk(efetivo_id, { transaction });
      if (!efetivo) {
        // Lançar um erro específico ajuda o controller a saber qual status code retornar
        const error = new Error("Efetivo not found.");
        error.statusCode = 404;
        throw error;
      }

      // Lógica para gerar o próximo número de cartão (já existente no seu código)
      const lastVehicle = await Vehicle.findOne({
        order: [["card_number", "DESC"]],
        attributes: ["card_number"],
        transaction, // <-- Usa a transação aqui também
      });
      const nextCardNumber = lastVehicle ? lastVehicle.card_number + 1 : 1;

      // Cria o Veículo DENTRO da transação
      const vehicle = await Vehicle.create(
        {
          ...vehicleData,
          card_number: nextCardNumber,
        },
        { transaction } // <-- Usa a transação
      );

      return vehicle;
    } catch (error) {
      await transaction.rollback();
      // Re-lança o erro para ser capturado pelo error handler central
      throw error;
    }
  }

  /**
   * Atualiza os dados de um veículo.
   */
  async update(vehicleId, vehicleData) {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      const error = new Error("Veículo não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    // Regra de negócio: impede a alteração de campos protegidos
    delete vehicleData.id;
    delete vehicleData.efetivo_id;
    delete vehicleData.efetivo;

    return vehicle.update(vehicleData);
  }

  /**
   * Deleta um veículo.
   */
  async delete(vehicleId) {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      const error = new Error("Veículo não encontrado.");
      error.statusCode = 404;
      throw error;
    }
    await vehicle.destroy();
  }

  /**
   * Lista todos os veículos com seus respectivos efetivos.
   */
  async listAll() {
    return Vehicle.findAll({
      include: {
        model: Efetivo,
        as: "efetivo",
        attributes: [
          "id",
          "name",
          "re",
          "postoGrad",
          "rg",
          "cpf",
          "opm",
          "funcao",
          "secao",
          "ramal",
          "pgu",
          "valCnh",
        ],
      },
      order: [["validadeCartao", "DESC"]],
    });
  }

  /**
   * Encontra um veículo pelo número do cartão.
   */
  async findByCardNumber(cardNumber) {
    const vehicle = await Vehicle.findOne({
      where: { card_number: cardNumber },
      include: { model: Efetivo, as: "efetivo" },
    });

    if (!vehicle) {
      const error = new Error("Cartão não encontrado.");
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }

  /**
   * Conta o número total de veículos.
   */
  async count() {
    const total = await Vehicle.count();
    return { total };
  }
}

module.exports = new VehicleService();
