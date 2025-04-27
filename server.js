require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken"); // Necesitarás instalar jsonwebtoken
const bcrypt = require("bcrypt"); // Necesitarás instalar bcrypt

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_temporal"; // Idealmente en .env

// Configurar conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Necesario para Neon
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: "Token requerido" });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
};

// Ruta para inicio de sesión
app.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const user = result.rows[0];
    
    // Para este ejemplo usamos una comparación directa, pero deberías usar bcrypt.compare
    // si las contraseñas están hasheadas (recomendado)
    const passwordMatch = password === user.password;
    // Si usas bcrypt, sería así:
    // const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.users_id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      message: "Inicio de sesión exitoso", 
      token,
      user: {
        id: user.users_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Ruta para registro
app.post("/signUp", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // En un entorno de producción, deberías hashear la contraseña:
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING users_id, name, email",
      [username, email, password] // Reemplaza password por hashedPassword si usas bcrypt
    );

    // Generar token JWT para el nuevo usuario
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.users_id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    //verificar si el token se genera correctamente
    res.json({ 
      success: true, 
      message: "Registro exitoso", 
      token,
      user: {
        id: user.users_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error al registrar:", error);
    
    // Manejo específico para error de email duplicado
    if (error.code === '23505') { // Código de PostgreSQL para violación de restricción única
      return res.status(400).json({ success: false, message: "El email ya está registrado" });
    }
    
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// ---- NUEVAS RUTAS PARA GESTIÓN DE HÁBITOS ----

// Obtener todos los hábitos del usuario
app.get("/habits", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM habits WHERE users_id = $1 ORDER BY created DESC",
      [req.user.id]
    );
    
    res.json({ success: true, habits: result.rows });
  } catch (error) {
    console.error("Error al obtener hábitos:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Crear un nuevo hábito
app.post("/habits", authenticateToken, async (req, res) => {
  const { name, description, color, frequency } = req.body;
  
  try {
    const result = await pool.query(
      "INSERT INTO habits (users_id, name, description, color, frequency) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, name, description, color, frequency]
    );
    
    res.status(201).json({ success: true, habit: result.rows[0] });
  } catch (error) {
    console.error("Error al crear hábito:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Registrar seguimiento de un hábito
app.post("/habits/:habitId/track", authenticateToken, async (req, res) => {
  const { habitId } = req.params;
  const { time_spent } = req.body;
  
  try {
    // Verificar que el hábito pertenezca al usuario
    const habitCheck = await pool.query(
      "SELECT * FROM habits WHERE habits_id = $1 AND users_id = $2",
      [habitId, req.user.id]
    );
    
    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Hábito no encontrado" });
    }
    
    // Registrar seguimiento
    const result = await pool.query(
      "INSERT INTO habit_tracking (habits_id, users_id, time_spent) VALUES ($1, $2, $3) RETURNING *",
      [habitId, req.user.id, time_spent]
    );
    
    res.status(201).json({ success: true, tracking: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar seguimiento:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Obtener el historial de seguimiento de un hábito
app.get("/habits/:habitId/history", authenticateToken, async (req, res) => {
  const { habitId } = req.params;
  
  try {
    const result = await pool.query(
      "SELECT * FROM habit_tracking WHERE habits_id = $1 AND users_id = $2 ORDER BY date DESC",
      [habitId, req.user.id]
    );
    
    res.json({ success: true, history: result.rows });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Ruta para verificar autenticación (útil para cliente)
app.get("/auth/verify", authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});