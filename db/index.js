const pgp = require('pg-promise')();
const { parse } = require('pg-connection-string');
const config = parse(process.env.DATABASE_URL);
config.ssl = true;
if (process.env.NODE_ENV === 'development'){
  config.ssl = false;
}
console.log(config);
const connection = pgp(config);

module.exports = connection;