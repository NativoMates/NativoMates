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
function openContactForm(customMessage, productName) {
    // Si no llega un texto (o llega un evento del navegador), se usa el mensaje general
    const message = (typeof customMessage === 'string' && customMessage.trim())
        ? customMessage
        : CONFIG.whatsappMessage;

    sendGAEvent('contact_whatsapp', {
        method: 'whatsapp',
        ...(productName ? { item_name: productName } : {})
    });

    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
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
            <button class="floating-btn floating-whatsapp" type="button" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></button>
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
    const targets = document.querySelectorAll('.hero-container,.section-header,.about-container,.cta-container,.feature-card,.product-card,.step-card,.highlight,.producto-card,.testimonial-card');
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


/* =========================================================
   TESTIMONIOS / RESEÑAS (se inserta en todas las páginas)
   Editá el array para cambiar los textos.
   ========================================================= */
const TESTIMONIALS = [
    {
        text: 'Pedí un mate de algarrobo y llegó perfecto, bien embalado y en 48 hs. La atención por WhatsApp fue excelente.',
        name: 'Joaquín',
        place: 'Buenos Aires',
        stars: 5
    },
    {
        text: 'Me asesoraron para elegir según cómo tomo el mate. Muy buena calidad y precio justo. Seguro vuelvo a comprar.',
        name: 'Federico',
        place: 'Campana',
        stars: 5
    },
    {
        text: 'A pesar de la distancia, llego todo en optimas condiciones, aprobadisimo!',
        name: 'Ignacio',
        place: 'gualeguaychú',
        stars: 5
    }
];

function initTestimonials() {
    if (document.querySelector('.testimonials')) return;
    const anchor = document.querySelector('section.cta') || document.querySelector('footer');
    if (!anchor) return;

    const escapeHTML = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const cards = TESTIMONIALS.map(t => `
        <figure class="testimonial-card">
            <div class="testimonial-stars" role="img" aria-label="${t.stars} de 5 estrellas">${'★'.repeat(t.stars)}${'☆'.repeat(5 - t.stars)}</div>
            <blockquote>“${escapeHTML(t.text)}”</blockquote>
            <figcaption>
                <span class="testimonial-avatar" aria-hidden="true">${escapeHTML(t.name.charAt(0).toUpperCase())}</span>
                <span class="testimonial-author"><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.place)}</small></span>
            </figcaption>
        </figure>`).join('');

    const section = document.createElement('section');
    section.className = 'testimonials';
    section.id = 'testimonios';
    section.innerHTML = `
        <div class="testimonials-container">
            <div class="section-header">
                <h2>Lo que dicen nuestros clientes</h2>
                <p>Cada compra se atiende una por una. Estas son algunas de las opiniones de quienes ya tienen su Nativo.</p>
            </div>
            <div class="testimonials-grid">${cards}</div>
        </div>`;
    anchor.parentNode.insertBefore(section, anchor);
}

document.addEventListener('DOMContentLoaded', () => {
    initTestimonials();
    initFloatingActions();
    initMobileNavigation();
    initPremiumReveal();
    initActiveNavigation();
});