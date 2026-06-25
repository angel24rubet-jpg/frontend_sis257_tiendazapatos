<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Cliente, ClienteDTO } from '@/models/cliente'
import http from '@/plugins/axios'

const props = defineProps<{
  show: boolean
  cliente?: Cliente
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const direccion = ref('')
const isEdit = ref(false)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.cliente) {
        isEdit.value = true
        nombre.value = props.cliente.nombre
        apellido.value = props.cliente.apellido || ''
        telefono.value = props.cliente.telefono || ''
        direccion.value = props.cliente.direccion || ''
      } else {
        isEdit.value = false
        resetForm()
      }
    }
  }
)

const resetForm = () => {
  nombre.value = ''
  apellido.value = ''
  telefono.value = ''
  direccion.value = ''
}

const guardarCliente = async () => {
  if (!nombre.value.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  const clienteData: ClienteDTO = {
    nombre: nombre.value,
    apellido: apellido.value || undefined,
    telefono: telefono.value || undefined,
    direccion: direccion.value || undefined,
  }

  try {
    if (isEdit.value && props.cliente) {
      await http.patch(`clientes/${props.cliente.id}`, clienteData)
    } else {
      await http.post('clientes', clienteData)
    }
    emit('saved')
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar cliente:', error)
    const mensaje = error.response?.data?.message || 'No se pudo guardar el cliente'
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje)
  }
}

const cerrarModal = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="guardarCliente" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre" class="form-label">Nombre *</label>
                <input
                  v-model="nombre"
                  type="text"
                  class="form-input"
                  id="nombre"
                  placeholder="Nombre del cliente"
                  maxlength="50"
                  required
                  autofocus
                />
              </div>

              <div class="form-group">
                <label for="apellido" class="form-label">Apellido</label>
                <input
                  v-model="apellido"
                  type="text"
                  class="form-input"
                  id="apellido"
                  placeholder="Apellido del cliente"
                  maxlength="50"
                />
              </div>

              <div class="form-group">
                <label for="telefono" class="form-label">Teléfono</label>
                <input
                  v-model="telefono"
                  type="tel"
                  class="form-input"
                  id="telefono"
                  placeholder="+591 71234567"
                  maxlength="30"
                />
              </div>

              <div class="form-group">
                <label for="direccion" class="form-label">Dirección</label>
                <input
                  v-model="direccion"
                  type="text"
                  class="form-input"
                  id="direccion"
                  placeholder="Dirección completa"
                  maxlength="100"
                />
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
  background: radial-gradient(circle at top, rgba(131, 201, 255, 0.16), transparent 34%),
    rgba(18, 50, 94, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 18px;
}

/* Contenedor del modal */
.modal-container {
  background: rgba(255, 255, 255, 0.98);
  width: 100%;
  max-width: 700px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 30px;
  box-shadow: 0 28px 70px rgba(14, 46, 112, 0.16);
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
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
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

.form-label {
  display: block;
  color: #2d4a7f;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.form-input {
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

.form-input::placeholder {
  color: #a4b5cb;
  font-weight: 300;
}

.form-input:focus {
  outline: none;
  border-color: #5d92ff;
  box-shadow: 0 0 0 4px rgba(93, 146, 255, 0.14);
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
