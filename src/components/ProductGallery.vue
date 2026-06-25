<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import http from '@/plugins/axios'
import { useCarritoStore } from '@/stores'

const carritoStore = useCarritoStore()

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  talla: string
  tallas: string[]
  color: string
  imagenes: string
  genero: string
  categoria: {
    id: number
    nombre: string
  }
}

interface Categoria {
  id: number
  nombre: string
}

const productos = ref<Producto[]>([])
const categorias = ref<Categoria[]>([])
const categoriaSeleccionada = ref<string | null>(null)
const generoSeleccionado = ref<string | null>(null)
const loading = ref(true)
const mostrarModalTalla = ref(false)
const productoSeleccionado = ref<Producto | null>(null)
const tallasSeleccionadas = ref<string[]>([])

const productosFiltrados = computed(() => {
  let resultado = productos.value

  // Filtrar por categoría de zapatos/zapatillas
  if (categoriaSeleccionada.value !== null) {
    const opcion = categoriaSeleccionada.value
    resultado = resultado.filter(p => {
      const nombreCategoria = (p.categoria?.nombre || '').toLowerCase()
      if (opcion === 'zapatos') {
        return nombreCategoria.includes('zapato') || nombreCategoria.includes('zapatos')
      }
      if (opcion === 'zapatillas') {
        return nombreCategoria.includes('zapatilla') || nombreCategoria.includes('tenis')
      }
      return true
    })
  }

  // Filtrar por género
  if (generoSeleccionado.value !== null) {
    resultado = resultado.filter(p => p.genero === generoSeleccionado.value)
  }

  return resultado
})

