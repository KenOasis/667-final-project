const pgp = require('pg-promise')();
let connectionString = process.env.DATABASE_URL;
if (process.env.NODE_ENV !== 'development') {
  connectionString += "?sslmode=require";
}

const connection = pgp(connectionString);

module.exports = connection;