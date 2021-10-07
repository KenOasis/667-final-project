const pgp = require('pg-promise')();
let connectionString = process.env.DATABASE_URL;

const connection = pgp(connectionString);

module.exports = connection;