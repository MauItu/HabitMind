document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signin-form");

  form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorMessage = document.getElementById("error-message");

      try {
          const response = await axios.post("http://localhost:3000/login", {
              email: email,
              password: password
          });

          if (response.data.success) {
              window.location.href = "../home/home.html";
          } else {
              errorMessage.textContent = "Credenciales incorrectas.";
              errorMessage.classList.remove("hidden");
          }
      } catch (error) {
          console.error("Error al iniciar sesión:", error);
          errorMessage.textContent = "Error de conexión con el servidor.";
          errorMessage.classList.remove("hidden");
      }
  });
});
