"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "game_cards",
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
          onDelete: "CASCADE",
          unique: "game_user_card_unique",
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          unique: "game_user_card_unique",
        },
        card_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "cards",
            key: "id",
          },
          onDelete: "RESTRICT",
          unique: "game_user_card_uniquee",
        },
        draw_order: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        in_deck: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        discarded: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        uniqueKeys: {
          game_user_card_unique: {
            fields: ["game_id", "user_id", "card_id"],
          },
        },
      }
    );
    await queryInterface.addConstraint("game_cards", {
      fields: ["draw_order"],
      type: "check",
      where: {
        draw_order: {
          [Sequelize.Op.between]: [1, 108],
        },
      },
    });
    await queryInterface.addConstraint("game_cards", {
      fields: ["discarded"],
      type: "check",
      where: {
        discarded: {
          [Sequelize.Op.between]: [0, 108],
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("game_cards");
  },
};
