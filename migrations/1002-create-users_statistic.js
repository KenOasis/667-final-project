'use strict';

module.exports = {
  up: (queryInterface, Sequelzie) => {
    return queryInterface.createTable(
      'users_statistic', {
        id: {
          type: Sequelzie.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelzie.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        game_play: {
          type: Sequelzie.INTEGER,
          allowNull: false,
          defaultVaule: 0,
        },
        game_win: {
          type: Sequelzie.INTEGER,
          allowNull: false,
          defaultVaule: 0,
          min: 0
        },
        points: {
          type: Sequelzie.INTEGER,
          allowNull: false,
          defaultVaule: 300
        }
      }
    ).then(() => queryInterface.addConstraint('users_statistic', {
      fields: ['game_play'],
      type: 'check',
      where: {
        game_play: {
          [Sequelzie.Op.gte]: 0
        }
      }
    })).then(() => queryInterface.addConstraint('users_statistic', {
      fields: ['game_win'],
      type: 'check',
      where: {
        game_win: {
          [Sequelzie.Op.gte]: 0
        }
      }
    })).then(() => queryInterface.addConstraint('users_statistic', {
      fields: ['points'],
      type: 'check',
      where: {
        points: {
          [Sequelzie.Op.gte]: 0
        }
      }
    }));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_statistic').then(() => queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_cards_action;
     DROP TYPE IF EXISTS enum_cards_color; 
     DROP TYPE IF EXISTS enum_cards_face_value; 
     DROP TYPE IF EXISTS enum_cards_type`));
  }
};