require("dotenv").config();
const express = require("express");
const sql = require("./db"); // Importa la conexión a NeonDatabase

const app = express();
const PORT = 3000;

app.use(express.json()); // Permite recibir JSON en las peticiones

// 📌 Obtener todos los usuarios
app.get("/users", async (req, res) => {
  try {
      const users = await sql`SELECT * FROM users`;
      console.log("Datos obtenidos:", users); // Ver qué devuelve la consulta
      res.json(users);
  } catch (err) {
      console.error("Error en la consulta:", err);
      res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});


// 📌 Agregar un usuario (POST)
app.post("/users", async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const newUser = await sql`
            INSERT INTO users (nombre, email) 
            VALUES (${nombre}, ${email}) 
            RETURNING *`;
        res.status(201).json(newUser[0]); // Devuelve el usuario insertado
    } catch (err) {
        console.error("Error al insertar usuario:", err);
        res.status(500).json({ error: "No se pudo agregar el usuario" });
    }
});

// 📌 Servidor escuchando
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
