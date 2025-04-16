// controller/modules/modal.js
export function initModal() {
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitModalOverlay = document.getElementById('habit-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const habitForm = document.getElementById('habit-form');

    function openModal() {
        habitModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reiniciar animaciones
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

    addHabitBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    habitModalOverlay.addEventListener('click', (e) => {
        if (e.target === habitModalOverlay) closeModal();
    });
}