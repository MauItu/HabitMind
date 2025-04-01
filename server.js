require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Configurar conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Necesario para Neon
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos (HTML, CSS, JS)

// Ruta para inicio de sesión
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: "Inicio de sesión exitoso" });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});
