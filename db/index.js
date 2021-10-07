const pgp = require('pg-promise')();
let config = {
  connectionString: process.env.DATABASE_URL + "/?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
}
if (process.env.NODE_ENV === 'development') {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = false;
}
const connection = pgp(config);

module.exports = connection;