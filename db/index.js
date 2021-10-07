const pgp = require('pg-promise')();
const fs = require('fs');
let config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
  }
}
if (process.env.NODE_ENV === 'development') {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = false;
}
const connection = pgp(config);
// const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;