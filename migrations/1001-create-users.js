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
        email: {
          type: Sequelize.STRING(65),
          unique: true,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        }
      }
    ).then(() => queryInterface.addConstraint(
      'users', {
        type: 'check',
        fields: ['email'],
        where: {
          email: {
            [Sequelize.Op.regexp]: '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'
          }
        }
      }
    ));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};