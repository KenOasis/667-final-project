'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'decks', {
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
          onDelete: 'CASCADE',
          unique: 'game_user_unique'
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          unique: 'game_user_unique'
        }
      }, {
        uniqueKeys: {
          game_user_unique: {
            fields: ['game_id', 'user_id']
          }
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('decks');
  }
}