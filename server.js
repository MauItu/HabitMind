const sql = require("./db");

async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log("Resultado de la consulta:", result); // Verifica la respuesta
    if (!result || result.length === 0) {
      throw new Error("No se obtuvo resultado de la consulta.");
    }
    const { version } = result[0];
    console.log("Conectado a la BD:", version);
  } catch (err) {
    console.error("Error en la conexión:", err);
  }
}

testConnection();
