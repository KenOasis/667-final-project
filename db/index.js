const pgp = require('pg-promise')();
// let config = {
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   }
// }
// if (process.env.NODE_ENV === 'development') {
//   config.connectionString = process.env.DATABASE_URL;
//   config.ssl = false;
// }
// const connection = pgp(config);
let connectionString = process.env.DATABASE_URL + "&ssl=no-verify";
if (process.env.NODE_ENV == 'development') {
  connectionString = process.env.DATABASE_URL;
}
const connection = pgp(connectionString);

module.exports = connection;