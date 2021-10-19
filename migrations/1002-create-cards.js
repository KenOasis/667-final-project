'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'cards', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: {
          type: Sequelize.ENUM(
            'number',
            'action',
            'wild'
          ),
          allowNull: false
        },
        color: {
          type: Sequelize.ENUM(
            'red',
            'yellow',
            'green',
            'blue',
            'none',
          ),
          allowNull: false
        },
        action: {
          type: Sequelize.ENUM(
            'no_action',
            'skip',
            'reverse',
            'draw_two',
             'wild',
            'wild_draw_four'
          ),
          allowNull: false
        },
        face_value: {
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
          allowNull: false
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cards').then(() => queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_cards_action;
    DROP TYPE IF EXISTS enum_cards_color; 
    DROP TYPE IF EXISTS enum_cards_face_value; 
    DROP TYPE IF EXISTS enum_cards_type`));
  }
}