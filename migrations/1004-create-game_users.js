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
        current_player: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        initial_order: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        points: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      }, {
        uniqueKeys: {
          game_user_unique: {
            fields: ['game_id', 'user_id', 'initial_order']
          }
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('game_users');
  }
}