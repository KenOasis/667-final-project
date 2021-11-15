'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
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
        },
        matching_color: {
          type: Sequelize.ENUM(
            'red',
            'yellow',
            'green',
            'blue',
            'none',
          ),
          allowNull: false,
          defaultValue: "none"
        },
        matching_number: {
          type: Sequelize.ENUM(
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'none'
          ),
          allowNull: false,
          defaultValue: "none"
        }
      }
    );
    await queryInterface.addConstraint(
      'games', {
        fields: ['direction'],
        type: 'check',
        where: {
          direction: {
            [Sequelize.Op.in]: [-1, 1]
          }
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('games');
  }
}