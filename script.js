/* ============================================
   CONFIGURACIÓN GENERAL
   ============================================ */

// Datos de configuración
const CONFIG = {
    whatsappNumber: '5493489701958',
    whatsappMessage: '¡Hola Nativo Mates! Quiero hacer una consulta!'
};

function sendGAEvent(eventName, eventData = {}) {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
        event: eventName,
        ...eventData
    });
}

/* ============================================
   FUNCIONES DE SCROLL Y NAVEGACIÓN
   ============================================ */

/**
 * Scroll suave a una sección específica
 * @param {string} selector - Selector CSS del elemento
 */
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Abre el formulario de contacto en WhatsApp
 */
function openContactForm() {
    sendGAEvent('contact_whatsapp', {
        method: 'whatsapp'
    });

    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
}

/* ============================================
   EFECTOS DE HEADER
   ============================================ */

/**
 * Añade efecto de sombra al header cuando se hace scroll
 */
function initHeaderScroll() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        }
    });
}

/* ============================================
   NAVEGACIÓN CON ANCHOR LINKS
   ============================================ */

/**
 * Inicializa los enlaces de navegación con scroll suave
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                scrollToSection(href);
            }
        });
    });
}

/* ============================================
   ANIMACIONES ON SCROLL
   ============================================ */

/**
 * Inicializa las animaciones de elementos al hacer scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar observador a tarjetas de productos, pasos y características
    const elementsToObserve = document.querySelectorAll(
        '.product-card, .step-card, .feature-card'
    );

    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

/* ============================================
   FUNCIÓN PARA CAMBIAR CONFIGURACIÓN
   ============================================ */

/**
 * Actualiza la configuración de WhatsApp
 * @param {string} number - Número de WhatsApp (sin +)
 * @param {string} message - Mensaje predeterminado
 */
function updateWhatsAppConfig(number, message) {
    CONFIG.whatsappNumber = number;
    CONFIG.whatsappMessage = message;
    console.log('Configuración de WhatsApp actualizada');
}

/* ============================================
   INICIALIZACIÓN
   ============================================ */

/**
 * Inicializa todas las funcionalidades cuando el DOM está cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initSmoothScroll();
    initScrollAnimations();
    console.log('✓ Página cargada y funcionalidades inicializadas');
});

/* ============================================
   FUNCIONES AUXILIARES
   ============================================ */

/**
 * Valida si un elemento está en el viewport
 * @param {HTMLElement} element - Elemento a validar
 * @returns {boolean}
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Obtiene información del usuario desde el localStorage
 * @returns {object}
 */
function getUserInfo() {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
}

/**
 * Guarda información del usuario en localStorage
 * @param {object} info - Información a guardar
 */
function saveUserInfo(info) {
    localStorage.setItem('userInfo', JSON.stringify(info));
}

/**
 * Limpia la información del usuario del localStorage
 */
function clearUserInfo() {
    localStorage.removeItem('userInfo');
}

/* ============================================
   FUNCIONES PARA DEBUGGING
   ============================================ */

/**
 * Muestra información útil para debugging
 */
function showDebugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('Config:', CONFIG);
    console.log('User Info:', getUserInfo());
    console.log('Window Size:', {
        width: window.innerWidth,
        height: window.innerHeight
    });
}

// Descomentar para debugging
// showDebugInfo();