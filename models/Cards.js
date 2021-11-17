"use strict";

module.exports = (sequelize, DataTypes) => {
  const Cards = sequelize.define(
    "cards",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM("number", "action", "wild"),
        allowNull: false,
      },
      color: {
        type: DataTypes.ENUM("red", "yellow", "green", "blue", "none"),
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM(
          "no_action",
          "skip",
          "reverse",
          "draw_two",
          "wild",
          "wild_draw_four"
        ),
        allowNull: false,
      },
      face_value: {
        type: DataTypes.ENUM(
          "zero",
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
          "eight",
          "nine",
          "none"
        ),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return Cards;
};
