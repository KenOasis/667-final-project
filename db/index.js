const pgp = require('pg-promise')();

const connection = pgp(process.env.DATABASE_URL + "?pgsslmode=no-verify");

module.exports = connection;