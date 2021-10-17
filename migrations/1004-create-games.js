'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'games', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        },
        finished_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('games');
  }
}