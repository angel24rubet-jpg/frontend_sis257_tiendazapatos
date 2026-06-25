<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import ClienteSave from './ClienteSave.vue'

const clientes = ref<Cliente[]>([])
const showModal = ref(false)
const clienteSeleccionado = ref<Cliente | undefined>(undefined)
const busqueda = ref('')

// Filtrar clientes por búsqueda
const clientesFiltrados = computed(() => {
  if (!busqueda.value.trim()) return clientes.value
  const termino = busqueda.value.toLowerCase().trim()
  return clientes.value.filter(cli =>
    cli.nombre?.toLowerCase().includes(termino) ||
    cli.apellido?.toLowerCase().includes(termino) ||
    cli.telefono?.toLowerCase().includes(termino) ||
    cli.direccion?.toLowerCase().includes(termino) ||
    cli.id.toString().includes(termino)
  )
})

const cargarClientes = async () => {
  try {
    const { data } = await http.get('clientes')
    // Ordenar por ID de forma ascendente
    clientes.value = data.sort((a: Cliente, b: Cliente) => a.id - b.id)
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  }
}

const eliminarCliente = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este cliente?')) {
    try {
      await http.delete(`clientes/${id}`)
      await cargarClientes()
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      alert('No se pudo eliminar el cliente')
    }
  }
}

const abrirModalCrear = () => {
  clienteSeleccionado.value = undefined
  showModal.value = true
}

const abrirModalEditar = (cliente: Cliente) => {
  clienteSeleccionado.value = cliente
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  clienteSeleccionado.value = undefined
}

const onClienteGuardado = () => {
  cargarClientes()
}

onMounted(() => cargarClientes())
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">Gestión de información de clientes</p>
      </div>
      <button class="btn-action" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nuevo Cliente
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
          placeholder="Buscar cliente..."
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
            <th>Apellido</th>
            <!-- OBSERVACIÓN Mostrar CI/NIT en listado de clientes -->
            <th>Cédula / CI</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
            <td>
              <span class="id-badge">#{{ cliente.id }}</span>
            </td>
            <td>
              <div class="cliente-info">
                <div class="cliente-avatar">
                  {{ (cliente.nombre?.charAt(0) || '?').toUpperCase() }}
                </div>
                <span class="fw-medium">{{ cliente.nombre }}</span>
              </div>
            </td>
            <td>{{ cliente.apellido || '-' }}</td>
            <!-- OBSERVACIÓN Mostrar CI/NIT en listado de clientes -->
            <td>{{ cliente.cedula || '-' }}</td>
            <td>
              <span v-if="cliente.telefono" class="info-badge phone-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ cliente.telefono }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <span v-if="cliente.direccion" class="info-badge address-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ cliente.direccion }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td class="actions-cell">
              <button class="btn-icon btn-edit" @click="abrirModalEditar(cliente)" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon btn-delete" @click="eliminarCliente(cliente.id)" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="clientesFiltrados.length === 0 && busqueda">
            <td colspan="6" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No se encontraron resultados para "{{ busqueda }}"</p>
              </div>
            </td>
          </tr>
          <tr v-if="clientes.length === 0 && !busqueda">
            <td colspan="6" class="empty-state">
              <div class="empty-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>No hay clientes registrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Contador de registros -->
      <div class="table-footer">
        <span class="records-count">
          Mostrando {{ clientesFiltrados.length }} de {{ clientes.length }} registros
        </span>
      </div>
    </div>

    <!-- Modal -->
    <ClienteSave
      :show="showModal"
      :cliente="clienteSeleccionado"
      @close="cerrarModal"
      @saved="onClienteGuardado"
    />
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
  padding: 14px 30px;
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
  padding: 18px 22px;
  color: #1f2f47;
  vertical-align: middle;
}

.data-table td.fw-medium {
  font-weight: 600;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
}

.cliente-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cliente-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.data-table tbody tr:hover .cliente-avatar {
  transform: scale(1.1);
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.phone-badge {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
}

.address-badge {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
}

.text-muted {
  color: #adb5bd;
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
</style>
