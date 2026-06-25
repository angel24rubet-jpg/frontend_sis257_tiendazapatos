<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { Producto, ProductoDTO } from '@/models/producto'
import type { Categoria } from '@/models/categoria'
import type { Color } from '@/models/color'
import http from '@/plugins/axios'

const props = defineProps<{
  show: boolean
  producto?: Producto
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const nombre = ref('')
const descripcion = ref('')
const precio = ref<number>(0)
const stock = ref<number>(0)
const tallasSeleccionadas = ref<string[]>([])
const coloresSeleccionados = ref<number[]>([])
const genero = ref('unisex')
const imagenes = ref('')
const idCategoria = ref<number | null>(null)
const idMarca = ref<number | null>(null)

// predefined size sets
const clothingSizes = ['XS','S','M','L','XL','XXL']
const shoeSizes = ['18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48']
const otherSizes = ['Única']

const categorias = ref<Categoria[]>([])
const colores = ref<Color[]>([])
const marcas = ref<any[]>([]) // Add this line
const isEdit = ref(false)

const cargarCategorias = async () => {
  try {
    const { data } = await http.get('categorias')
    categorias.value = data
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}
 // Metodo para cargar marcas desde el backend
const cargarMarcas = async () => {
  try {
    const { data } = await http.get('marcas')
    marcas.value = data
  } catch (error) {
    console.error('Error al cargar marcas:', error)
  }
}

const cargarColores = async () => {
  try {
    const { data } = await http.get('colores')
    colores.value = data
  } catch (error) {
    console.error('Error al cargar colores:', error)
  }
}

// Solo tallas de zapatos
const sizesList = computed(() => {
  return shoeSizes
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.producto) {
        isEdit.value = true
        nombre.value = props.producto.nombre
        descripcion.value = props.producto.descripcion
        precio.value = props.producto.precio
        stock.value = props.producto.stock
        // Parsear tallas existentes
        const tallaExistente = props.producto.tallas || props.producto.talla
        if (tallaExistente) {
          if (Array.isArray(tallaExistente)) {
            tallasSeleccionadas.value = tallaExistente
          } else {
            tallasSeleccionadas.value = tallaExistente.split(',').map((t: string) => t.trim()).filter((t: string) => t)
          }
        } else {
          tallasSeleccionadas.value = []
        }
        // Parsear colores existentes (ahora son objetos con id)
        if (props.producto.colores && Array.isArray(props.producto.colores)) {
          coloresSeleccionados.value = props.producto.colores.map((c: any) =>
            typeof c === 'object' ? c.id : c
          )
        } else {
          coloresSeleccionados.value = []
        }
        genero.value = props.producto.genero || 'unisex'
        imagenes.value = props.producto.imagenes
        idCategoria.value = props.producto.idCategoria
      } else {
        isEdit.value = false
        resetForm()
      }
      cargarCategorias()
      cargarColores()
      
    }
  }
)

// when category changes, reset tallas if they don't match the new list
watch(idCategoria, () => {
  tallasSeleccionadas.value = tallasSeleccionadas.value.filter(t => sizesList.value.includes(t))
})

const resetForm = () => {
  nombre.value = ''
  descripcion.value = ''
  precio.value = 0
  stock.value = 0
  tallasSeleccionadas.value = []
  coloresSeleccionados.value = []
  genero.value = 'unisex'
  imagenes.value = ''
  idCategoria.value = null
}

const toggleTalla = (talla: string) => {
  const index = tallasSeleccionadas.value.indexOf(talla)
  if (index === -1) {
    tallasSeleccionadas.value.push(talla)
  } else {
    tallasSeleccionadas.value.splice(index, 1)
  }
}

const isTallaSelected = (talla: string) => {
  return tallasSeleccionadas.value.includes(talla)
}

const selectAllTallas = () => {
  tallasSeleccionadas.value = [...sizesList.value]
}

const clearAllTallas = () => {
  tallasSeleccionadas.value = []
}

const toggleColor = (colorId: number) => {
  const index = coloresSeleccionados.value.indexOf(colorId)
  if (index === -1) {
    coloresSeleccionados.value.push(colorId)
  } else {
    coloresSeleccionados.value.splice(index, 1)
  }
}

const isColorSelected = (colorId: number) => {
  return coloresSeleccionados.value.includes(colorId)
}
 // GUARDAR PRODUCTO
