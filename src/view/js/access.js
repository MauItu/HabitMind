document.addEventListener("DOMContentLoaded", function () {
    const signinForm = document.getElementById("signin-form");
    const signupForm = document.getElementById("signup-form");
  
    // Verificar si hay un token almacenado al cargar la página
    const token = localStorage.getItem("authToken");
    if (token) {
      // Si hay un token, verificarlo con el servidor
      verifyToken(token);
    }
  
    if (signinForm) {
      signinForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");
  
        try {
          const response = await axios.post("http://localhost:3000/signIn", {
            email: email,
            password: password
          });
  
          if (response.data.success) {
            // Guardar el token en localStorage
            localStorage.setItem("authToken", response.data.token);
            // Guardar información básica del usuario
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // Redireccionar al dashboard
            window.location.href = "../home/home.html";
          } else {
            errorMessage.textContent = "Error al iniciar sesión.";
            errorMessage.classList.remove("hidden");
          }
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          if (error.response && error.response.status === 401) {
            errorMessage.textContent = "Credenciales incorrectas.";
          } else {
            errorMessage.textContent = "Error de conexión con el servidor.";
          }
          errorMessage.classList.remove("hidden");
        }
      });
    }
  
    if (signupForm) {
      signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");
  
        try {
          const response = await axios.post("http://localhost:3000/signUp", {
            username: username,
            email: email,
            password: password
          });
  
          if (response.data.success) {
            // Guardar el token en localStorage
            localStorage.setItem("authToken", response.data.token);
            // Guardar información básica del usuario
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // Redireccionar al dashboard
            window.location.href = "../home/home.html";
          } else {
            errorMessage.textContent = "Error al crear la cuenta.";
            errorMessage.classList.remove("hidden");
          }
        } catch (error) {
          console.error("Error al crear la cuenta:", error);
          if (error.response && error.response.status === 400) {
            errorMessage.textContent = error.response.data.message || "Error al crear la cuenta.";
          } else {
            errorMessage.textContent = "Error de conexión con el servidor.";
          }
          errorMessage.classList.remove("hidden");
        }
      });
    }
  
    // Función para verificar el token con el servidor
    async function verifyToken(token) {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (response.data.success) {
          // Si estamos en la página de login/registro y el token es válido, redirigir al dashboard
          if (window.location.pathname.includes("login.html") || 
              window.location.pathname.includes("register.html") || 
              window.location.pathname === "/") {
            window.location.href = "../home/home.html";
          }
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        // Si el token no es válido, eliminarlo
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        
        // Si no estamos en la página de login y el token es inválido, redirigir al login
        if (!window.location.pathname.includes("login.html") && 
            !window.location.pathname.includes("register.html")) {
          window.location.href = "../html/acceso/signIn.html";
        }
      }
    }
  });