const pgp = require("pg-promise")();

// Heroku Postgresql DO NOT SUPPORT SSL with free tier
// ADD Config Vars "PGSSLMODE:no-verify" at the app setting
const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;
