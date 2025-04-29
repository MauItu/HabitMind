document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // VERIFICACIÓN DE AUTENTICACIÓN Y USUARIO
    // =============================================
    const userData = JSON.parse(localStorage.getItem('user'));
    const authToken = localStorage.getItem('authToken');
    
    if (!userData || !authToken) {
        window.location.href = "../access/access.html";
        return;
    }

    // Mostrar nombre del usuario en el header
    const userMenuElement = document.querySelector('.user-menu span');
    if (userMenuElement) {
        userMenuElement.textContent = userData.name || userData.username || "Usuario";
    }

    // Configurar logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = "../access/access.html";
        });
    }

    // Configurar axios para enviar el token
    if (typeof axios !== 'undefined') {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }

    // =============================================
    // TU CÓDIGO ORIGINAL (con pequeñas mejoras)
    // =============================================
    
    // Referencias a elementos del DOM
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitModalOverlay = document.getElementById('habit-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const habitForm = document.getElementById('habit-form');
    const habitsList = document.getElementById('habits-list');
    const statsEmptyState = document.getElementById('stats-empty-state');
    const statsContent = document.getElementById('stats-content');
    const weeklyBtn = document.getElementById('weekly-btn');
    const totalBtn = document.getElementById('total-btn');
    
    // Funciones para el modal
    function openModal() {
        habitModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const animatedElements = habitModalOverlay.querySelectorAll('.slide-in');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = null;
        });
    }
    
    function closeModal() {
        habitModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        habitForm.reset();
    }
    
    // Event listeners para el modal
    addHabitBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    habitModalOverlay.addEventListener('click', function(e) {
        if (e.target === habitModalOverlay) {
            closeModal();
        }
    });
    
    // Manejar envío del formulario (ahora con conexión al backend)
    habitForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const habitData = {
            name: document.getElementById('habit-name').value,
            description: document.getElementById('habit-description').value,
            color: document.querySelector('input[name="habit-color"]:checked').value,
            userId: userData.id // Añadimos el ID del usuario
        };
        
        try {
            const response = await axios.post('http://localhost:3000/habits', habitData);
            
            if (response.data.success) {
                createHabitElement(response.data.habit);
                closeModal();
                
                // Actualizar estadísticas si es necesario
                if (statsContent.style.display === 'block') {
                    updateChart();
                }
            }
        } catch (error) {
            console.error('Error al crear hábito:', error);
            alert('Error al crear el hábito. Por favor intente nuevamente.');
        }
    });
    
    // Función para crear elemento visual de hábito (ahora con datos reales)
    function createHabitElement(habit) {
        const emptyState = habitsList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.dataset.id = habit.id;
        habitItem.style.opacity = '0';
        habitItem.innerHTML = `
            <span class="habit-name">${habit.name}</span>
            <div class="habit-actions">
                <button class="habit-edit"><i class="fas fa-edit"></i></button>
                <button class="habit-delete"><i class="fas fa-trash"></i></button>
                <div class="habit-streak">
                    <i class="fas fa-fire"></i>
                    <span>${habit.streak || 0}</span>
                </div>
            </div>
        `;
        
        habitItem.style.borderLeft = `4px solid var(--habit-${habit.color})`;
        habitsList.appendChild(habitItem);
        
        setTimeout(() => {
            habitItem.style.opacity = '1';
            habitItem.style.animation = 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }, 10);
        
        // Configurar eventos para los botones
        habitItem.querySelector('.habit-edit').addEventListener('click', () => editHabit(habit.id));
        habitItem.querySelector('.habit-delete').addEventListener('click', () => deleteHabit(habit.id));
    }
    
    // Función para editar hábito
    async function editHabit(habitId) {
        try {
            const response = await axios.get(`http://localhost:3000/habits/${habitId}`);
            const habit = response.data;
            
            // Llenar el formulario modal con los datos del hábito
            document.getElementById('habit-name').value = habit.name;
            document.getElementById('habit-description').value = habit.description;
            document.getElementById(`color-${habit.color}`).checked = true;
            
            // Cambiar el texto del modal para edición
            document.querySelector('#habit-modal h2').textContent = 'Editar Hábito';
            
            // Mostrar modal
            openModal();
            
            // Cambiar el evento de submit para edición
            habitForm.onsubmit = async function(e) {
                e.preventDefault();
                
                const updatedData = {
                    name: document.getElementById('habit-name').value,
                    description: document.getElementById('habit-description').value,
                    color: document.querySelector('input[name="habit-color"]:checked').value
                };
                
                const updateResponse = await axios.put(`http://localhost:3000/habits/${habitId}`, updatedData);
                
                if (updateResponse.data.success) {
                    // Actualizar el hábito en la lista
                    const habitElement = document.querySelector(`.habit-item[data-id="${habitId}"]`);
                    if (habitElement) {
                        habitElement.querySelector('.habit-name').textContent = updatedData.name;
                        habitElement.style.borderLeft = `4px solid var(--habit-${updatedData.color})`;
                    }
                    closeModal();
                }
            };
        } catch (error) {
            console.error('Error al editar hábito:', error);
        }
    }
    
    // Función para eliminar hábito
    async function deleteHabit(habitId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este hábito?')) return;
        
        try {
            const response = await axios.delete(`http://localhost:3000/habits/${habitId}`);
            
            if (response.data.success) {
                const habitItem = document.querySelector(`.habit-item[data-id="${habitId}"]`);
                if (habitItem) {
                    habitItem.style.animation = 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse forwards';
                    
                    setTimeout(() => {
                        habitItem.remove();
                        
                        if (habitsList.children.length === 0) {
                            showEmptyState();
                        }
                    }, 500);
                }
            }
        } catch (error) {
            console.error('Error al eliminar hábito:', error);
        }
    }
    
    // Función para cargar hábitos del usuario
    async function loadUserHabits() {
        try {
            const response = await axios.get(`http://localhost:3000/habits?userId=${userData.id}`);
            
            if (response.data.length > 0) {
                response.data.forEach(habit => createHabitElement(habit));
                
                // Mostrar estadísticas si hay hábitos
                statsEmptyState.style.display = 'none';
                statsContent.style.display = 'block';
                updateChart(response.data);
            } else {
                showEmptyState();
            }
        } catch (error) {
            console.error('Error al cargar hábitos:', error);
            showEmptyState();
        }
    }
    
    // Función para actualizar el gráfico
    function updateChart(habits = []) {
        const ctx = document.getElementById('habits-chart');
        if (!ctx) return;
        
        // Datos para el gráfico (ejemplo)
        const chartData = {
            labels: habits.map(h => h.name),
            datasets: [{
                data: habits.map(h => h.streak || 0),
                backgroundColor: habits.map(h => {
                    const colors = {
                        blue: '#4285F4',
                        green: '#34A853',
                        purple: '#9C27B0',
                        red: '#EA4335'
                    };
                    return colors[h.color] || '#4285F4';
                }),
                borderWidth: 0
            }]
        };
        
        // Crear o actualizar gráfico
        if (window.habitsChart) {
            window.habitsChart.data = chartData;
            window.habitsChart.update();
        } else {
            window.habitsChart = new Chart(ctx, {
                type: 'doughnut',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        }
                    },
                    cutout: '70%',
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
    }
    
    // Resto de tus funciones...
    function showEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state fade-in';
        emptyState.innerHTML = `
            <p>No tienes hábitos registrados</p>
            <p>Haz clic en el botón + para crear uno nuevo</p>
        `;
        habitsList.appendChild(emptyState);
    }
    
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Inicialización modificada
    async function init() {
        // Cargar hábitos del usuario
        await loadUserHabits();
        
        // Configurar animaciones
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
        
        // Animar el botón de añadir
        setTimeout(() => {
            addHabitBtn.classList.add('pulse');
        }, 2000);
    }
    
    // Iniciar la aplicación
    init();
});