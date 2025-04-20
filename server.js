require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/api/auth", authRoutes);

// Servir vistas
app.get("/signIn", (req, res) => {
  res.sendFile(path.join(__dirname, "views/auth/signIn.html"));
});

app.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, "views/auth/signUp.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});

// Servir home.html desde la carpeta public
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
// En server.js:
app.use(express.static(path.join(__dirname, "public")));