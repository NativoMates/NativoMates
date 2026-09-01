/* ============================================
   DATOS DE PRODUCTOS
   ============================================ */

const productos = [
    {
        id: 1,
        nombre: 'Mate tipo "Coquito"',
        categoria: 'mates',
        descripcion: 'Mate tipo "Coquito", ideal para tomar solo o con amigos.',
        caracteristicas: ['100% natural', 'Gran capacidad'],
        imagen: 'coquito.jpeg',
        stock: 'disponible'
    },
    {
        id: 2,
        nombre: 'Mate de Algarrobo Imperial',
        categoria: 'mates',
        descripcion: 'Tamaño perfecto para compartir. Muy versátil.',
        caracteristicas: ['Calidad premium', 'Virola de alpaca', 'Piezas únicas', 'Talla mediana'],
        imagen: 'algarrobo.jpeg',
        stock: 'disponible'
    },
    {
        id: 3,
        nombre: 'Mate tipo "Camionero"',
        categoria: 'mates',
        descripcion: 'Madera de algarrobo. Tradicional y elegante.',
        caracteristicas: ['Madera de algarrobo', 'Gran capacidad', 'Muy duradero', 'Acabado natural'],
        imagen: 'camionero.jpeg',
        stock: 'disponible'
    },
    {
        id: 4,
        nombre: 'Matera EcoCuero estilo Cuadrada',
        categoria: 'materas',
        descripcion: 'Matera clasica. Diseño único.',
        caracteristicas: ['EcoCuero', 'Piezas únicas', 'Diseño clasico'],
        imagen: 'matera.jpeg',
        stock: 'disponible'
    },
    {
        id: 8,
        nombre: 'Matera Chica EcoCuero',
        categoria: 'Materas',
        descripcion: 'Matera con menor capacidad, mas comodidad. Clásica.',
        caracteristicas: ['Comoda', 'Versatil', 'Calidad Unica'],
        imagen: 'matera2.jpeg',
        stock: 'disponible'
    },
    {
        id: 9,
        nombre: 'Yerberas',
        categoria: 'yerberas',
        descripcion: 'Distintos tipos de yerberas, maxima calidad.',
        caracteristicas: ['Durables','Comodas', 'Versatil'],
        imagen: 'yerberas.jpeg',
        stock: 'disponible'
    },
    {
        id: 10,
        nombre: 'Bombillas',
        categoria: 'accesorios',
        descripcion: 'Distintos tipos de bombillas',
        caracteristicas: ['Distintas bombillas', 'Alpaca de calidad', 'Variedad de tamaños', 'Económico'],
        imagen: 'bombillas.jpeg',
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