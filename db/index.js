const pgp = require('pg-promise')();
const { parse } = require('pg-connection-string');
const config = parse(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== 'development'){
  config.ssl = {
    rejectUnauthorized: false
  }
}

const connection = pgp(config);

module.exports = connection;