'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //Comando para adicionar a coluna 'local' à tabela "Vehicles"'
    await queryInterface.addColumn('Vehicles', 'local', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vehicles', 'local');
  }
};
