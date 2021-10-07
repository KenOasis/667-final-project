const pgp = require('pg-promise')();
// let config = {
//   connectionString: process.env.DATABASE_URL + "/?sslmode=require",
//   ssl: {
//     rejectUnauthorized: false
//   }
// }
let connectionString = process.env.DATABASE_URL + "/?sslmode=require";
if (process.env.NODE_ENV === 'development') {
  connectionString = process.env.DATABASE_URL;
}
const connection = pgp(connectionString);

module.exports = connection;