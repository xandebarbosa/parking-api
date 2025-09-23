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
        type: Sequelize.STRING,
        unique: true, 
        allowNull: false 
      },
      name: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      postoGrad: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      rg: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      cpf: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      opm: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      funcao: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      secao: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      ramal: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      pgu: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      valCnh: {
        type: Sequelize.DATE, 
        allowNull: false 
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