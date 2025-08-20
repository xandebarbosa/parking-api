'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Efetivos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      re: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      postoGrad: {
        type: Sequelize.STRING
      },
      rg: {
        type: Sequelize.STRING
      },
      cpf: {
        type: Sequelize.STRING
      },
      opm: {
        type: Sequelize.STRING
      },
      funcao: {
        type: Sequelize.STRING
      },
      secao: {
        type: Sequelize.STRING
      },
      ramal: {
        type: Sequelize.STRING
      },
      pgu: {
        type: Sequelize.STRING
      },
      valCnh: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Efetivos');
  }
};