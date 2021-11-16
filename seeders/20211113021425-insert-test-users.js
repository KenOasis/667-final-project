const testUsers = require('../db/test_users');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', testUsers);
  },
  async : (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
}