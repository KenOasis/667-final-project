'use strict';

const cardsBulk = require('../db/cards_bulk');

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('cards', null, {});
    return queryInterface.bulkInsert('cards', cardsBulk);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cards', null, {});
  }
}