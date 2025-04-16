// controller/home.js
import { initModal } from '../model/home/modal.js';
import { initHabit } from '../model/home/habit.js';
import { initChart } from '../model/home/chart.js';
import { setupAnimations } from '../model/home/animations.js';

document.addEventListener('DOMContentLoaded', () => {
    initModal();
    initHabit();
    initChart();
    setupAnimations();
    
    // Animación del botón "Agregar hábito"
    setTimeout(() => {
        document.getElementById('add-habit-btn').classList.add('pulse');
    }, 2000);
});