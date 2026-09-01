/* ============================================
   DATOS DE PRODUCTOS
   ============================================ */

const productos = [
    {
        id: 1,
        nombre: 'Mate de Calabaza Grande',
        categoria: 'mates',
        descripcion: 'Calabaza natural con virola de alpaca. Ideal para tomar mate solo.',
        caracteristicas: ['Calabaza 100% natural', 'Virola de alpaca', 'Curado artesanal', 'Gran capacidad'],

        imagen: 'mate_calabaza_1.png',
        stock: 'disponible'
    },
    {
        id: 2,
        nombre: 'Mate de Calabaza Mediano',
        categoria: 'mates',
        descripcion: 'Tamaño perfecto para compartir. Muy versátil.',
        caracteristicas: ['Calabaza premium', 'Virola de alpaca', 'Piezas únicas', 'Talla mediana'],
        imagen: 'mate_calabaza_2.png',
        stock: 'disponible'
    },
    {
        id: 3,
        nombre: 'Mate de Algarrobo',
        categoria: 'mates',
        descripcion: 'Madera de algarrobo. Tradicional y elegante.',
        caracteristicas: ['Madera de algarrobo', 'Virola de alpaca', 'Muy duradero', 'Acabado natural'],
        imagen: 'mate_algarrobo_1.png',
        stock: 'disponible'
    },
    {
        id: 4,
        nombre: 'Mate Cerámica Artesanal',
        categoria: 'mates',
        descripcion: 'Cerámica hecha a mano. Diseño único.',
        caracteristicas: ['Cerámica artesanal', 'Virola de alpaca', 'Piezas únicas', 'Diseño moderno'],
        imagen: 'mate_ceramica_1.png',
        stock: 'limitado'
    },
    {
        id: 8,
        nombre: 'Bombilla Alpaca Pico de Loro',
        categoria: 'accesorios',
        descripcion: 'Bombilla de alpaca con pico de loro. Clásica.',
        caracteristicas: ['Alpaca alemana', 'Pico de loro', 'Filtro fino', 'Fácil de limpiar'],
        imagen: 'bombilla_loro.png',
        stock: 'disponible'
    },
    {
        id: 9,
        nombre: 'Bombilla Alpaca Grande',
        categoria: 'accesorios',
        descripcion: 'Bombilla grande para mates amplios.',
        caracteristicas: ['Alpaca de calidad', 'Tamaño grande', 'Filtro extendido', 'Durabilidad'],
        imagen: 'bombilla_alpaca.png',
        stock: 'disponible'
    },
    {
        id: 10,
        nombre: 'Set de Bombillas (3 unidades)',
        categoria: 'accesorios',
        descripcion: 'Pack de 3 bombillas de alpaca diferentes.',
        caracteristicas: ['3 bombillas incluidas', 'Alpaca de calidad', 'Variedad de tamaños', 'Económico'],
        imagen: 'set_bombillas.png',
        stock: 'limitado'
    },
    {
        id: 11,
        nombre: 'Cepillo de Limpieza para Bombilla',
        categoria: 'accesorios',
        descripcion: 'Cepillo especial para limpiar bombillas.',
        caracteristicas: ['Cerdas naturales', 'Mango cómodo', 'Muy efectivo', 'Larga durabilidad'],
        imagen: 'cepillo_bombilla.png',
        stock: 'disponible'
    },
];

/* ============================================
   VARIABLES GLOBALES
   ============================================ */

let productosFiltrados = [...productos];
let filtroActual = 'todos';

/* ============================================
   FUNCIONES DE FILTRADO
   ============================================ */

/**
 * Filtra productos por categoría
 * @param {string} categoria - Categoría a filtrar
 */
function filtrarProductos(categoria) {
    filtroActual = categoria;
    
    // Actualizar botones activos
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filtrar productos
    if (categoria === 'todos') {
        productosFiltrados = [...productos];
    } else {
        productosFiltrados = productos.filter(p => p.categoria === categoria);
    }
    
    // Renderizar
    renderizarProductos(productosFiltrados);
    
    // Enviar evento a GA4
    if (typeof sendGAEvent !== 'undefined') {
        sendGAEvent('filter_products', {
            filter_type: 'category',
            filter_value: categoria
        });
    }
}

/**
 * Busca productos por nombre
 */
function buscarProductos() {
    const busqueda = document.getElementById('buscador').value.toLowerCase();
    
    if (busqueda === '') {
        productosFiltrados = filtroActual === 'todos' 
            ? [...productos] 
            : productos.filter(p => p.categoria === filtroActual);
    } else {
        productosFiltrados = productos.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) ||
            p.descripcion.toLowerCase().includes(busqueda) ||
            p.caracteristicas.some(c => c.toLowerCase().includes(busqueda))
        );
    }
    
    renderizarProductos(productosFiltrados);
    
    // Enviar evento a GA4
    if (typeof sendGAEvent !== 'undefined') {
        sendGAEvent('search_products', {
            search_term: busqueda,
            results_count: productosFiltrados.length
        });
    }
}

