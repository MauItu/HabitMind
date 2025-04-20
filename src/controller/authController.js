const User = require("../model/access/userModel");

class AuthController {
  static async signIn(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" });
      }
      res.json({ success: true, message: "Login exitoso" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error del servidor" });
    }
  }

  static async signUp(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    // Validaciones
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Las contraseñas no coinciden" });
    }

    try {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: "El email ya está registrado" });
      }

      const newUser = await User.create(username, email, password);
      res.json({ success: true, message: "Registro exitoso", user: newUser });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al registrar" });
    }
  }
}

module.exports = AuthController;