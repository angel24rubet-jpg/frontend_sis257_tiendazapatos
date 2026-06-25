<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import CategoriaSave from './CategoriaSave.vue'

const categorias = ref<Categoria[]>([])
const showModal = ref(false)
const categoriaSeleccionada = ref<Categoria | undefined>(undefined)
const busqueda = ref('')

// Filtrar categorías por búsqueda
const categoriasFiltradas = computed(() => {
  if (!busqueda.value.trim()) return categorias.value
  const termino = busqueda.value.toLowerCase().trim()
  return categorias.value.filter(cat =>
    cat.nombre.toLowerCase().includes(termino) ||
    cat.id.toString().includes(termino)
  )
})

const cargarCategorias = async () => {
  try {
    const { data } = await http.get('categorias')
    // Ordenar por ID de forma ascendente
    categorias.value = data.sort((a: Categoria, b: Categoria) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

const eliminarCategoria = async (id: number) => {
  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    try {
      await http.delete(`categorias/${id}`)
      await cargarCategorias()
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      alert('No se pudo eliminar la categoría')
    }
  }
}

const abrirModalCrear = () => {
  categoriaSeleccionada.value = undefined
  showModal.value = true
}

const abrirModalEditar = (categoria: Categoria) => {
  categoriaSeleccionada.value = categoria
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  categoriaSeleccionada.value = undefined
}

const onCategoriaGuardada = () => {
  cargarCategorias()
}

onMounted(() => {
  cargarCategorias()
})
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Categorías</h1>
        <p class="page-subtitle">Gestión de categorías de productos</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nueva Categoría
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
          placeholder="Buscar categoría..."
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
            <th>Nombre</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="categoria in categoriasFiltradas" :key="categoria.id">
            <td>
              <span class="id-badge">#{{ categoria.id }}</span>
            </td>
            <td class="fw-medium">{{ categoria.nombre }}</td>
            <td class="text-end actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(categoria)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarCategoria(categoria.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="categoriasFiltradas.length === 0 && busqueda">
            <td colspan="3" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="categorias.length === 0 && !busqueda">
            <td colspan="3" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <p>No hay categorías registradas</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Contador de registros abajo a la derecha -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ categoriasFiltradas.length }} de {{ categorias.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <CategoriaSave
      :show="showModal"
      :categoria="categoriaSeleccionada"
      @close="cerrarModal"
      @saved="onCategoriaGuardada"
    />
  </div>
</template>

<style scoped>
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

/* Table */
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
  padding: 18px 22px;
  color: #1f2f47;
  vertical-align: middle;
}

.data-table td.fw-medium {
  font-weight: 600;
  color: #1a1a1a;
}

/* ID Badge */
.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
}

/* Action Buttons */
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
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

/* Empty State */
.empty-state {
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

/* Responsive */
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

  .actions-cell {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
