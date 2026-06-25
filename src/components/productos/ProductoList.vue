<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import ProductoSave from './ProductoSave.vue'

const productos = ref<Producto[]>([])
const showModal = ref(false)
const productoSeleccionado = ref<Producto | undefined>(undefined)

  // Controla la visualización del modal de detalle del producto
const showViewModal = ref(false)

// Almacena el producto seleccionado para mostrar su información completa
const productoDetalle = ref<Producto | null>(null)

const busqueda = ref('')
const imagenHover = ref<{ src: string; nombre: string } | null>(null)

// Filtrar productos por búsqueda
const productosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return productos.value
  const termino = busqueda.value.toLowerCase().trim()
  return productos.value.filter(prod =>
    prod.nombre.toLowerCase().includes(termino) ||
    prod.categoria?.nombre?.toLowerCase().includes(termino) ||
    prod.genero?.toLowerCase().includes(termino) ||
    prod.id.toString().includes(termino)
  )
})

const cargarProductos = async () => {
  try {
    const { data } = await http.get('productos')
    // Ordenar por ID de forma ascendente
    productos.value = data.sort((a: Producto, b: Producto) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

const eliminarProducto = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    try {
      await http.delete(`productos/${id}`)
      await cargarProductos()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('No se pudo eliminar el producto')
    }
  }
}

const abrirModalCrear = () => {
  productoSeleccionado.value = undefined
  showModal.value = true
}

const abrirModalEditar = (producto: Producto) => {
  productoSeleccionado.value = producto
  showModal.value = true
}

// Abre el modal de detalle y carga el producto seleccionado
const abrirDetalleProducto = (producto: Producto) => {
  productoDetalle.value = producto
  showViewModal.value = true
}

// Cierra el modal de detalle y limpia el producto seleccionado
const cerrarDetalleProducto = () => {
  showViewModal.value = false
  productoDetalle.value = null
}

const cerrarModal = () => {
  showModal.value = false
  productoSeleccionado.value = undefined
}

const onProductoGuardado = () => {
  cargarProductos()
}

const getGeneroLabel = (genero: string) => {
  const labels: Record<string, string> = {
    hombre: 'Hombre',
    mujer: 'Mujer',
    unisex: 'Unisex'
  }
  return labels[genero] || 'Unisex'
}

const getGeneroClass = (genero: string) => {
  const classes: Record<string, string> = {
    hombre: 'genero-hombre',
    mujer: 'genero-mujer',
    unisex: 'genero-unisex'
  }
  return classes[genero] || 'genero-unisex'
}

// Función para formatear tallas (ahora acepta array o string)
const formatTallas = (tallas: string[] | string | undefined) => {
  if (!tallas) return { visible: [], extra: 0 }

  let tallasArray: string[]
  if (Array.isArray(tallas)) {
    tallasArray = tallas
  } else {
    tallasArray = tallas.split(',').map(t => t.trim()).filter(t => t)
  }

  const maxVisible = 3 // Mostrar máximo 3 tallas
  return {
    visible: tallasArray.slice(0, maxVisible),
    extra: Math.max(0, tallasArray.length - maxVisible)
  }
}

// Función para formatear colores (ahora acepta array de objetos Color)
const formatColores = (colores: any[] | undefined) => {
  if (!colores || !Array.isArray(colores) || colores.length === 0) {
    return { visible: [], extra: 0 }
  }

  const maxVisible = 3 // Mostrar máximo 3 colores
  return {
    visible: colores.slice(0, maxVisible),
    extra: Math.max(0, colores.length - maxVisible)
  }
}

onMounted(() => {
  cargarProductos()
})

// Funciones para el modal de imagen
const mostrarImagenGrande = (producto: Producto) => {
  if (producto.imagenes) {
    imagenHover.value = {
      src: producto.imagenes,
      nombre: producto.nombre
    }
  }
}

const cerrarImagenGrande = () => {
  imagenHover.value = null
}
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestión del inventario de productos</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nuevo Producto
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="busqueda"
          type="text"
          class="search-input"
          placeholder="Buscar producto, categoría, género..."
        />
        <button v-if="busqueda" @click="busqueda = ''" class="search-clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 70px;">Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Género</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Tallas</th>
            <th>Colores</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productosFiltrados" :key="producto.id">
            <td>
              <div
                class="product-thumb-wrapper"
                @click="mostrarImagenGrande(producto)"
              >
                <img
                  :src="producto.imagenes || '/placeholder.jpg'"
                  :alt="producto.nombre"
                  class="product-thumb"
                />
                <div class="zoom-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                  </svg>
                </div>
              </div>
            </td>
            <td class="fw-medium">{{ producto.nombre }}</td>
            <td>
              <span class="category-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                {{ producto.categoria?.nombre || 'Sin categoría' }}
              </span>
            </td>
            <td>
              <span :class="['genero-badge', getGeneroClass(producto.genero || 'unisex')]">
                {{ getGeneroLabel(producto.genero || 'unisex') }}
              </span>
            </td>
            <td class="price-cell">
              <span class="price">{{ Number(producto.precio).toFixed(2) }}</span>
              <span class="currency">Bs</span>
            </td>
            <td>
              <span :class="['stock-badge', Number(producto.stock) > 10 ? 'stock-good' : Number(producto.stock) > 0 ? 'stock-low' : 'stock-out']">
                <span class="stock-dot"></span>
                {{ producto.stock }}
              </span>
            </td>
            <td>
              <div class="tallas-container" v-if="formatTallas(producto.tallas).visible.length > 0">
                <span
                  v-for="t in formatTallas(producto.tallas).visible"
                  :key="t"
                  class="talla-chip"
                >
                  {{ t }}
                </span>
                <span
                  v-if="formatTallas(producto.tallas).extra > 0"
                  class="talla-more"
                  :title="`${formatTallas(producto.tallas).extra} tallas más`"
                >
                  +{{ formatTallas(producto.tallas).extra }}
                </span>
              </div>
              <span v-else class="no-data">Sin tallas</span>
            </td>
            <td>
              <div class="colores-container" v-if="formatColores(producto.colores).visible.length > 0">
                <div
                  v-for="color in formatColores(producto.colores).visible"
                  :key="color.id"
                  class="color-indicator"
                  :style="{ background: color.codigoHex || '#ccc' }"
                  :title="color.nombre"
                ></div>
                <span
                  v-if="formatColores(producto.colores).extra > 0"
                  class="color-more"
                  :title="`${formatColores(producto.colores).extra} colores más`"
                >
                  +{{ formatColores(producto.colores).extra }}
                </span>
              </div>
              <span v-else class="no-data">Sin colores</span>
            </td>
            <td class="actions-cell">

                <!-- BOTON PARA VISUALIZAR INFORMACION COMPLETA DE PRODUCTO -->
              <button
                class="btn-icon btn-view"
                @click="abrirDetalleProducto(producto)"
                title="Ver detalle"
              >
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>

              <button class="btn-icon btn-edit" @click="abrirModalEditar(producto)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarProducto(producto.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="productosFiltrados.length === 0 && busqueda">
            <td colspan="9" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="productos.length === 0 && !busqueda">
            <td colspan="9" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <p>No hay productos registrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Contador de registros -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ productosFiltrados.length }} de {{ productos.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <ProductoSave
      :show="showModal"
      :producto="productoSeleccionado"
      @close="cerrarModal"
      @saved="onProductoGuardado"
    />

    <!-- Modal de detalle del producto DE VER -->
<div
  v-if="showViewModal && productoDetalle"
  class="modal-overlay"
  @click="cerrarDetalleProducto"
>
  <div class="modal-container" @click.stop>

    <div class="modal-header">
      <h2>Detalle del Producto</h2>

      <button
        class="modal-close"
        @click="cerrarDetalleProducto"
      >
        ✕
      </button>
    </div>

    <div class="modal-body">

      <img
        :src="productoDetalle.imagenes"
        :alt="productoDetalle.nombre"
        class="detalle-imagen"
      />

      <div class="detalle-info">
        <p><strong>Nombre:</strong> {{ productoDetalle.nombre }}</p>

        <p><strong>Categoría:</strong>
          {{ productoDetalle.categoria?.nombre }}
        </p>

        <p><strong>Género:</strong>
          {{ productoDetalle.genero }}
        </p>

        <p><strong>Precio:</strong>
          Bs {{ Number(productoDetalle.precio).toFixed(2) }}
        </p>

        <p><strong>Stock:</strong>
          {{ productoDetalle.stock }}
        </p>
          <!-- TALLAS DE VER -->
         <div>
            <strong>Tallas:</strong>

            <div class="detalle-tallas">
              <span
                v-for="talla in productoDetalle.tallas"
                :key="talla"
                class="talla-chip"
              >
                {{ talla }}
              </span>
            </div>
          </div>

          <!-- COLORES DE VER -->
          
          <div class="detalle-seccion">
            <strong>Colores:</strong>

            <div class="detalle-colores">

              <div
                v-for="color in productoDetalle.colores"
                :key="color.id"
                class="detalle-color"
              >
                <span
                  class="color-circle"
                  :style="{ backgroundColor: color.codigoHex }"
                ></span>

                {{ color.nombre }}

              </div>

            </div>
          </div>
      </div>
    </div>
  </div>
</div>

    <!-- Modal de Imagen -->
    <Teleport to="body">
      <Transition name="image-modal">
        <div v-if="imagenHover" class="image-modal-overlay" @click="cerrarImagenGrande">
          <button class="image-modal-close" @click="cerrarImagenGrande">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="image-modal-content" @click.stop>
            <img
              :src="imagenHover.src"
              :alt="imagenHover.nombre"
              class="image-modal-img"
            />
            <div class="image-modal-caption">{{ imagenHover.nombre }}</div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.list-container {
  background: linear-gradient(180deg, rgba(235, 246, 255, 0.98), rgba(221, 236, 255, 0.9));
  min-height: calc(100vh - 140px);
  padding: 26px 28px 32px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 30px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 50px rgba(32, 86, 171, 0.09);
  border: 1px solid rgba(94, 129, 255, 0.14);
  gap: 24px;
  margin-bottom: 22px;
}

.page-title {
  font-size: 2.05rem;
  font-weight: 700;
  letter-spacing: -0.8px;
  color: #13315f;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #4c6c8c;
  letter-spacing: 0.3px;
  margin: 0;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #9ac5ff 0%, #7198ff 100%);
  color: #0e2f68;
  border: none;
  padding: 14px 32px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(81, 111, 229, 0.18);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(56, 98, 212, 0.24);
  background: linear-gradient(135deg, #80a8ff 0%, #5178ed 100%);
}

.btn-action svg {
  transition: transform 0.3s ease;
}

.btn-action:hover svg {
  transform: rotate(90deg);
}

/* Search Bar */
.search-bar {
  padding: 22px 0 20px;
}

.search-input-wrapper {
  position: relative;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(94, 129, 255, 0.18);
  border-radius: 18px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #7b8ca7;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 42px 0 48px;
  border: none;
  font-size: 0.95rem;
  color: #25324d;
  background: transparent;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(93, 146, 255, 0.12);
}

.search-input::placeholder {
  color: #98a6bf;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(94, 129, 255, 0.1);
  border: none;
  color: #3859a1;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}

.search-clear:hover {
  background: rgba(94, 129, 255, 0.18);
  color: #1f3d7d;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(94, 129, 255, 0.14);
  box-shadow: 0 22px 50px rgba(32, 86, 171, 0.08);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table thead {
  background: linear-gradient(135deg, rgba(219, 233, 255, 0.98), rgba(200, 222, 255, 0.98));
}

.data-table th {
  padding: 18px 22px;
  text-align: left;
  font-weight: 700;
  font-size: 0.75rem;
  color: #3b5374;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(32, 86, 171, 0.1);
}

.data-table tbody tr {
  border-bottom: 1px solid rgba(32, 86, 171, 0.08);
  transition: all 0.25s ease;
}

.data-table tbody tr:hover {
  background: rgba(93, 146, 255, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(32, 86, 171, 0.08);
}

.data-table td {
  padding: 16px 18px;
  color: #1f2f47;
  vertical-align: middle;
}

.data-table td.fw-medium {
  font-weight: 600;
  color: #1a1a1a;
}

.product-thumb-wrapper {
  position: relative;
  width: 55px;
  height: 55px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-thumb-wrapper:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.zoom-hint {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.zoom-hint svg {
  color: white;
}

.product-thumb-wrapper:hover .zoom-hint {
  opacity: 1;
}

.product-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #495057;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.category-badge:hover {
  background: linear-gradient(135deg, #dee2e6 0%, #ced4da 100%);
}

.genero-badge {
  display: inline-block;
  padding: 5px 14px;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.genero-hombre {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
}

.genero-mujer {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  color: #c2185b;
}

.genero-unisex {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
}

.price-cell {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2e7d32;
}

.currency {
  font-size: 0.7rem;
  color: #666;
  font-weight: 500;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.stock-good {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
}

.stock-good .stock-dot {
  background: #4caf50;
}

.stock-low {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  color: #f57f17;
}

.stock-low .stock-dot {
  background: #ffc107;
}

.stock-out {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
}

.stock-out .stock-dot {
  background: #f44336;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.color-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: inline-block;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.color-indicator:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.colores-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.color-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 24px;
  padding: 0 6px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: help;
}

.no-data {
  color: #adb5bd;
  font-size: 0.8rem;
  font-style: italic;
}

.tallas-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.talla-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 26px;
  padding: 0 8px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #333;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.talla-chip:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  transform: translateY(-1px);
}

.talla-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 26px;
  padding: 0 8px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: help;
}

.actions-cell {
  text-align: right;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-left: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-edit {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #d32f2f;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
}

.empty-state {
  text-align: center;
  padding: 60px 20px !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-content svg {
  color: #bdbdbd;
}

.empty-content p {
  color: #757575;
  font-size: 1rem;
  margin: 0;
}

/* Table Footer */
.table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba(32,86,171,0.12);
  background: rgba(234,246,255,0.75);
}

.records-count {
  font-size: 0.8rem;
  color: #888;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }

  .page-title {
    font-size: 1.5rem;
  }
}

/* Image Modal Styles */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.image-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;
}

.image-modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.image-modal-content {
  position: relative;
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-modal-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.image-modal-caption {
  margin-top: 16px;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Transiciones del modal */
.image-modal-enter-active,
.image-modal-leave-active {
  transition: all 0.2s ease;
}

.image-modal-enter-from,
.image-modal-leave-to {
  opacity: 0;
}

.image-modal-enter-from .image-modal-content,
.image-modal-leave-to .image-modal-content {
  transform: scale(0.9);
}

/* MODAL PARA VER DETALLE DEL PRODUCTO DE VER */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(252, 253, 253, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding-top: 20px;
}

.modal-container {
  width: 100%;
  max-width: 700px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(0,0,0,0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #13315f;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: #eef4ff;
  color: #13315f;
  font-size: 1.1rem;
}

.modal-close:hover {
  background: #dbe8ff;
}

.modal-body {
  padding: 28px;
}
 /* detalles de la imagen */

.detalle-imagen {
  width: 100%;
  max-height: 310px;
  object-fit: contain;

  background: linear-gradient(
    135deg,
    rgba(249, 250, 250, 0.95),
    rgba(248, 247, 247, 0.95)
  );

  border: 1px solid rgba(2, 4, 14, 0.15);

  padding: 20px;

  border-radius: 18px;

  margin-bottom: 20px;
}

.detalle-info {
  background: rgba(219, 233, 255, 0.85);

  border: 1px solid rgba(94, 129, 255, 0.18);

  border-radius: 18px;

  padding: 20px;

  margin-bottom: 20px;
}

.detalle-info p {
  margin-bottom: 14px;
  font-size: 0.95rem;
  color: #2b3f5f;
}

.detalle-info strong {
  color: #13315f;
}

.detalle-tallas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.detalle-colores {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.detalle-color {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 14px;

  border-radius: 20px;

  background: #eef4ff;

  color: #13315f;

  font-size: 0.85rem;

  font-weight: 600;

  border: 1px solid rgba(94, 129, 255, 0.2);
}

/* Indicador de color en forma de círculo */

.color-circle {
  width: 18px;
  height: 18px;

  border-radius: 50%;

  border: 2px solid #ffffff;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  flex-shrink: 0;
}

.detalle-seccion {
  margin-top: 18px;
}

.detalle-seccion strong {
  display: block;
  margin-bottom: 12px;
  color: #13315f;
}

.detalle-colores {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  padding: 12px;

  background: rgba(233, 244, 255, 0.55);

  border: 1px solid rgba(94, 129, 255, 0.15);

  border-radius: 14px;
}


</style>
