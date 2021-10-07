const pgp = require('pg-promise')();
let config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}
if (process.env.NODE_ENV === 'development') {
  config.ssl = false;
}
const connection = pgp(config);

module.exports = connection;