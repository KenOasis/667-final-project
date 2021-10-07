const pgp = require('pg-promise')();
let connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production'){
  connectionString += "?sslmode=require";
}
const connection = pgp(connectionString);

module.exports = connection;