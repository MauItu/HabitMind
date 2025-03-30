require("dotenv").config();
const { neon } = require("@neondatabase/serverless"); // Asegura que el paquete esté instalado

const sql = neon(process.env.DATABASE_URL); // Revisa que DATABASE_URL esté bien configurada

module.exports = sql;