/* ============================================
   RENDERIZADO DE PRODUCTOS
   ============================================ */

/**
 * Renderiza los productos en el grid
 * @param {array} productosParaMostrar - Array de productos a mostrar
 */
function renderizarProductos(productosParaMostrar) {
    const grid = document.getElementById('productosGrid');
    
    if (productosParaMostrar.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div class="sin-productos">
                    <div class="sin-productos-icono">🔍</div>
                    <h3>No encontramos productos</h3>
                    <p>Intenta con otro filtro o búsqueda</p>
                    <button class="sin-productos-btn" onclick="limpiarBusqueda()">Limpiar búsqueda</button>
                </div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productosParaMostrar.map(producto => `
        <div class="producto-card" onclick="abrirDetalles(${producto.id})">
            <div class="producto-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="producto-contenido">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="producto-categoria">${capitalizar(producto.categoria)}</span>
                    ${mostrarBadgeStock(producto.stock)}
                </div>
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <ul class="producto-caracteristicas">
                    ${producto.caracteristicas.slice(0, 2).map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
            <div class="producto-footer">
                <button class="producto-btn" onclick="event.stopPropagation(); openContactForm();">
                    Consultar
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Muestra badge de stock
 * @param {string} stock - Estado del stock
 */
function mostrarBadgeStock(stock) {
    const badges = {
        'disponible': '<span class="stock-badge stock-disponible">✓ Disponible</span>',
        'limitado': '<span class="stock-badge stock-limitado">⚠ Limitado</span>',
        'agotado': '<span class="stock-badge stock-agotado">✗ Agotado</span>'
    };
    return badges[stock] || '';
}

/**
 * Abre modal con detalles del producto
 * @param {number} id - ID del producto
 */
function abrirDetalles(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal activo';
    modal.innerHTML = `
        <div class="modal-contenido" style="position: relative;">
            <button class="modal-cerrar" onclick="this.closest('.modal').remove()">×</button>
            
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="margin-bottom: 1rem;">
                <img 
                    src="${producto.imagen}" 
                    alt="${producto.nombre}"
                    style="width: 300px; height: 300px; object-fit: cover; border-radius: 12px;"
                >
            </div>
                <h2 style="color: var(--text-dark); margin-bottom: 0.5rem;">${producto.nombre}</h2>
                <p style="color: var(--text-light);">${capitalizar(producto.categoria)}</p>
            </div>
            
            <p style="color: var(--text-light); margin-bottom: 1.5rem; font-size: 1rem;">
                ${producto.descripcion}
            </p>
            
            <div style="background-color: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Características:</h4>
                <ul class="producto-caracteristicas">
                    ${producto.caracteristicas.map(c => `<li style="margin-bottom: 0.5rem;">${c}</li>`).join('')}
                </ul>
            </div>
            
            <div style="display: flex; justify-content: flex-end; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <button class="btn-primary" onclick="event.stopPropagation(); openContactForm(); this.closest('.modal').remove();">
                    Consultar ahora
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    // Enviar evento a GA4
    if (typeof sendGAEvent !== 'undefined') {
        sendGAEvent('view_item_details', {
            item_id: producto.id,
            item_name: producto.nombre,
            item_category: producto.categoria,
            price: producto.precio
        });
    }
}

/**
 * Limpia los filtros y búsqueda
 */
function limpiarBusqueda() {
    document.getElementById('buscador').value = '';
    filtroActual = 'todos';
    document.querySelectorAll('.filtro-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === 0);
    });
    productosFiltrados = [...productos];
    renderizarProductos(productosFiltrados);
}

/* ============================================
   FUNCIONES AUXILIARES
   ============================================ */

/**
 * Capitaliza la primera letra
 * @param {string} texto - Texto a capitalizar
 */
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* ============================================
   INICIALIZACIÓN
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos(productos);
    
    // Enviar evento de vista de página de productos
    if (typeof sendGAEvent !== 'undefined') {
        sendGAEvent('view_product_list', {
            item_category: 'all',
            total_items: productos.length
        });
    }
    
    console.log('✓ Página de productos cargada');
    console.log(`📦 Total de productos: ${productos.length}`);
});

/* ============================================
   SCROLL Y EFECTOS
   ============================================ */

// Agregar efecto a las tarjetas cuando aparecen en vista
document.addEventListener('scroll', function() {
    document.querySelectorAll('.producto-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Inicializar opacidad de tarjetas
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.producto-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
});