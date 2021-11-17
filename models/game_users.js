"use strict";
const Deferrable = require("sequelize").Deferrable;
// need to add model wide validate to unique(game_id, user_id)
module.exports = (sequelize, DataTypes) => {
  const Game_users = sequelize.define(
    "game_users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      game_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "games",
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      current_player: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      uno: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      initial_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    }
  );
  return Game_users;
};
