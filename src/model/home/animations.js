// modules/animations.js
export function setupAnimations() {
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-in');
        elements.forEach(element => {
            // ... lógica de animación
        });
    }

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
}