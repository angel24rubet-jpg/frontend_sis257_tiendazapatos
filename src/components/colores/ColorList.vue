<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Color } from '@/models/color'
import http from '@/plugins/axios'
import ColorSave from './ColorSave.vue'

const colores = ref<Color[]>([])
const showModal = ref(false)
const colorSeleccionado = ref<Color | undefined>(undefined)
const busqueda = ref('')

// Filtrar colores por búsqueda
const coloresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return colores.value
  const termino = busqueda.value.toLowerCase().trim()
  return colores.value.filter(c =>
    c.nombre?.toLowerCase().includes(termino) ||
    c.codigoHex?.toLowerCase().includes(termino) ||
    c.id.toString().includes(termino)
  )
})

const cargarColores = async () => {
  try {
    const { data } = await http.get('colores')
    colores.value = data.sort((a: Color, b: Color) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar colores:', error)
  }
}

const eliminarColor = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este color?')) {
    try {
      await http.delete(`colores/${id}`)
      await cargarColores()
    } catch (error) {
      console.error('Error al eliminar color:', error)
      alert('No se pudo eliminar el color. Puede estar asociado a productos.')
    }
  }
}

const abrirModalCrear = () => {
  colorSeleccionado.value = undefined
  showModal.value = true
}

const abrirModalEditar = (color: Color) => {
  colorSeleccionado.value = color
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  colorSeleccionado.value = undefined
}

const onColorGuardado = () => {
  cargarColores()
}

onMounted(() => cargarColores())
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Colores</h1>
        <p class="page-subtitle">Gestión de colores para productos</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nuevo Color
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
          placeholder="Buscar color..."
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
            <th>ID</th>
            <th>Vista Previa</th>
            <th>Nombre</th>
            <th>Código Hex</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="color in coloresFiltrados" :key="color.id">
            <td>
              <span class="id-badge">#{{ color.id }}</span>
            </td>
            <td>
              <div class="color-preview">
                <div
                  class="color-swatch"
                  :style="{ backgroundColor: color.codigoHex || '#ccc' }"
                ></div>
                <div class="color-ring" :style="{ borderColor: color.codigoHex || '#ccc' }"></div>
              </div>
            </td>
            <td class="fw-medium">{{ color.nombre }}</td>
            <td>
              <span class="hex-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                {{ color.codigoHex || '-' }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(color)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarColor(color.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="coloresFiltrados.length === 0 && busqueda">
            <td colspan="5" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="colores.length === 0 && !busqueda">
            <td colspan="5" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="13.5" cy="6.5" r="2.5"/>
                  <circle cx="17.5" cy="10.5" r="2.5"/>
                  <circle cx="8.5" cy="7.5" r="2.5"/>
                  <circle cx="6.5" cy="12.5" r="2.5"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
                </svg>
                <p>No hay colores registrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Contador de registros -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ coloresFiltrados.length }} de {{ colores.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <ColorSave
      :show="showModal"
      :color="colorSeleccionado"
      @close="cerrarModal"
      @saved="onColorGuardado"
    />
  </div>
</template>

<style scoped>
.list-container {
  background: linear-gradient(180deg, #eef6ff 0%, #f8fbff 100%);
  min-height: calc(100vh - 140px);
  padding: 28px 24px 36px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 28px 28px 24px;
  background: rgba(255, 255, 255, 0.86);
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(38, 78, 142, 0.08);
  margin-bottom: 24px;
}

.page-title {
  font-size: 2.4rem;
  font-weight: 600;
  letter-spacing: -0.6px;
  color: #102a43;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1rem;
  color: #4a5568;
  letter-spacing: 0.2px;
  margin: 0;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #81b0ff 0%, #5d92ff 100%);
  color: #fff;
  border: none;
  padding: 14px 30px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 14px;
  box-shadow: 0 18px 50px rgba(38, 78, 142, 0.12);
}

.btn-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 48px rgba(38, 78, 142, 0.16);
  background: linear-gradient(135deg, #5d92ff 0%, #3f6cef 100%);
}

.btn-action svg {
  transition: transform 0.3s ease;
}

.btn-action:hover svg {
  transform: rotate(90deg);
}

/* Search Bar */
.search-bar {
  padding: 22px 0 18px;
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  max-width: 420px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(63, 109, 255, 0.16);
  border-radius: 18px;
  padding: 8px 14px;
  box-shadow: inset 0 1px 2px rgba(16, 42, 67, 0.08);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 40px 0 46px;
  border: none;
  font-size: 1rem;
  color: #1f2d3d;
  background: transparent;
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: #aaa;
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.search-clear:hover {
  color: #333;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(28, 88, 180, 0.08);
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(63, 109, 255, 0.12);
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  font-size: 0.96rem;
}

.data-table thead {
  background: linear-gradient(135deg, #dbe9ff 0%, #c8deff 100%);
  border-radius: 20px;
}

.data-table th {
  padding: 18px 22px;
  text-align: left;
  font-weight: 700;
  font-size: 0.85rem;
  color: #2f4a7b;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  border-bottom: none;
}

.data-table tbody tr {
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(63, 109, 255, 0.08);
  border-radius: 20px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.data-table tbody tr:hover {
  background: rgba(235,244,255,0.9);
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(32, 86, 171, 0.08);
}

.data-table td {
  padding: 18px 22px;
  color: #1f2d3d;
  vertical-align: middle;
}

.data-table td.fw-medium {
  font-weight: 600;
  color: #1a1a1a;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #5c86ff 0%, #4680ff 100%);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  border-radius: 999px;
}

.color-preview {
  position: relative;
  width: 44px;
  height: 44px;
}

.color-swatch {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.color-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.data-table tbody tr:hover .color-swatch {
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.data-table tbody tr:hover .color-ring {
  opacity: 0.6;
  transform: scale(1.1);
}

.hex-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
}

.hex-badge:hover {
  background: linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%);
}

.actions-cell {
  text-align: right;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.25s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #d7e7ff 0%, #b1cbff 100%);
  color: #1d4ed8;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #4f74ff 0%, #2a5cff 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(30, 78, 255, 0.18);
}

.btn-delete {
  background: linear-gradient(135deg, #ffd7dd 0%, #ffb3c4 100%);
  color: #b91c1c;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ef4e60 0%, #d32f2f 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(211, 47, 47, 0.18);
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
</style>
