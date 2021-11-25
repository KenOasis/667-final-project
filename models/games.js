"use strict";

module.exports = (sequelize, DataTypes) => {
  const Games = sequelize.define(
    "games",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW"),
      },
      finished_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW"),
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          len: [3, 20],
        },
      },
      direction: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isIn: [[-1, 1]],
        },
      },
      matching_color: {
        type: DataTypes.ENUM("red", "yellow", "green", "blue", "none"),
        allowNull: false,
        defaultValue: "none",
      },
      matching_value: {
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
          "skip",
          "reverse",
          "draw_two",
          "none"
        ),
        allowNull: false,
        defaultValue: "none",
      },
      undone_action: {
        type: DataTypes.ENUM("none", "draw", "yellow", "red", "blue", "green"),
        allowNull: false,
        defaultValue: "none",
      },
    },
    {
      timestamps: false,
    }
  );
  return Games;
};
