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
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        direction: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        }
      }
    ).then(() => queryInterface.addConstraint(
      'games', {
        fields: ['direction'],
        type: 'check',
        where: {
          direction: {
            [Sequelize.Op.in]: [-1, 1]
          }
        }
      }
    ));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('games');
  }
}