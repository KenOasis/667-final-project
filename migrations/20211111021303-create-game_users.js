"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "game_users",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        game_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "games",
            key: "id",
          },
          onDelete: "RESTRICT",
          unique: "game_user_unique",
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "RESTRICT",
          unique: "game_user_unique",
        },
        current_player: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        uno: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        initial_order: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        points: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        uniqueKeys: {
          game_user_unique: {
            fields: ["game_id", "user_id", "initial_order"],
          },
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("game_users");
  },
};
