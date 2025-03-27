const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('../node_modules/bcryptjs/umd');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Registro de usuario
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insertar nuevo usuario
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING users_id, name, email, created',
      [name, email, hashedPassword]
    );
    
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    
    const user = userResult.rows[0];
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: user.users_id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.users_id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Crear un nuevo hábito
app.post('/api/habits', async (req, res) => {
  try {
    const { users_id, name, description, color, frequency } = req.body;
    
    const newHabit = await pool.query(
      'INSERT INTO habits (users_id, name, description, color, frequency) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [users_id, name, description, color, frequency]
    );
    
    res.status(201).json(newHabit.rows[0]);
  } catch (error) {
    console.error('Error creando hábito:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener hábitos de un usuario
app.get('/api/habits/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const habits = await pool.query(
      'SELECT * FROM habits WHERE users_id = $1 ORDER BY created DESC',
      [userId]
    );
    
    res.json(habits.rows);
  } catch (error) {
    console.error('Error obteniendo hábitos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Registrar seguimiento de hábito
app.post('/api/habit-tracking', async (req, res) => {
  try {
    const { habits_id, users_id, time_spent } = req.body;
    
    const newTracking = await pool.query(
      'INSERT INTO habit_tracking (habits_id, users_id, time_spent) VALUES ($1, $2, $3) RETURNING *',
      [habits_id, users_id, time_spent]
    );
    
    res.status(201).json(newTracking.rows[0]);
  } catch (error) {
    console.error('Error registrando seguimiento:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener historial de seguimiento de un hábito
app.get('/api/habit-tracking/:habitId', async (req, res) => {
  try {
    const { habitId } = req.params;
    
    const tracking = await pool.query(
      `SELECT ht.*, h.name as habit_name 
       FROM habit_tracking ht
       JOIN habits h ON ht.habits_id = h.habits_id
       WHERE ht.habits_id = $1 
       ORDER BY ht.date DESC`,
      [habitId]
    );
    
    res.json(tracking.rows);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = app;