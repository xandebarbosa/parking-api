'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user', // Todo usuário será 'user' por padrão
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'role');
  }
};