const guardarProducto = async () => {
  if (
      !nombre.value.trim() ||
      !descripcion.value.trim() ||
      !idCategoria.value ||
      !idMarca.value
    ) {
      alert('Por favor complete todos los campos obligatorios')
      return
    }

  if (tallasSeleccionadas.value.length === 0) {
    alert('Por favor seleccione al menos una talla')
    return
  }

  if (coloresSeleccionados.value.length === 0) {
    alert('Por favor seleccione al menos un color')
    return
  }

  const productoData: ProductoDTO = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: Number(precio.value),
    stock: Number(stock.value),
    tallas: tallasSeleccionadas.value,
    colores: coloresSeleccionados.value,
    genero: genero.value,
    imagenes: imagenes.value,
    idCategoria: Number(idCategoria.value),
    idMarca: Number(idMarca.value),
  }

  try {
    if (isEdit.value && props.producto) {
      await http.patch(`productos/${props.producto.id}`, productoData)
    } else {
      // PETICION POST PARA CREAR UN NUEVO PRODUCTO
      await http.post('productos', productoData)
    }
    emit('saved')
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar producto:', error)
    const mensaje = error.response?.data?.message || 'No se pudo guardar el producto'
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje)
  }
}

const cerrarModal = () => {
  resetForm()
  emit('close')
}

