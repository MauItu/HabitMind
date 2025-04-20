// Login
document.getElementById("signin-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signIn", { email, password });
      if (response.data.success) window.location.href = "http://localhost:3000/home";
    } catch (error) {
      showError(error.response?.data?.message || "Error de conexión");
    }
  });
  
  // Registro
  document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
  
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signUp", {
        username,
        email,
        password,
        confirmPassword
      });
      if (response.data.success) window.location.href = "http://localhost:3000/home";
    } catch (error) {
      showError(error.response?.data?.message || "Error de conexión");
    }
  });
  
  // Mostrar errores
  function showError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    setTimeout(() => errorElement.classList.add("hidden"), 5000);
  }