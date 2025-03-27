require("dotenv").config();
const { neon } = require("./node_modules/@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

module.exports = sql;