onMounted(() => {
  cargarCategorias()
  cargarColores()
  cargarMarcas() // Cargar marcas al montar el componente
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- BOTON GUARDAR PRODUCTO -->
          <form @submit.prevent="guardarProducto" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre" class="form-label">Nombre del Producto *</label>
                <input
                  v-model="nombre"
                  type="text"
                  class="form-input"
                  id="nombre"
                  placeholder="Camisa de algodón..."
                  maxlength="100"
                  required
                />
              </div>

              <div class="form-group">
                <label for="categoria" class="form-label">Categoría *</label>
                <select v-model="idCategoria" class="form-input form-select" id="categoria" required>
                  <option :value="null" disabled>Selecciona una categoría</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>

              <!-- COMBO DE MARCA -->

              <div class="form-group">
                <label for="marca" class="form-label">Marca *</label>

                <select
                  v-model="idMarca"
                  class="form-input form-select"
                  id="marca"
                  required
                >
                  <option :value="null" disabled>
                    Selecciona una marca
                  </option>

                  <option
                    v-for="marca in marcas"
                    :key="marca.id"
                    :value="marca.id"
                  >
                    {{ marca.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group form-group-full">
                <label for="descripcion" class="form-label">Descripción *</label>
                <textarea
                  v-model="descripcion"
                  class="form-textarea"
                  id="descripcion"
                  rows="3"
                  placeholder="Describe las características..."
                  maxlength="500"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label for="precio" class="form-label">Precio (Bs.) *</label>
                <input
                  v-model.number="precio"
                  type="number"
                  class="form-input"
                  id="precio"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>

              <div class="form-group">
                <label for="stock" class="form-label">Stock *</label>
                <input
                  v-model.number="stock"
                  type="number"
                  class="form-input"
                  id="stock"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              <div class="form-group">
                <label for="talla" class="form-label">Tallas * (selección múltiple)</label>
                <div class="tallas-container">
                  <div class="tallas-actions">
                    <button type="button" class="talla-action-btn" @click="selectAllTallas">Todas</button>
                    <button type="button" class="talla-action-btn" @click="clearAllTallas">Ninguna</button>
                    <span class="tallas-count">{{ tallasSeleccionadas.length }} seleccionadas</span>
                  </div>
                  <div class="tallas-grid">
                    <button
                      v-for="size in sizesList"
                      :key="size"
                      type="button"
                      class="talla-chip"
                      :class="{ selected: isTallaSelected(size) }"
                      @click="toggleTalla(size)"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Colores * (selección múltiple)</label>
                <div class="colores-container">
                  <div class="colores-grid" v-if="colores.length > 0">
                    <button
                      v-for="color in colores"
                      :key="color.id"
                      type="button"
                      class="color-chip"
                      :class="{ selected: isColorSelected(color.id) }"
                      @click="toggleColor(color.id)"
                      :title="color.nombre"
                    >
                      <span
                        class="color-dot"
                        :style="{ backgroundColor: color.codigoHex || '#ccc' }"
                      ></span>
                      <span class="color-name">{{ color.nombre }}</span>
                    </button>
                  </div>
                  <p v-else class="no-colors">No hay colores registrados. <RouterLink to="/colores">Crear colores</RouterLink></p>
                  <span class="colores-count">{{ coloresSeleccionados.length }} seleccionados</span>
                </div>
              </div>

              <div class="form-group">
                <label for="genero" class="form-label">Género *</label>
                <select v-model="genero" class="form-input form-select" id="genero" required>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div class="form-group form-group-full">
                <label for="imagenes" class="form-label">URL de Imagen *</label>
                <input
                  v-model="imagenes"
                  type="url"
                  class="form-input"
                  id="imagenes"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </div>

              <div class="form-group form-group-full" v-if="imagenes">
                <label class="form-label">Vista Previa</label>
                <div class="image-preview">
                  <img :src="imagenes" alt="Preview" @error="() => {}" />
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ isEdit ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Overlay del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top, rgba(131, 201, 255, 0.18), transparent 34%),
    rgba(18, 50, 94, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

/* Contenedor del modal */
.modal-container {
  background: rgba(255, 255, 255, 0.98);
  width: 100%;
  max-width: 780px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 32px;
  box-shadow: 0 28px 80px rgba(14, 46, 112, 0.16);
  border: 1px solid rgba(94, 129, 255, 0.16);
}

/* Header del modal */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 28px 30px;
  background: linear-gradient(135deg, rgba(233, 244, 255, 0.96), rgba(244, 250, 255, 0.98));
  border-bottom: 1px solid rgba(94, 129, 255, 0.14);
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.8px;
  color: #13315f;
  margin: 0;
}

.modal-close {
  background: rgba(20, 40, 85, 0.06);
  border: 1px solid rgba(20, 40, 85, 0.12);
  border-radius: 50%;
  color: #1d3a6f;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(20, 40, 85, 0.12);
  color: #0f2144;
}

.modal-close:hover {
  color: #000000;
}

/* Body del modal */
.modal-body {
  padding: 30px 32px 28px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-label {
  display: block;
  color: #2d4a7f;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.form-input,
.form-select {
  width: 100%;
  min-height: 56px;
  border: 1px solid rgba(94, 129, 255, 0.22);
  border-radius: 18px;
  font-size: 1rem;
  color: #1f2d3d;
  background: rgba(255,255,255,0.98);
  padding: 0 18px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-textarea {
  width: 100%;
  border: 1px solid rgba(94, 129, 255, 0.22);
  border-radius: 18px;
  font-size: 1rem;
  color: #1f2d3d;
  background: rgba(255,255,255,0.98);
  padding: 18px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  resize: vertical;
  font-family: inherit;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #d1d5db;
  font-weight: 300;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #5d92ff;
  box-shadow: 0 0 0 4px rgba(93, 146, 255, 0.14);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23172f4c' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  padding-right: 46px;
}

.image-preview {
  border: 1px solid #e5e5e5;
  padding: 20px;
  display: inline-block;
}

.image-preview img {
  max-width: 150px;
  max-height: 150px;
  display: block;
}

/* Tallas múltiples */
.tallas-container {
  border: 1px solid rgba(94, 129, 255, 0.18);
  padding: 18px;
  background: rgba(236, 244, 255, 0.88);
  border-radius: 22px;
}

.tallas-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(94, 129, 255, 0.14);
}

.talla-action-btn {
  background: #ffffff;
  border: 1px solid rgba(94, 129, 255, 0.24);
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  border-radius: 999px;
}

.talla-action-btn:hover {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.tallas-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: #666666;
  letter-spacing: 0.3px;
}

.tallas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.talla-chip {
  min-width: 58px;
  height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(94, 129, 255, 0.2);
  background: #ffffff;
  color: #1f2d3d;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.talla-chip:hover {
  border-color: rgba(94, 129, 255, 0.4);
}

.talla-chip.selected {
  background: linear-gradient(135deg, #81b0ff 0%, #5d92ff 100%);
  color: #ffffff;
  border-color: transparent;
}

/* Colores múltiples */
.colores-container {
  border: 1px solid rgba(94, 129, 255, 0.18);
  padding: 18px;
  background: rgba(236, 244, 255, 0.88);
  border-radius: 22px;
}

.colores-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.color-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: 1px solid rgba(94, 129, 255, 0.18);
  background: #ffffff;
  color: #1f2d3d;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 14px;
}

.color-chip:hover {
  border-color: rgba(94, 129, 255, 0.34);
}

.color-chip.selected {
  background: linear-gradient(135deg, #81b0ff 0%, #5d92ff 100%);
  color: #ffffff;
  border-color: transparent;
}

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(20, 40, 85, 0.16);
  flex-shrink: 0;
}

.color-chip.selected .color-dot {
  border-color: rgba(255,255,255,0.3);
}

.color-name {
  white-space: nowrap;
}

.colores-count {
  font-size: 0.75rem;
  color: #666666;
  letter-spacing: 0.3px;
}

.no-colors {
  font-size: 0.875rem;
  color: #666666;
  margin: 0 0 12px 0;
}

.no-colors a {
  color: #000000;
  font-weight: 500;
}

/* Footer del modal */
.modal-footer {
  display: flex;
  gap: 14px;
  padding-top: 30px;
  border-top: 1px solid rgba(94, 129, 255, 0.18);
  margin-top: 30px;
}

.btn-primary {
  background: linear-gradient(135deg, #5d92ff 0%, #3f6cef 100%);
  color: #ffffff;
  border: none;
  padding: 16px 34px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
  flex: 1;
  border-radius: 16px;
  box-shadow: 0 16px 34px rgba(63, 108, 255, 0.18);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #3f6cef 0%, #2e57da 100%);
}

.btn-secondary {
  background: rgba(255,255,255,0.92);
  color: #0f2144;
  border: 1px solid rgba(94, 129, 255, 0.28);
  padding: 16px 34px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
  flex: 1;
  border-radius: 16px;
}

.btn-secondary:hover {
  background: rgba(94, 129, 255, 0.08);
}

/* Animación del modal */
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

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }
}
</style>
