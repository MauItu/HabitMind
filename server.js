require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("./db");

const app = express();
app.use(express.json()); // Soporte para JSON en peticiones
app.use(cors()); // Permitir conexiones desde el frontend

// 📌 Ruta para obtener todos los usuarios
app.get("/users", async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`; // Cambia 'users' por el nombre de tu tabla
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo datos" });
  }
});

// 📌 Ruta para insertar un usuario
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await sql`
      INSERT INTO users (name, email) VALUES (${name}, ${email}) RETURNING *
    `;
    res.json(result[0]); // Devuelve el usuario insertado
  } catch (error) {
    res.status(500).json({ error: "Error al insertar usuario" });
  }
});

// 📌 Ruta para actualizar un usuario por ID
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await sql`
      UPDATE users SET name = ${name}, email = ${email} WHERE id = ${id} RETURNING *
    `;
    res.json(result[0]); // Devuelve el usuario actualizado
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// 📌 Ruta para eliminar un usuario por ID
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
