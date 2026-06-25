<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Marca, MarcaDTO } from '@/models/marca'
import http from '@/plugins/axios'

const props = defineProps<{
  show: boolean
  marca?: Marca
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const nombre = ref('')
const descripcion = ref('')
const isEdit = ref(false)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
        if (props.marca) {
      isEdit.value = true
      nombre.value = props.marca.nombre
      descripcion.value = props.marca.descripcion || ''
      } else {
        isEdit.value = false
        resetForm()
      }
    }
  }
)

const resetForm = () => {
  nombre.value = ''
  descripcion.value = ''
}

const guardarMarca = async () => {
  if (!nombre.value.trim()) {
    alert('El nombre de la marca es obligatorio')
    return
  }

  const marcaData: MarcaDTO = {
    nombre: nombre.value.trim(),
    descripcion: descripcion.value.trim(),
  }

  try {
    if (isEdit.value && props.marca) {
      await http.patch(`marcas/${props.marca.id}`, marcaData)
    } else {
      await http.post('marcas', marcaData)
    }

    emit('saved')
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar marca:', error)

    const mensaje =
      error.response?.data?.message ||
      'No se pudo guardar la marca'

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
            <h2 class="modal-title">{{ isEdit ? 'Editar Marca' : 'Nueva Marca' }}</h2>
            <button @click="cerrarModal" class="modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- metodo nueva marca -->
          <form @submit.prevent="guardarMarca" class="modal-body">
            <div class="form-grid">

              <div class="form-group">
                <label for="nombre" class="form-label">
                  Nombre de la Marca *
                </label>

                <input
                  v-model="nombre"
                  type="text"
                  class="form-input"
                  id="nombre"
                  placeholder="Ej: Nike, Adidas, Puma"
                  maxlength="100"
                  required
                  autofocus
                />
              </div>

              <div class="form-group form-group-full">
                <label for="descripcion" class="form-label">
                  Descripción
                </label>

                <textarea
                  v-model="descripcion"
                  class="form-textarea"
                  id="descripcion"
                  rows="4"
                  placeholder="Descripción de la marca..."
                  maxlength="255"
                ></textarea>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 56, 106, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
}

.modal-container {
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 28px;
  box-shadow: 0 26px 66px rgba(15, 57, 112, 0.16);
  border: 1px solid rgba(94, 146, 255, 0.18);
}

..modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 28px 16px;
  gap: 16px;
}

.modal-title {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #16305a;
  margin: 0;
}

.modal-close {
  background: rgba(49, 101, 216, 0.12);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  color: #1f3d72;
  padding: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}

.modal-close:hover {
  background: rgba(49, 101, 216, 0.22);
  color: #0f264d;
}

.modal-body {
  padding: 24px 28px 32px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  color: #5c728f;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  min-height: 56px;
  border: 1px solid rgba(111, 143, 212, 0.38);
  border-radius: 16px;
  font-size: 0.95rem;
  color: #22314c;
  background: rgba(246, 252, 255, 0.96);
  padding: 16px 18px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input::placeholder {
  color: #aab8d1;
  font-weight: 300;
}

.form-input:focus {
  outline: none;
  border-color: rgba(49, 101, 216, 0.72);
  box-shadow: 0 0 0 4px rgba(94, 146, 255, 0.14);
  background: #ffffff;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
}

.form-color {
  width: 56px;
  height: 56px;
  border: 1px solid rgba(111, 143, 212, 0.38);
  border-radius: 16px;
  cursor: pointer;
  padding: 6px;
  background: #ffffff;
}

.color-code {
  flex: 1;
}

.color-preview {
  width: 56px;
  height: 56px;
  border: 1px solid rgba(111, 143, 212, 0.38);
  border-radius: 16px;
  background: #000000;
}

.modal-footer {
  display: flex;
  gap: 14px;
  padding-top: 28px;
  border-top: 1px solid rgba(161, 183, 219, 0.4);
  margin-top: 28px;
}

.btn-primary {
  background: linear-gradient(135deg, #3767d6 0%, #6a9dff 100%);
  color: #ffffff;
  border: none;
  padding: 14px 30px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex: 1;
  border-radius: 14px;
  box-shadow: 0 16px 32px rgba(55, 103, 214, 0.18);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 36px rgba(55, 103, 214, 0.24);
}

.btn-secondary {
  background: #ffffff;
  color: #27416b;
  border: 1px solid rgba(111, 143, 212, 0.45);
  padding: 14px 30px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  flex: 1;
  border-radius: 14px;
}

.btn-secondary:hover {
  background: rgba(94, 146, 255, 0.12);
  color: #162b48;
  border-color: rgba(94, 146, 255, 0.55);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
