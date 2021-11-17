"use strict";

const cardsBulk = require("../db/cards_bulk");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cards", null, {});
    await queryInterface.bulkInsert("cards", cardsBulk);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cards", null, {});
  },
};