const cargarCategorias = async () => {
  try {
    const { data } = await http.get('categorias')
    categorias.value = data.sort((a: Categoria, b: Categoria) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

const cargarProductos = async () => {
  try {
    loading.value = true
    const { data } = await http.get('productos')
    // Filtrar productos con stock y ordenar por ID
    productos.value = data
      .filter((p: Producto) => Number(p.stock) > 0)
      .sort((a: Producto, b: Producto) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loading.value = false
  }
}

const seleccionarCategoria = (categoria: string | null) => {
  categoriaSeleccionada.value = categoria
}

const seleccionarGenero = (genero: string | null) => {
  generoSeleccionado.value = genero
}
 // METODO PARA AGREGAR AL CARRITO
const agregarAlCarrito = (producto: Producto) => {
  productoSeleccionado.value = producto
  tallasSeleccionadas.value = []
  mostrarModalTalla.value = true
}

const toggleTalla = (talla: string) => {
  const index = tallasSeleccionadas.value.indexOf(talla)
  if (index === -1) {
    tallasSeleccionadas.value.push(talla)
  } else {
    tallasSeleccionadas.value.splice(index, 1)
  }
}

const confirmarAgregarAlCarrito = () => {
  if (!productoSeleccionado.value || tallasSeleccionadas.value.length === 0) {
    alert('Por favor selecciona al menos una talla')
    return
  }

  // Agregar un item al carrito por cada talla seleccionada
  tallasSeleccionadas.value.forEach(talla => {
    carritoStore.agregarItem({
      id: productoSeleccionado.value!.id,
      nombre: productoSeleccionado.value!.nombre,
      precio: Number(productoSeleccionado.value!.precio),
      talla: talla,
      color: productoSeleccionado.value!.color,
      imagenes: productoSeleccionado.value!.imagenes,
      // Asegurarse de que stock sea un número
      stock: Number(productoSeleccionado.value!.stock)
    })
  })

  mostrarModalTalla.value = false
  productoSeleccionado.value = null
  tallasSeleccionadas.value = []
}

const cerrarModalTalla = () => {
  mostrarModalTalla.value = false
  productoSeleccionado.value = null
  tallasSeleccionadas.value = []
}

onMounted(() => {
  cargarCategorias()
  cargarProductos()
})
</script>

<template>
  <section id="coleccion" class="gallery-section">
    <div class="gallery-container">
      <!-- Header Section -->
      <div class="gallery-header">
        <h2 class="gallery-title">Colección de Zapatos</h2>
        <div class="gallery-divider"></div>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button
          @click="seleccionarCategoria(null)"
          :class="['filter-btn', { active: categoriaSeleccionada === null }]"
        >
          Todos
        </button>
        <button
          @click="seleccionarCategoria('zapatos')"
          :class="['filter-btn', { active: categoriaSeleccionada === 'zapatos' }]"
        >
          Zapatos
        </button>
        <button
          @click="seleccionarCategoria('zapatillas')"
          :class="['filter-btn', { active: categoriaSeleccionada === 'zapatillas' }]"
        >
          Zapatillas
        </button>
      </div>

      <!-- Gender Filter -->
      <div class="gender-filter">
        <button
          @click="seleccionarGenero(null)"
          :class="['filter-btn', { active: generoSeleccionado === null }]"
        >
          Todos
        </button>
        <button
          @click="seleccionarGenero('hombre')"
          :class="['filter-btn', { active: generoSeleccionado === 'hombre' }]"
        >
          Hombre
        </button>
        <button
          @click="seleccionarGenero('mujer')"
          :class="['filter-btn', { active: generoSeleccionado === 'mujer' }]"
        >
          Mujer
        </button>
        <button
          @click="seleccionarGenero('unisex')"
          :class="['filter-btn', { active: generoSeleccionado === 'unisex' }]"
        >
          Unisex
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="productosFiltrados.length > 0" class="products-grid">
        <article v-for="producto in productosFiltrados" :key="producto.id" class="product-item">
          <!-- Image Container -->
          <div class="product-image-container">
            <img :src="producto.imagenes" :alt="producto.nombre" class="product-image" />
            <div class="product-overlay">
              <span class="stock-indicator" v-if="Number(producto.stock) <= 5">Stock limitado</span>

              <!-- BOTON PARA AGREGAR AL CARRITO -->
              <button @click.stop="agregarAlCarrito(producto)" class="btn-add-cart">
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <div class="product-meta">
              <span class="product-category">{{ producto.categoria?.nombre }}</span>
            </div>
            <h3 class="product-name">{{ producto.nombre }}</h3>
            <div class="product-attributes">
              <span class="attribute">{{ producto.talla }}</span>
              <span class="attribute-separator">·</span>
              <span class="attribute">{{ producto.color }}</span>
            </div>
            <div class="product-price-line">
              <span class="product-price">{{ Number(producto.precio).toFixed(2) }} Bs</span>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p class="empty-message">{{ (categoriaSeleccionada || generoSeleccionado) ? 'No hay productos con los filtros seleccionados' : 'La colección estará disponible próximamente' }}</p>
      </div>
    </div>

    <!-- Modal de Selección de Talla -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="mostrarModalTalla && productoSeleccionado" class="modal-overlay" @click.self="cerrarModalTalla">
          <div class="modal-container">
            <div class="modal-header">
              <h2 class="modal-title">Seleccionar Talla</h2>
              <button @click="cerrarModalTalla" class="modal-close" type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="modal-body">
              <div class="producto-info-modal">
                <img :src="productoSeleccionado.imagenes" :alt="productoSeleccionado.nombre" class="modal-imagen" />
                <div class="modal-detalles">
                  <h3>{{ productoSeleccionado.nombre }}</h3>
                  <p class="modal-precio">{{ Number(productoSeleccionado.precio).toFixed(2) }} Bs</p>
                  <p class="modal-color">Color: {{ productoSeleccionado.color }}</p>
                </div>
              </div>

              <div class="tallas-selector">
                <label class="label-talla">Elige las tallas que deseas comprar:</label>
                <div class="tallas-grid">
                  <button
                    v-for="talla in productoSeleccionado.tallas"
                    :key="talla"
                    type="button"
                    class="talla-option"
                    :class="{ selected: tallasSeleccionadas.includes(talla) }"
                    @click="toggleTalla(talla)"
                  >
                    {{ talla }}
                  </button>
                </div>
                <p class="tallas-count">{{ tallasSeleccionadas.length }} talla{{ tallasSeleccionadas.length !== 1 ? 's' : '' }} seleccionada{{ tallasSeleccionadas.length !== 1 ? 's' : '' }}</p>
              </div>
            </div>

            <div class="modal-footer">
              <button @click="cerrarModalTalla" class="btn-cancelar">Cancelar</button>
              <button @click="confirmarAgregarAlCarrito" class="btn-confirmar">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
/* Diseño editorial premium - inspirado en COS, Arket, The Row */

.gallery-section {
  background: linear-gradient(180deg, #c6d8ff 0%, #9fb9ff 100%);
  padding: 60px 0 80px 0;
}

.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Header */
.gallery-header {
  text-align: center;
  margin-bottom: 50px;
}

.gallery-title {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 4px;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.gallery-divider {
  width: 60px;
  height: 1px;
  background: #000000;
  margin: 0 auto;
}

/* Category Filter */
.category-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  padding: 0 20px;
}

/* Gender Filter */
.gender-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 50px;
  flex-wrap: wrap;
  padding: 0 20px;
}

.filter-btn {
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #666666;
  padding: 10px 24px;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #000000;
  color: #000000;
}

.filter-btn.active {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}

/* Loading */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e5e5;
  border-top-color: #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Products Grid - Diseño editorial */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px 30px;
}

/* Product Item */
.product-item {
  display: block;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.product-item:hover {
  opacity: 0.85;
}

/* Image Container */
.product-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  max-height: 420px;
  overflow: hidden;
  background: #fafafa;
  margin-bottom: 16px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-item:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
}

.product-item:hover .product-overlay {
  opacity: 1;
}

.stock-indicator {
  font-size: 0.75rem;
  color: #ffffff;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 400;
  align-self: flex-start;
}

.btn-add-cart {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 12px 24px;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(10px);
  opacity: 0;
}

.product-item:hover .btn-add-cart {
  opacity: 1;
  transform: translateY(0);
}

.btn-add-cart:hover {
  background: #000000;
  color: #ffffff;
}

/* Product Info */
.product-info {
  padding: 0 5px;
}

.product-meta {
  margin-bottom: 8px;
}

.product-category {
  font-size: 0.6875rem;
  color: #999999;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 400;
}

.product-name {
  font-size: 1rem;
  font-weight: 400;
  color: #000000;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-attributes {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.attribute {
  font-size: 0.8125rem;
  color: #666666;
  letter-spacing: 0.3px;
}

.attribute-separator {
  color: #cccccc;
  font-size: 0.75rem;
}

.product-price-line {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.product-price {
  font-size: 0.9375rem;
  color: #000000;
  font-weight: 400;
  letter-spacing: 0.3px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
}

.empty-message {
  font-size: 1rem;
  color: #999999;
  letter-spacing: 0.5px;
  font-weight: 300;
}

/* Responsive */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 35px 25px;
  }
}

@media (max-width: 768px) {
  .gallery-section {
    padding: 40px 0 60px 0;
  }

  .gallery-container {
    padding: 0 20px;
  }

  .gallery-header {
    margin-bottom: 40px;
  }

  .gallery-title {
    font-size: 1.5rem;
    letter-spacing: 3px;
  }

  .category-filter {
    gap: 8px;
    margin-bottom: 40px;
  }

  .filter-btn {
    padding: 8px 16px;
    font-size: 0.75rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 30px 20px;
  }

  .product-image-container {
    max-height: 340px;
  }

  .product-name {
    font-size: 0.9375rem;
  }

  .product-price {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .category-filter {
    gap: 6px;
    margin-bottom: 30px;
  }

  .filter-btn {
    padding: 7px 14px;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px 15px;
  }

  .gallery-title {
    font-size: 1.25rem;
    letter-spacing: 2px;
  }

  .product-image-container {
    max-height: 280px;
  }
}

/* Modal de Selección de Talla */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.modal-container {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #000000;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #999999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #000000;
}

.modal-body {
  padding: 24px;
}

.producto-info-modal {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-imagen {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f5f5;
}

.modal-detalles h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
}

.modal-precio {
  font-size: 1rem;
  font-weight: 500;
  color: #000000;
  margin: 0 0 4px 0;
}

.modal-color {
  font-size: 0.875rem;
  color: #666666;
  margin: 0;
}

.tallas-selector {
  margin-bottom: 24px;
}

.label-talla {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
}

.tallas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
}

.talla-option {
  padding: 12px 8px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  color: #666666;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.talla-option:hover {
  border-color: #999999;
  color: #000000;
}

.talla-option.selected {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.tallas-count {
  font-size: 0.8rem;
  color: #666666;
  margin-top: 12px;
  text-align: center;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
}

.btn-cancelar {
  padding: 10px 24px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  color: #666666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-cancelar:hover {
  border-color: #999999;
  color: #000000;
}

.btn-confirmar {
  padding: 10px 24px;
  border: none;
  background: #000000;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-confirmar:hover {
  background: #333333;
}

/* Animaciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container {
  transform: scale(0.95);
}

.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
