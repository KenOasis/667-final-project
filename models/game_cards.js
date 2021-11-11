"use_strict"
const Deferrable = require('sequelize').Deferrable;

// need to add model wide constraint unique(game_id, user_id, card_id)
module.exports = (sequelize, DataTypes) => {
  const Game_cards = sequelize.define('game_cards', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'games',
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    card_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'cards',
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    draw_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 108
      }
    },
    in_deck: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    discarded: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 108
      }
    }
  }, {
    timestamps: false
  })
  return Game_cards;
}