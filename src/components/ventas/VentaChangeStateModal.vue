<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import http from '@/plugins/axios'

interface Venta {
  id: number
  totalVenta: number
  metodoPago: string
  estado: string
  fechaCreacion: string
  montoPagado: number | null
  cambio: number | null
  numeroSeguimiento?: string | null
  fechaEnvio?: string | null
}

interface StateOption {
  value: string
  label: string
  color: string
  icon: string
  description: string
}

const props = defineProps<{
  show: boolean
  venta?: Venta
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const loading = ref(false)
const selectedState = ref<string | null>(null)

const stateOptions: Record<string, StateOption> = {
  pendiente: {
    value: 'pendiente',
    label: 'Pendiente',
    color: '#f9a825',
    icon: '⏳',
    description: 'Pedido recibido y en espera de procesamiento'
  },
  confirmado: {
    value: 'confirmado',
    label: 'En Proceso',
    color: '#2196f3',
    icon: '⚙',
    description: 'Pago confirmado y pedido en preparación'
  },
  en_preparacion: {
    value: 'en_preparacion',
    label: 'En Preparación',
    color: '#ff9800',
    icon: '🛠',
    description: 'Pedido en embalaje antes de enviarse'
  },
  enviado: {
    value: 'enviado',
    label: 'Enviado',
    color: '#4caf50',
    icon: '📦',
    description: 'Pedido en tránsito hacia el cliente'
  },
  entregado: {
    value: 'entregado',
    label: 'Entregado',
    color: '#2e7d32',
    icon: '✓',
    description: 'Pedido entregado al cliente'
  },
  anulada: {
    value: 'anulada',
    label: 'Anulada',
    color: '#d32f2f',
    icon: '✗',
    description: 'Pedido cancelado'
  }
}

const availableStates = computed(() => {
  if (!props.venta) return []
  return Object.keys(stateOptions).filter((estado) => estado !== props.venta!.estado)
})

const formatDate = (fecha?: string | Date | null) => {
  if (!fecha) return ''
  const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const estadoFormato: Record<string, string> = {
  pendiente: '⏳ Pendiente',
  confirmado: '✓ Confirmado',
  en_preparacion: '⚙ En Preparación',
  enviado: '📦 Enviado',
  entregado: '✓ Entregado',
  anulada: '✗ Anulada'
}

watch(
  [() => props.show, () => props.venta],
  ([show]) => {
    if (show && props.venta) {
      selectedState.value = availableStates.value[0] || null
    }
  }
)

const cambiarEstado = async () => {
  if (!props.venta || !selectedState.value) return

  loading.value = true
  try {
    const confirmMsg = `¿Confirmas cambiar el estado a "${selectedState.value}"?`
    if (!confirm(confirmMsg)) {
      loading.value = false
      return
    }

    await http.patch(`ventas/${props.venta.id}/estado`, { estado: selectedState.value })
    alert('Estado actualizado correctamente')
    emit('saved')
    cerrarModal()
  } catch (err: any) {
    console.error('Error actualizando estado:', err)
    const msg = (err as any)?.response?.data?.message || 'Error al actualizar el estado'
    alert(msg)
  } finally {
    loading.value = false
  }
}

const anularVenta = async () => {
  if (!props.venta) return

  loading.value = true
  try {
    const confirmMsg = `¿Confirmas anular esta venta? Esta acción no se puede deshacer.`
    if (!confirm(confirmMsg)) {
      loading.value = false
      return
    }

    await http.patch(`ventas/${props.venta.id}/estado`, { estado: 'anulada' })
    alert('Venta anulada correctamente')
    emit('saved')
    cerrarModal()
  } catch (err: any) {
    console.error('Error anulando venta:', err)
    const msg = (err as any)?.response?.data?.message || 'Error al anular la venta'
    alert(msg)
  } finally {
    loading.value = false
  }
}

const cerrarModal = () => {
  selectedState.value = null
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && venta" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-content">
              <h2 class="modal-title">Cambiar Estado de Compra</h2>
              <p class="order-info">Venta #{{ venta.id }} - {{ estadoFormato[venta.estado] }}</p>
            </div>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Current Status -->
            <div class="status-section">
              <div class="status-label">Estado Actual</div>
              <div class="status-badge">
                {{ estadoFormato[venta.estado] }}
              </div>
            </div>

            <!-- Available Actions -->
            <div class="actions-section">
              <div class="actions-label">Cambiar a:</div>
              <div class="shipping-summary">
                <div class="summary-row">
                  <span>Estado actual</span>
                  <strong>{{ estadoFormato[venta.estado] }}</strong>
                </div>
                <div v-if="props.venta?.numeroSeguimiento" class="summary-row">
                  <span>Seguimiento</span>
                  <span>{{ props.venta.numeroSeguimiento }}</span>
                </div>
                <div v-if="props.venta?.fechaEnvio" class="summary-row">
                  <span>Fecha envío</span>
                  <span>{{ formatDate(props.venta.fechaEnvio) }}</span>
                </div>
              </div>

              <div class="state-options-grid">
                <button
                  v-for="estado in availableStates"
                  :key="estado"
                  type="button"
                  @click="selectedState = estado"
                  :class="['state-option', { selected: selectedState === estado } ]"
                >
                  <div class="option-header">
                    <span class="option-icon">{{ stateOptions[estado].icon }}</span>
                    <span class="option-label">{{ stateOptions[estado].label }}</span>
                  </div>
                  <div class="option-description">
                    {{ stateOptions[estado].description }}
                  </div>
                </button>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="info-section">
              <div class="info-item">
                <span class="info-label">Total:</span>
                <span class="info-value">Bs. {{ venta.totalVenta.toFixed(2) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Método de Pago:</span>
                <span class="info-value">{{ venta.metodoPago === 'tarjeta' ? 'Tarjeta' : venta.metodoPago === 'qr' ? 'QR' : 'Efectivo' }}</span>
              </div>
            </div>

            <!-- Danger Zone -->
            <div v-if="venta.estado !== 'anulada' && venta.estado !== 'entregado'" class="danger-zone">
              <div class="danger-label">Zona de Peligro</div>
              <button
                type="button"
                @click="anularVenta"
                :disabled="loading"
                class="btn-danger"
              >
                ✗ Anular Esta Venta
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              type="button"
              @click="cerrarModal"
              :disabled="loading"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="cambiarEstado"
              :disabled="!selectedState || loading"
              class="btn-primary"
            >
              {{ loading ? 'Actualizando...' : 'Actualizar Estado' }}
            </button>
          </div>
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
  z-index: 10000;
  padding: 16px;
}

/* Contenedor del modal */
.modal-container {
  background: rgba(255, 255, 255, 0.98);
  width: 100%;
  max-width: 520px;
  border-radius: 32px;
  box-shadow: 0 28px 80px rgba(14, 46, 112, 0.16);
  border: 1px solid rgba(94, 129, 255, 0.16);
  overflow: hidden;
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
}

.header-content {
  flex: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: #13315f;
  margin: 0 0 6px 0;
}

.order-info {
  font-size: 0.85rem;
  color: #666;
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
  cursor: pointer;
  padding: 0;
}

.modal-close:hover {
  background: rgba(20, 40, 85, 0.12);
  color: #0f2144;
}

/* Body del modal */
.modal-body {
  padding: 30px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Status Section */
.status-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2d4a7f;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.status-badge {
  background: linear-gradient(135deg, rgba(233, 244, 255, 0.95), rgba(219, 233, 255, 0.98));
  border: 1.5px solid rgba(94, 129, 255, 0.24);
  border-radius: 18px;
  padding: 14px 18px;
  font-size: 1rem;
  font-weight: 600;
  color: #0b3550;
  text-align: center;
}

/* Actions Section */
.actions-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.actions-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2d4a7f;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.state-options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.state-option {
  border: 2px solid rgba(94, 129, 255, 0.18);
  border-radius: 18px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.state-option:hover {
  border-color: rgba(94, 129, 255, 0.34);
  background: rgba(233, 244, 255, 0.6);
}

.state-option.selected {
  background: linear-gradient(135deg, rgba(81, 176, 255, 0.12), rgba(94, 129, 255, 0.12));
  border-color: #5d92ff;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #0b3550;
}

.option-icon {
  font-size: 1.5rem;
}

.option-label {
  font-size: 1rem;
}

.option-description {
  font-size: 0.85rem;
  color: #666;
  margin-left: 34px;
}

/* Info Section */
.info-section {
  background: rgba(236, 244, 255, 0.6);
  border: 1px solid rgba(94, 129, 255, 0.14);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #0b3550;
  font-weight: 700;
}

/* Danger Zone */
.danger-zone {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(211, 47, 47, 0.12);
}

.danger-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #d32f2f;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.btn-danger {
  background: rgba(211, 47, 47, 0.1);
  border: 1px solid rgba(211, 47, 47, 0.3);
  color: #d32f2f;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-danger:hover {
  background: rgba(211, 47, 47, 0.15);
  border-color: rgba(211, 47, 47, 0.5);
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Footer del modal */
.modal-footer {
  display: flex;
  gap: 14px;
  padding: 24px 32px;
  border-top: 1px solid rgba(94, 129, 255, 0.14);
  background: rgba(250, 252, 255, 0.5);
}

.btn-primary {
  background: linear-gradient(135deg, #5d92ff 0%, #3f6cef 100%);
  color: #ffffff;
  border: none;
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
  flex: 1;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(63, 108, 255, 0.18);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #3f6cef 0%, #2e57da 100%);
  box-shadow: 0 16px 36px rgba(63, 108, 255, 0.25);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.92);
  color: #0f2144;
  border: 1px solid rgba(94, 129, 255, 0.28);
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
  flex: 1;
  border-radius: 14px;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(94, 129, 255, 0.08);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  .modal-container {
    max-width: 95vw;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }
}
.shipping-summary {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7ff;
  border-radius: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #263449;
}

.summary-row span:first-child {
  color: #556987;
}

.option-description {
  margin-top: 10px;
  color: #5f6d7f;
}

.state-option.selected {
  border-color: #4a8cff;
  background: rgba(74, 140, 255, 0.18);
  box-shadow: 0 6px 20px rgba(74, 140, 255, 0.12);
}

.btn-label {
  font-size: 0.86rem;
  font-weight: 700;
}

</style>
