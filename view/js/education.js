// Animación para las secciones al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    // Función para verificar si un elemento está en el viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // Función para animar elementos cuando son visibles
    function animateOnScroll() {
        // Animar secciones de leyes
        const lawSections = document.querySelectorAll('.law');
        lawSections.forEach(section => {
            if (isElementInViewport(section) && !section.classList.contains('visible')) {
                section.classList.add('visible');
            }
        });
        
        // Animar sección de resumen
        const summarySection = document.querySelector('.summary');
        if (summarySection && isElementInViewport(summarySection) && !summarySection.classList.contains('visible')) {
            summarySection.classList.add('visible');
        }
        
        // Animar sección de conclusión
        const conclusionSection = document.querySelector('.conclusion');
        if (conclusionSection && isElementInViewport(conclusionSection) && !conclusionSection.classList.contains('visible')) {
            conclusionSection.classList.add('visible');
        }
    }
    
    // Ejecutar la animación al cargar la página
    animateOnScroll();
    
    // Ejecutar la animación al hacer scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Animación para el ciclo de hábitos
    const cycleItems = document.querySelectorAll('.cycle-item');
    
    // Función para animar los elementos del ciclo
    function animateCycleItems() {
        cycleItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = item.id === 'cue' || item.id === 'response' 
                    ? `translateX(-50%) scale(1.1) ` 
                    : 'translateY(-50%) scale(1.1)';
                
                setTimeout(() => {
                    item.style.transform = item.id === 'cue' || item.id === 'response' 
                        ? `translateX(-50%) scale(1)` 
                        : 'translateY(-50%) scale(1)';
                }, 500);
            }, index * 1000);
        });
    }
    
    // Iniciar la animación del ciclo y repetirla cada 5 segundos
    animateCycleItems();
    setInterval(animateCycleItems, 4000);
    
    // Smooth scroll para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto hover para las estrategias
    const strategies = document.querySelectorAll('.strategy');
    strategies.forEach(strategy => {
        strategy.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        });
        
        strategy.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        });
    });
});