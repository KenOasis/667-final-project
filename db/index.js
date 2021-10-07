const pgp = require('pg-promise')();
let ssl = null;
if (process.env.NODE_ENV === 'production'){
  ssl = {
    rejectUnauthorized: false
  }
}
let config = {
  connectionString : process.env.DATABASE_URL,
  ssl : ssl
}


const connection = pgp(config);

module.exports = connection;