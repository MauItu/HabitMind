document.addEventListener("DOMContentLoaded", function () {
  const signinForm = document.getElementById("signin-form");
  const signupForm = document.getElementById("signup-form");

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
                  window.location.href = "../home/home.html";
              } else {
                  errorMessage.textContent = "Error al crear la cuenta.";
                  errorMessage.classList.remove("hidden");
              }
          } catch (error) {
              console.error("Error al crear la cuenta:", error);
              errorMessage.textContent = "Error de conexión con el servidor.";
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
                    window.location.href = "../home/home.html";
                } else {
                    errorMessage.textContent = "Error al crear la cuenta.";
                    errorMessage.classList.remove("hidden");
                }
            } catch (error) {
                console.error("Error al crear la cuenta:", error);
                errorMessage.textContent = "Error de conexión con el servidor.";
                errorMessage.classList.remove("hidden");
            }
        });
  }
});
