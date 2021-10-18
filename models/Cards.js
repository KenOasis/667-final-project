"use strict";

module.exports = (sequelize, DataTypes) => {
  const Cards = sequelize.define("cards", {
    type: {
      type: DataTypes.ENUM(
        'number',
        'action',
        'wild'
      ),
    },
    color: {
      type: DataTypes.ENUM(
        'red',
        'yellow',
        'green',
        'blue',
        'none',
      )
    },
    action: {
      type: DataTypes.ENUM(
        'no_action',
        'skip',
        'reverse',
        'draw_two',
        'wild',
        'wild_draw_four'
      )
    },
    face_value: {
      type: DataTypes.ENUM(
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
      )
    }
  }, {
    timestamps: false
  });
  return Cards;
}