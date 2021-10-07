const pgp = require('pg-promise')();
let config = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
}
if (process.env.NODE_ENV === 'development') {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = {
    rejectUnauthorized: false
  };
}
const connection = pgp(config);

module.exports = connection;