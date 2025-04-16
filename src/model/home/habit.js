// controller/modules/habit.js
import { updateChart } from './chart.js';

export function initHabit() {
    const habitForm = document.getElementById('habit-form');
    const habitsList = document.getElementById('habits-list');

    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const habitName = document.getElementById('habit-name').value;
        const habitColor = document.querySelector('input[name="habit-color"]:checked').value;
        
        createHabitElement(habitName, habitColor);
        updateChart({ name: habitName, color: habitColor, streak: 0 });
        closeModal(); // Asegúrate de definir closeModal() o importarlo
    });

    function createHabitElement(name, color) {
        // ... (código existente para crear elementos de hábito)
    }
}