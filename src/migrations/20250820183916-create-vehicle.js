'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      placa: {
        type: Sequelize.STRING
      },
      modelo: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      ano: {
        type: Sequelize.STRING
      },
      municipio: {
        type: Sequelize.STRING
      },
      uf: {
        type: Sequelize.STRING
      },
      chassi: {
        type: Sequelize.STRING
      },
      renavan: {
        type: Sequelize.STRING
      },
      reFiscalizador: {
        type: Sequelize.STRING
      },
      periodo1Entrada: {
        type: Sequelize.TIME
      },
      periodo1Saida: {
        type: Sequelize.TIME
      },
      periodo2Entrada: {
        type: Sequelize.TIME
      },
      periodo2Saida: {
        type: Sequelize.TIME
      },
      dias: {
        type: Sequelize.INTEGER
      },
      validadeCartao: {
        type: Sequelize.DATE
      },
      efetivo_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Efetivos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  }
};