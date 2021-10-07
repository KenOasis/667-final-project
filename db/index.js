const pgp = require('pg-promise')();
let ssl = {rejectUnauthorized: false};
if (process.env.NODE_ENV === 'development') {
  ssl = false;
}
const config = {
  connectionString: process.env.DATABASE_URL,
  max: 50,
  ssl: ssl
}
const connection = pgp(config);

module.exports = connection;