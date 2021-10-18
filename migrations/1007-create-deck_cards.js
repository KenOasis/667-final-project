'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'deck_cards', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        deck_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'decks',
            key: 'id'
          },
          onDelete: 'CASCADE',
          unique: 'decks_card_unique'
        },
        card_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'cards',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          unique: 'decks_card_unique'
        }
      }, {
        uniqueKeys: {
          decks_card_unique: {
            fields: ['deck_id', 'card_id']
          }
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deck_cards');
  }
}