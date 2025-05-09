document.addEventListener("DOMContentLoaded", function() {
    /**
     * SECCIÓN 1: DECLARACIÓN DE VARIABLES
     * Referencias a elementos del DOM para manipular la interfaz
     */
    // Referencias principales del dashboard
    const habitsList = document.getElementById("habits-list");
    const emptyState = document.querySelector(".empty-state");
    const usernameElement = document.querySelector(".user-menu span");
    const logoutBtn = document.querySelector(".logout-btn");
    
    // Referencias para el modal de creación de hábitos
    const addHabitBtn = document.getElementById("add-habit-btn");
    const habitModal = document.getElementById("habit-modal");
    const habitModalOverlay = document.getElementById("habit-modal-overlay");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const habitForm = document.getElementById("habit-form");
    
    // Referencias para las estadísticas y citas motivacionales
    const statsEmptyState = document.getElementById("stats-empty-state");
    const statsContent = document.getElementById("stats-content");
    const quotesEmptyState = document.getElementById("quotes-empty-state");
    const quoteContent = document.getElementById("quote-content");
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    
    // Referencias para el modal de eliminación
    const deleteModalOverlay = document.createElement("div");
    deleteModalOverlay.className = "modal-overlay";
    deleteModalOverlay.id = "delete-modal-overlay";
    
    const deleteModal = document.createElement("div");
    deleteModal.className = "modal";
    deleteModal.id = "delete-modal";
    
    /**
     * SECCIÓN 2: AUTENTICACIÓN Y VERIFICACIÓN
     * Funciones para manejar la autenticación del usuario
     */
    
    /**
     * Verifica si el usuario está autenticado comprobando datos en localStorage
     * @returns {boolean} - True si el usuario tiene token válido, false en caso contrario
     */
    function checkAuthentication() {
        const token = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!token || !user) {
            showAuthError();
            return false;
        }

        // Configura nombre de usuario en la interfaz
        if (usernameElement && user.name) {
            usernameElement.textContent = user.name;
        }

        // Configura axios para incluir el token en todas las solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    }

    /**
     * Muestra mensaje de error cuando el usuario no está autenticado
     * Reemplaza el contenido de la dashboard con un mensaje de error
     */
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

        // Ocultar menú de usuario
        document.querySelector(".user-menu").style.display = "none";

        // Agregar evento al botón de redirección
        document.getElementById("redirect-login").addEventListener("click", function() {
            window.location.href = "../acceso/signIn.html";
        });
    }

    /**
     * Verifica el token con el servidor para asegurar que es válido
     * @returns {Promise<boolean>} - Promise que resuelve a true si el token es válido
     */
    async function verifyTokenWithServer() {
        try {
            const response = await axios.get("http://localhost:3000/auth/verify");
            return response.data.success;
        } catch (error) {
            console.error("Error al verificar token:", error);
            
            // Limpia localStorage y muestra error si hay problemas de autenticación
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            showAuthError();
            return false;
        }
    }

    /**
     * SECCIÓN 3: GESTIÓN DE HÁBITOS
     * Funciones para cargar, crear, mostrar y eliminar hábitos
     */
    
    /**
     * Carga los hábitos del usuario desde el servidor
     * Actualiza la UI según los datos recibidos
     */
    async function loadHabits() {
        try {
            const response = await axios.get("http://localhost:3000/habits");
            
            // Manejar caso cuando no hay hábitos
            if (response.data.habits.length === 0) {
                if (emptyState) {
                    emptyState.style.display = "block";
                }
                
                // Ocultar estadísticas y mostrar mensajes de vacío
                if (statsEmptyState) statsEmptyState.style.display = "block";
                if (statsContent) statsContent.style.display = "none";
                
                return;
            }
            
            // Ocultar estado vacío si hay hábitos
            if (emptyState) {
                emptyState.style.display = "none";
            }
            
            // Mostrar hábitos en la lista
            if (habitsList) {
                habitsList.innerHTML = "";  // Limpiar lista existente
                
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
            
            // Verificar si es error de autenticación
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                showAuthError();
            }
        }
    }

    /**
     * Crea un elemento HTML para un hábito individual
     * @param {Object} habit - Objeto con los datos del hábito
     * @returns {HTMLElement} - Elemento div que representa el hábito
     */
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
        
        // Agregar evento de clic para mostrar modal de registro de tiempo
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
        
        // Eventos para los botones de editar y eliminar
        habitElement.querySelector(".edit-btn").addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que se dispare el evento del padre
            // Implementar edición
            console.log("editar hábito:", habit);
            //TODO: ACA VA EL CODIGO O LLAMADO DE LA FUNCION PARA EDITAR EL HABITO, DE MOMENTO SOLO MUESTRA LOS ATRIBUTOS
        });
        
        habitElement.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que se dispare el evento del padre
            showDeleteConfirmationModal(habit);
        });
        
        return habitElement;
    }

    /**
     * Muestra un modal para registrar tiempo dedicado a un hábito
     * @param {Object} habit - Objeto con los atributos del hábito
     */
    function showTrackingModal(habit) {
        //TODO:Implementar el modal para registrar tiempo
        alert(`Registrar tiempo para: ${habit.name}`);
        //TODO: Aquí implementarías un modal similar al de creación de hábitos
    }

    /**
     * Muestra un modal de confirmación antes de eliminar un hábito
     * @param {Object} habit - Objeto con los datos del hábito
     */
    function showDeleteConfirmationModal(habit) {
        // Crear contenido del modal para elimina
        deleteModal.innerHTML = `
            <div class="modal-header">
                <h3>Confirmar eliminación</h3>
                <button class="close-modal-btn" id="close-delete-modal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>¿Estás seguro que deseas eliminar el hábito "${habit.name}"?</p>
                <p class="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" id="cancel-delete-btn">Cancelar</button>
                <button class="confirm-delete-btn" id="confirm-delete-btn">Eliminar</button>
            </div>
        `;
        
        // Agregar modal al DOM si aún no existe
        if (!document.getElementById("delete-modal")) {
            deleteModalOverlay.appendChild(deleteModal);
            document.body.appendChild(deleteModalOverlay);
        }
        
        // Mostrar modal
        deleteModalOverlay.classList.add("active");
        deleteModal.classList.add("active");
        
        // Eventos para el modal
        const closeDeleteModalBtn = document.getElementById("close-delete-modal");
        const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
        const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
        
        // Función para cerrar el modal
        const closeDeleteModal = () => {
            deleteModalOverlay.classList.remove("active");
            deleteModal.classList.remove("active");
        };
        
        // Asignar eventos
        closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
        cancelDeleteBtn.addEventListener("click", closeDeleteModal);
        
        // Evento para eliminar el hábito
        confirmDeleteBtn.addEventListener("click", () => {
            deleteHabit(habit.habits_id);
            closeDeleteModal();
        });
        
        // Cerrar modal al hacer clic en el overlay
        deleteModalOverlay.addEventListener("click", (e) => {
            if (e.target === deleteModalOverlay) {
                closeDeleteModal();
            }
        });
    }

    /**
     * Elimina un hábito del servidor mediante una petición DELETE
     * @param {number} habitId - ID del hábito a eliminar
     */
    async function deleteHabit(habitId) {
        try {
            const response = await axios.delete(`http://localhost:3000/habits/${habitId}`);
            
            if (response.status === 200) {
                console.log("Hábito eliminado correctamente");
                // Recargar la lista de hábitos
                loadHabits();
            }   
        } catch (error) {
            console.error("Error al eliminar hábito:", error);
            alert("No se pudo eliminar el hábito. Por favor intenta de nuevo.");
        }
    }

    /**
     * SECCIÓN 4: ESTADÍSTICAS Y VISUALIZACIÓN DE DATOS
     * Funciones para mostrar estadísticas y gráficos de hábitos
     */
    
    /**
     * Actualiza el gráfico de hábitos con los datos actuales
     * @param {Array} habits - Array con los hábitos del usuario
     */
    function updateHabitsChart(habits) {
        const ctx = document.getElementById('habits-chart').getContext('2d');
        
        // Preparar datos para el gráfico
        const labels = habits.map(habit => habit.name);
        const data = habits.map((_, index) => Math.floor(Math.random() * 10) + 1); // Datos aleatorios (reemplazar con datos reales)
        
        // Mapa de colores para las barras del gráfico
        const colorMap = {
            'blue': {
                bg: 'rgba(54, 162, 235, 0.7)',
                border: 'rgb(54, 162, 235)'
            },
            'green': {
                bg: 'rgba(75, 192, 192, 0.7)',
                border: 'rgb(75, 192, 192)'
            },
            'purple': {
                bg: 'rgba(153, 102, 255, 0.7)',
                border: 'rgb(153, 102, 255)'
            },
            'red': {
                bg: 'rgba(255, 99, 132, 0.7)',
                border: 'rgb(255, 99, 132)'
            }
        };
        
        // Crear gráfico
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tiempo dedicado (horas)',
                    data: data,
                    backgroundColor: habits.map(habit => {
                        return colorMap[habit.color]?.bg || colorMap.blue.bg;
                    }),
                    borderColor: habits.map(habit => {
                        return colorMap[habit.color]?.border || colorMap.blue.border;
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

    /**
     * Carga una frase motivacional aleatoria en la UI
     */
    async function loadRandomQuote() {
        try {
            const response = await axios.get("http://localhost:3000/quotes");
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
    
            const quote = response.data.quote;
    
            // Actualizar la UI con la cita
            if (quoteContent && quotesEmptyState) {
                quoteContent.style.display = "block";
                quotesEmptyState.style.display = "none";
                
                if (quoteText) quoteText.textContent = `${quote.contenido}`;
                if (quoteAuthor) quoteAuthor.textContent = `- ${quote.autor}`;
            }
    
        } catch (error) {
            console.error("Error al cargar citas:", error);
            
            // Mostrar estado vacío si hay error
            if (quoteContent) quoteContent.style.display = "none";
            if (quotesEmptyState) quotesEmptyState.style.display = "block";
            
            // Actualizar mensaje de error si existe el elemento
            const errorMessage = quotesEmptyState?.querySelector('p');
            if (errorMessage) {
                errorMessage.textContent = "No se pudieron cargar las frases motivacionales.";
            }
        }
    }

    /**
     * SECCIÓN 5: CONFIGURACIÓN DE EVENTOS UI
     * Configuración de eventos para interactividad de la interfaz
     */
    
    /**
     * Configura los eventos para el modal de creación de hábitos
     */
    function setupHabitModalEvents() {
        // Abrir modal al hacer clic en el botón "Agregar hábito"
        if (addHabitBtn) {
            addHabitBtn.addEventListener("click", function() {
                habitModalOverlay.classList.add("active");
                habitModal.classList.add("active");
            });
        }
    
        // Cerrar modal con el botón X
        if (closeModalBtn) {
            closeModalBtn.addEventListener("click", function() {
                habitModalOverlay.classList.remove("active");
                habitModal.classList.remove("active");
            });
        }
    
        // Cerrar modal con el botón Cancelar
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
    }
    
    /**
     * Configura el evento de envío del formulario de creación de hábitos
     */
    function setupHabitFormSubmit() {
        if (habitForm) {
            habitForm.addEventListener("submit", async function(e) {
                e.preventDefault();
                
                // Obtener valores del formulario
                const name = document.getElementById("habit-name").value;
                const description = document.getElementById("habit-description").value;
                const colorInput = document.querySelector('input[name="habit-color"]:checked');
                const color = colorInput ? colorInput.value : "blue";
                
                try {
                    // Enviar datos al servidor
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
    }
    
    /**
     * Configura el evento de cierre de sesión
     */
    function setupLogoutEvent() {
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function() {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                window.location.href = "../acceso/signIn.html";
            });
        }
    }

    /**
     * SECCIÓN 6: INICIALIZACIÓN
     * Inicialización de la aplicación y configuración inicial
     */
    
    /**
     * Función principal de inicialización
     * Configura todos los eventos y verifica autenticación
     */
    function init() {
        // Verificar autenticación
        if (checkAuthentication()) {
            // Verificar token con el servidor
            verifyTokenWithServer().then(isValid => {
                if (isValid) {
                    // Cargar hábitos si el token es válido
                    loadHabits();
                }
            });
        }
        
        // Configurar eventos UI
        setupHabitModalEvents();
        setupHabitFormSubmit();
        setupLogoutEvent();
        
        // Agregar estilos CSS para el modal de eliminación
        addModalStyles();
    }
    
    /**
     * Agrega estilos CSS necesarios para el modal de eliminación
     */
    function addModalStyles() {
        // Verificar si ya existe el estilo
        if (!document.getElementById("delete-modal-styles")) {
            const styles = document.createElement("style");
            styles.id = "delete-modal-styles";
            styles.textContent = `
                .warning-text {
                    color: #e53935;
                    font-weight: 500;
                }
                
                .confirm-delete-btn {
                    background-color: #e53935;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .confirm-delete-btn:hover {
                    background-color: #c62828;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // Iniciar la aplicación
    init();
});