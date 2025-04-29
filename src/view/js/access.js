document.addEventListener("DOMContentLoaded", function () {
    const signinForm = document.getElementById("signin-form");
    const signupForm = document.getElementById("signup-form");
  
    function showError(element, message) {
      element.textContent = message;
      element.classList.remove("hidden");
      setTimeout(() => element.classList.add("hidden"), 3000);
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
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            window.location.href = "../home/home.html";
          }
        } catch (error) {
          const message = error.response?.data?.message || "Error de conexión con el servidor";
          showError(errorMessage, message);
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
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            window.location.href = "../home/home.html";
          }
        } catch (error) {
          const message = error.response?.data?.message || "Error de conexión con el servidor";
          showError(errorMessage, message);
        }
      });
    }
  });