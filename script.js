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
/* =========================================================
   NATIVO MATES — UX ENHANCEMENTS
   Mantiene intactos CONFIG, GTM, eventos y WhatsApp.
   ========================================================= */
function initFloatingActions() {
    if (document.querySelector('.floating-actions')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'floating-actions';
    wrapper.innerHTML = `
        <div class="floating-btn-wrap">
            <span class="floating-label">Consultar por WhatsApp</span>
            <button class="floating-btn floating-whatsapp" type="button" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp">◉</button>
        </div>
        <div class="floating-btn-wrap">
            <span class="floating-label">Volver arriba</span>
            <button class="floating-btn floating-top" type="button" aria-label="Volver arriba" title="Volver arriba">↑</button>
        </div>`;
    document.body.appendChild(wrapper);
    wrapper.querySelector('.floating-whatsapp').addEventListener('click', () => {
        if (typeof openContactForm === 'function') openContactForm();
    });
    const topButton = wrapper.querySelector('.floating-top');
    topButton.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
    const update = () => topButton.classList.toggle('visible', window.scrollY > 450);
    window.addEventListener('scroll', update, {passive:true});
    update();
}

function initMobileNavigation() {
    const header = document.querySelector('header');
    const nav = header?.querySelector('nav');
    const container = header?.querySelector('.header-container');
    if (!header || !nav || !container || container.querySelector('.mobile-menu-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label','Abrir menú');
    toggle.setAttribute('aria-expanded','false');
    toggle.textContent = '☰';

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-hidden','true');
    nav.querySelectorAll('a').forEach(link => mobileNav.appendChild(link.cloneNode(true)));
    container.appendChild(toggle);
    header.appendChild(mobileNav);

    const close = () => {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        toggle.setAttribute('aria-label','Abrir menú');
        toggle.textContent = '☰';
        mobileNav.setAttribute('aria-hidden','true');
    };
    toggle.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded',String(open));
        toggle.setAttribute('aria-label',open ? 'Cerrar menú' : 'Abrir menú');
        toggle.textContent = open ? '×' : '☰';
        mobileNav.setAttribute('aria-hidden',String(!open));
    });
    mobileNav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('click', e => { if (!header.contains(e.target)) close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 820) close(); });
}

function initPremiumReveal() {
    if (!('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.hero-container,.section-header,.about-container,.cta-container,.feature-card,.product-card,.step-card,.highlight,.producto-card');
    targets.forEach((el,i) => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
            el.style.transitionDelay = `${Math.min(i % 4,3) * 70}ms`;
        }
    });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold:.12, rootMargin:'0px 0px -50px 0px'});
    targets.forEach(el => observer.observe(el));
}

function initActiveNavigation() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('header nav a, .mobile-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        if (href.split('/').pop() === current) link.setAttribute('aria-current','page');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initFloatingActions();
    initMobileNavigation();
    initPremiumReveal();
    initActiveNavigation();
});
