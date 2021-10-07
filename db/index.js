const pgp = require('pg-promise')();

const connection = pgp(process.env.DATABASE_URL + "?ssl=no-verify");

module.exports = connection;