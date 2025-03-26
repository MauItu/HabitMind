document.addEventListener("DOMContentLoaded", () => {
    // Verificar si localStorage está disponible
    let storageAvailable = false
    const memoryStorage = { users: [] }
  
    // Comprobar si localStorage está disponible
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      storageAvailable = true
      console.log("localStorage está disponible")
  
      // Inicializar localStorage si no existe
      if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]))
      }
    } catch (e) {
      console.log("localStorage no está disponible, usando almacenamiento en memoria")
      storageAvailable = false
    }
  
    // Función para obtener usuarios
    function getUsers() {
      if (storageAvailable) {
        return JSON.parse(localStorage.getItem("users") || "[]")
      } else {
        return memoryStorage.users
      }
    }
  
    // Función para guardar usuarios
    function saveUsers(users) {
      if (storageAvailable) {
        localStorage.setItem("users", JSON.stringify(users))
      } else {
        memoryStorage.users = users
      }
    }
  
    // Elementos comunes
    const connectionError = document.getElementById("connection-error")
    const goBackBtn = document.getElementById("go-back-btn")
    const errorMessage = document.getElementById("error-message")
  
    // Manejar el botón "go back" en el error de conexión
    if (goBackBtn) {
      goBackBtn.addEventListener("click", () => {
        connectionError.classList.add("hidden")
      })
    }
  
    // Formulario de registro
    const signupForm = document.getElementById("signup-form")
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Obtener valores del formulario
        const email = document.getElementById("email").value.trim()
        const password = document.getElementById("password").value
        const confirmPassword = document.getElementById("confirm-password").value
        const username = document.getElementById("username").value.trim()
  
        // Validación básica
        if (!email || !password || !confirmPassword || !username) {
          showError("Todos los campos son obligatorios", "error")
          return
        }
  
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          showError("Por favor, introduce un email válido", "error")
          return
        }
  
        if (password !== confirmPassword) {
          showError("Las contraseñas no coinciden", "error")
          return
        }
  
        // Validar longitud de contraseña
        if (password.length < 6) {
          showError("La contraseña debe tener al menos 6 caracteres", "error")
          return
        }
  
        // Simular registro
        try {
          // Simular un error de conexión aleatoriamente (20% de probabilidad)
          if (Math.random() < 0.2) {
            showConnectionError()
            return
          }
  
          // Obtener usuarios
          const users = getUsers()
  
          // Verificar si el email ya existe
          if (users.some((user) => user.email === email)) {
            showError("Este email ya está registrado", "error")
            return
          }
  
          // Añadir nuevo usuario
          users.push({
            email: email,
            password: password,
            username: username,
          })
  
          // Guardar usuarios
          saveUsers(users)
          console.log("Usuario registrado:", email)
  
          // Redirigir a inicio de sesión
          window.location.href = "signin.html"
        } catch (err) {
          console.error("Error al registrar:", err)
          showConnectionError()
        }
      })
    }
  
    // Formulario de inicio de sesión
    const signinForm = document.getElementById("signin-form")
    if (signinForm) {
      const emailInput = document.getElementById("email")
      const passwordInput = document.getElementById("password")
  
      // Limpiar errores al cambiar los campos
      emailInput.addEventListener("input", () => {
        emailInput.classList.remove("error")
        passwordInput.classList.remove("error")
        errorMessage.classList.add("hidden")
      })
  
      passwordInput.addEventListener("input", () => {
        emailInput.classList.remove("error")
        passwordInput.classList.remove("error")
        errorMessage.classList.add("hidden")
      })
  
      signinForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Obtener valores del formulario
        const email = emailInput.value.trim()
        const password = passwordInput.value
  
        // Validación básica
        if (!email || !password) {
          showError("Todos los campos son obligatorios", "error")
          return
        }
  
        try {
          // Simular un error de conexión aleatoriamente (10% de probabilidad)
          if (Math.random() < 0.1) {
            showConnectionError()
            return
          }
  
          // Obtener usuarios
          const users = getUsers()
          console.log("Usuarios disponibles:", users.length)
  
          // Verificar credenciales
          const user = users.find((u) => u.email === email)
  
          if (!user) {
            showError("usuario no registrado", "info")
            return
          }
  
          if (user.password !== password) {
            emailInput.classList.add("error")
            passwordInput.classList.add("error")
            showError("email o password incorrectos", "error")
            return
          }
  
          // En una aplicación real, aquí se establecería una sesión
          console.log("Inicio de sesión exitoso:", email)
          alert("Inicio de sesión exitoso!")
  
          // Redirigir a una página de bienvenida (opcional)
          // window.location.href = "welcome.html";
        } catch (err) {
          console.error("Error al iniciar sesión:", err)
          showConnectionError()
        }
      })
    }
  
    // Función para mostrar errores
    function showError(message, type) {
      if (errorMessage) {
        errorMessage.textContent = message
        errorMessage.classList.remove("hidden", "error", "info")
        errorMessage.classList.add(type)
      }
    }
  
    // Función para mostrar error de conexión
    function showConnectionError() {
      if (connectionError) {
        connectionError.classList.remove("hidden")
      }
    }
  })
  
  
  