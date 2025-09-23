'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Vehicles', 'card_number', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporariamente permite nulo para registros existentes
      unique: true,
    });

    // Opcional: Preenche os registros existentes com números sequenciais
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE vehicles_card_number_seq;
      UPDATE "Vehicles" SET card_number = nextval('vehicles_card_number_seq') WHERE card_number IS NULL;
    `);

    // Altera para não permitir nulos para novos registros
    await queryInterface.changeColumn('Vehicles', 'card_number', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vehicles', 'card_number');
    await queryInterface.sequelize.query('DROP SEQUENCE vehicles_card_number_seq;');
  }
};
