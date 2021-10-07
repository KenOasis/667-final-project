const pgp = require('pg-promise')();
let config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    mode: 'verify-full',
    rootcert: 'ca.pem'
  }
}

if (process.env.NODE_ENV === 'development') {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = false;
}
const connection = pgp(config);

module.exports = connection;