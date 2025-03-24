document.addEventListener('DOMContentLoaded', function() {
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
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
    
    function closeModal() {
        habitModalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
        habitForm.reset(); // Limpiar formulario
    }
    
    // Event listeners para el modal
    addHabitBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera
    habitModalOverlay.addEventListener('click', function(e) {
        if (e.target === habitModalOverlay) {
            closeModal();
        }
    });
    
    // Manejar envío del formulario
    habitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aquí iría la lógica para guardar el hábito en la base de datos
        // Como no hay base de datos, simplemente cerramos el modal
        
        // Simulación de creación de hábito (solo para demostración)
        const habitName = document.getElementById('habit-name').value;
        const habitColor = document.querySelector('input[name="habit-color"]:checked').value;
        
        // Crear elemento visual del hábito (solo para demostración)
        createHabitElement(habitName, habitColor);
        
        closeModal();
    });
    
    // Función para crear elemento visual de hábito (solo para demostración)
    function createHabitElement(name, color) {
        // Eliminar mensaje de estado vacío si existe
        const emptyState = habitsList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Crear elemento de hábito
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.innerHTML = `
            <span class="habit-name">${name}</span>
            <div class="habit-actions">
                <button class="habit-edit"><i class="fas fa-edit"></i></button>
                <button class="habit-delete"><i class="fas fa-trash"></i></button>
                <div class="habit-streak">
                    <i class="fas fa-fire"></i>
                    <span>0</span>
                </div>
            </div>
        `;
        
        // Aplicar color según selección
        habitItem.style.borderLeft = `4px solid var(--habit-${color})`;
        
        // Agregar a la lista
        habitsList.appendChild(habitItem);
        
        // Agregar event listeners para editar y eliminar
        const editBtn = habitItem.querySelector('.habit-edit');
        const deleteBtn = habitItem.querySelector('.habit-delete');
        
        editBtn.addEventListener('click', function() {
            // Aquí iría la lógica para editar el hábito
            alert('Función de edición no implementada en esta demo');
        });
        
        deleteBtn.addEventListener('click', function() {
            // Eliminar el hábito de la lista
            habitItem.remove();
            
            // Si no quedan hábitos, mostrar mensaje de estado vacío
            if (habitsList.children.length === 0) {
                showEmptyState();
            }
        });
    }
    
    // Función para mostrar estado vacío
    function showEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p>No tienes hábitos registrados</p>
            <p>Haz clic en el botón + para crear uno nuevo</p>
        `;
        habitsList.appendChild(emptyState);
    }
    
    // Inicializar gráfico (vacío)
    function initChart() {
        const ctx = document.getElementById('habits-chart');
        if (!ctx) return;
        
        // Crear gráfico vacío con Chart.js
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                },
                cutout: '70%'
            }
        });
        
        return chart;
    }
    
    // Cambiar entre vistas de estadísticas
    weeklyBtn.addEventListener('click', function() {
        weeklyBtn.classList.add('active');
        totalBtn.classList.remove('active');
        // Aquí iría la lógica para actualizar el gráfico con datos semanales
    });
    
    totalBtn.addEventListener('click', function() {
        totalBtn.classList.add('active');
        weeklyBtn.classList.remove('active');
        totalBtn.classList.add('active');
        weeklyBtn.classList.remove('active');
        // Aquí iría la lógica para actualizar el gráfico con datos totales
    });
    
    // Inicializar la aplicación
    function init() {
        // Inicializar gráfico vacío
        const chart = initChart();
        
        // Mostrar estados vacíos iniciales
        showEmptyState();
    }
    
    // Iniciar la aplicación
    init();
});