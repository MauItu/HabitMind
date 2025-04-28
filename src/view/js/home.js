document.addEventListener("DOMContentLoaded", function() {//se refiere a que este codigo(la declaracion de los objetos) corre cuando carga el html
    // Referencias a elementos del DOM
    const habitsList = document.getElementById("habits-list");
    const addHabitBtn = document.getElementById("add-habit-btn");
    const habitModal = document.getElementById("habit-modal");
    const habitModalOverlay = document.getElementById("habit-modal-overlay");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const habitForm = document.getElementById("habit-form");
    const usernameElement = document.querySelector(".user-menu span");
    const logoutBtn = document.querySelector(".logout-btn");
    const emptyState = document.querySelector(".empty-state");
    const statsEmptyState = document.getElementById("stats-empty-state");
    const statsContent = document.getElementById("stats-content");
    const quotesEmptyState = document.getElementById("quotes-empty-state");
    const quoteContent = document.getElementById("quote-content");
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");

    // Verificar autenticación
    function checkAuthentication() {
        const token = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!token || !user) {
            // Si no hay token o usuario, mostrar error y redirigir
            showAuthError();
            return false;
        }

        // Configurar el nombre de usuario en la interfaz
        if (usernameElement && user.name) {
            usernameElement.textContent = user.name;
        }

        // Configurar axios para incluir el token en todas las solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    }

    // Mostrar error de autenticación y botón de redirección
    function showAuthError() {
        // Ocultar contenido principal
        document.querySelector(".dashboard").innerHTML = `
            <div class="auth-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>Acceso no autorizado</h2>
                <p>Debes iniciar sesión para acceder a esta página.</p>
                <button id="redirect-login" class="redirect-btn">Ir a iniciar sesión</button>
            </div>
        `;

        // Ocultar otros elementos que no deberían verse
        document.querySelector(".user-menu").style.display = "none";

        // Agregar evento al botón de redirección
        document.getElementById("redirect-login").addEventListener("click", function() {
            window.location.href = "../acceso/signIn.html";
        });
    }

    // Verificar token con el servidor
    async function verifyTokenWithServer() {
        try {
            const response = await axios.get("http://localhost:3000/auth/verify");
            return response.data.success;
        } catch (error) {
            console.error("Error al verificar token:", error);
            
            // Si hay error de autenticación, limpiar localStorage y mostrar error
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            showAuthError();
            return false;
        }
    }

    // Cargar hábitos del usuario
    async function loadHabits() {
        try {
            const response = await axios.get("http://localhost:3000/habits");
            
            if (response.data.habits.length === 0) {
                // Mostrar estado vacío
                if (emptyState) {
                    emptyState.style.display = "block";
                }
                
                // Ocultar estadísticas y mostrar mensajes de vacío
                if (statsEmptyState) statsEmptyState.style.display = "block";
                if (statsContent) statsContent.style.display = "none";
                
                return;
            }
            
            // Ocultar estado vacío
            if (emptyState) {
                emptyState.style.display = "none";
            }
            
            // Mostrar hábitos
            if (habitsList) {
                habitsList.innerHTML = "";  // Limpiar lista
                
                response.data.habits.forEach(habit => {
                    const habitElement = createHabitElement(habit);
                    habitsList.appendChild(habitElement);
                });
            }
            
            // Mostrar estadísticas si hay datos
            if (statsContent && statsEmptyState) {
                statsContent.style.display = "block";
                statsEmptyState.style.display = "none";
                updateHabitsChart(response.data.habits);
            }
            
            // Cargar frase motivacional
            loadRandomQuote();
            
        } catch (error) {
            console.error("Error al cargar hábitos:", error);
            
            // Si es error de autenticación, manejar adecuadamente
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                showAuthError();
            }
        }
    }

    // Crear elemento HTML para un hábito
    function createHabitElement(habit) {
        const habitElement = document.createElement("div");
        habitElement.className = `habit-item ${habit.color || "blue"}`;
        habitElement.setAttribute("data-id", habit.habits_id);
        
        habitElement.innerHTML = `
            <div class="habit-card" role="button" tabindex="0">
                <div class="habit-info">
                    <h3>${habit.name}</h3>
                    <p>${habit.description || ""}</p>
                </div>
                <div class="habit-actions">
                    <button class="edit-btn" title="Editar hábito">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button class="delete-btn" title="Eliminar hábito">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Agregar evento de clic al elemento completo
        const habitCard = habitElement.querySelector('.habit-card');
        habitCard.addEventListener("click", (e) => {
            // Evitar que el clic se propague si fue en los botones de acción
            if (!e.target.closest('.edit-btn') && !e.target.closest('.delete-btn')) {
                showTrackingModal(habit);
            }
        });
        
        // Agregar evento de teclado para accesibilidad
        habitCard.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                showTrackingModal(habit);
            }
        });
        
        // Mantener los eventos de los botones
        habitElement.querySelector(".edit-btn").addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que se dispare el evento del padre
            // Implementar edición
            console.log("Eliminar hábito:", habit);
        });
        
        habitElement.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que se dispare el evento del padre
            loadHabitHistory(habit.habits_id);
        });
        
        return habitElement;
    }

    // Modal para registrar tiempo
    function showTrackingModal(habit) {
        // Implementar el modal para registrar tiempo
        alert(`Registrar tiempo para: ${habit.name}`);
        // Aquí implementarías un modal similar al de creación de hábitos
    }

    // Cargar historial de un hábito
    async function loadHabitHistory(habitId) {
        try {
            const response = await axios.get(`http://localhost:3000/habits/${habitId}/history`);
            // Implementar visualización del historial
            alert(`Historial cargado: ${response.data.history.length} registros`);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        }
    }

    // Actualizar gráfico de hábitos
    function updateHabitsChart(habits) {
        // Esta es una implementación básica, puedes mejorarla según tus necesidades
        const ctx = document.getElementById('habits-chart').getContext('2d');
        
        // Datos de ejemplo (reemplazar con datos reales)
        const labels = habits.map(habit => habit.name);
        const data = habits.map((_, index) => Math.floor(Math.random() * 10) + 1); // Datos aleatorios para ejemplo
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tiempo dedicado (horas)',
                    data: data,
                    backgroundColor: habits.map(habit => {
                        const colors = {
                            'blue': 'rgba(54, 162, 235, 0.7)',
                            'green': 'rgba(75, 192, 192, 0.7)',
                            'purple': 'rgba(153, 102, 255, 0.7)',
                            'red': 'rgba(255, 99, 132, 0.7)'
                        };
                        return colors[habit.color] || colors.blue;
                    }),
                    borderColor: habits.map(habit => {
                        const colors = {
                            'blue': 'rgb(54, 162, 235)',
                            'green': 'rgb(75, 192, 192)',
                            'purple': 'rgb(153, 102, 255)',
                            'red': 'rgb(255, 99, 132)'
                        };
                        return colors[habit.color] || colors.blue;
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Cargar frase motivacional aleatoria
    function loadRandomQuote() {
        const quotes = [
            { text: "Los pequeños hábitos generan resultados extraordinarios.", author: "James Clear" },
            { text: "No necesitas ser perfecto. Solo necesitas ser mejor que ayer.", author: "Anónimo" },
            { text: "La disciplina es elegir entre lo que quieres ahora y lo que quieres más.", author: "Abraham Lincoln" },
            { text: "El éxito no es un accidente. Es el resultado de tus hábitos diarios.", author: "James Clear" },
            { text: "Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto sino un hábito.", author: "Aristóteles" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        if (quoteContent && quotesEmptyState) {
            quoteContent.style.display = "block";
            quotesEmptyState.style.display = "none";
            
            if (quoteText) quoteText.textContent = randomQuote.text;
            if (quoteAuthor) quoteAuthor.textContent = `- ${randomQuote.author}`;
        }
    }

    // Eventos para el modal de creación de hábitos
    if (addHabitBtn) {
        addHabitBtn.addEventListener("click", function() {
            habitModalOverlay.classList.add("active");
            habitModal.classList.add("active");
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function() {
            habitModalOverlay.classList.remove("active");
            habitModal.classList.remove("active");
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            habitModalOverlay.classList.remove("active");
            habitModal.classList.remove("active");
        });
    }

    // Cerrar modal al hacer clic en el overlay
    if (habitModalOverlay) {
        habitModalOverlay.addEventListener("click", function(e) {
            if (e.target === habitModalOverlay) {
                habitModalOverlay.classList.remove("active");
                habitModal.classList.remove("active");
            }
        });
    }

    // Manejar envío del formulario de hábitos
    if (habitForm) {
        habitForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const name = document.getElementById("habit-name").value;
            const description = document.getElementById("habit-description").value;
            const colorInput = document.querySelector('input[name="habit-color"]:checked');
            const color = colorInput ? colorInput.value : "blue";
            
            try {
                const response = await axios.post("http://localhost:3000/habits", {
                    name,
                    description,
                    color,
                    frequency: "Diario" // Valor por defecto
                });
                
                // Cerrar modal
                habitModalOverlay.classList.remove("active");
                habitModal.classList.remove("active");
                
                // Limpiar formulario
                habitForm.reset();
                
                // Recargar hábitos
                loadHabits();
                
            } catch (error) {
                console.error("Error al crear hábito:", error);
                alert("Error al crear el hábito. Por favor intenta de nuevo.");
            }
        });
    }

    // Manejar cierre de sesión
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            window.location.href = "../acceso/signIn.html";
        });
    }

    // Inicialización
    if (checkAuthentication()) {
        // Verificar token con el servidor
        verifyTokenWithServer().then(isValid => {
            if (isValid) {
                // Cargar hábitos si el token es válido
                loadHabits();
            }
        });
    }
});