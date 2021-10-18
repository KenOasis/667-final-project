'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: Sequelize.STRING(20),
          unique: true,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        profile_url: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: ''
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};