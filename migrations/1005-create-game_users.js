'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'game_users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        game_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'games',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          unique: 'game_user_unique'
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          unique: 'game_user_unique'
        },
        points: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      }, {
        uniqueKeys: {
          game_user_unique: {
            fields: ['game_id', 'user_id']
          }
        }
      }
    ).then(() => queryInterface.addConstraint('game_users', {
      fields: ['points'],
      type: 'check',
      where: {
        points: {
          [Sequelize.Op.gte]: 0
        }
      }
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('game_users');
  }
}