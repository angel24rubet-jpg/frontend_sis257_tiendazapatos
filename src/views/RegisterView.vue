<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores'
import { useRouter, RouterLink } from 'vue-router'
import http from '@/plugins/axios'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const form = reactive({
  nombreUsuario: '',
  clave: '',
  nombre: '',
  apellido: '',
  cedula: '',
  genero: '',
  fechaNacimiento: '',
  telefono: '',
  direccion: '',
})

const error = ref('')

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    const ok = await authStore.register(form)
    if (ok) {
      try {
        const clientePayload = {
          nombre: form.nombre ?? '',
          apellido: form.apellido ?? undefined,
          cedula: form.cedula ?? undefined,
          genero: form.genero ?? undefined,
          fechaNacimiento: form.fechaNacimiento ?? undefined,
          telefono: form.telefono ?? undefined,
          direccion: form.direccion ?? undefined,
        }
        await http.post('clientes/me', clientePayload)
      } catch (e) {
        ;(window.console as any).error('Crear cliente falló:', e)
      }

      ;(window as any).__app_toasts?.push?.('¡Cuenta creada correctamente! Bienvenido/a', 'success', 3500)
      router.push('/cuenta')
    } else {
      error.value = 'No se pudo crear la cuenta.'
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.message || 'Error al crear la cuenta'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <!-- Fondo con patrón -->
    <div class="auth-background">
      <div class="pattern"></div>
    </div>

    <div class="auth-container">
      <!-- Panel izquierdo - Branding -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">RAMOS</div>
          <div class="brand-tagline">Tienda de Zapatos</div>
          <div class="brand-divider"></div>
          <p class="brand-description">
            Únete a nuestra comunidad y disfruta de una experiencia de compra exclusiva con los mejores zapatos
          </p>

          <div class="brand-benefits">
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              <span>Acceso a ofertas exclusivas</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              <span>Envío rápido y seguro</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              <span>Soporte al cliente 24/7</span>
            </div>
          </div>
        </div>
        <div class="brand-footer">
          <span>Moda Premium</span>
          <span class="dot">•</span>
          <span>Desde 2024</span>
        </div>
      </div>

      <!-- Panel derecho - Formulario -->
      <div class="form-panel">
        <div class="form-content">
          <div class="form-header">
            <h1>Crear Cuenta</h1>
            <p>Regístrate para comenzar a comprar</p>
          </div>

          <form @submit.prevent="submit" class="register-form">
            <!-- Sección Usuario y Contraseña -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Usuario *</label>
                <input
                  v-model="form.nombreUsuario"
                  type="text"
                  class="form-input"
                  placeholder="Elige un nombre de usuario"
                  maxlength="15"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Contraseña *</label>
                <input
                  v-model="form.clave"
                  type="password"
                  class="form-input"
                  placeholder="Crea una contraseña segura"
                  required
                />
              </div>
            </div>

            <!-- Sección Datos Personales -->
            <div class="section-title">Datos Personales</div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input
                  v-model="form.nombre"
                  type="text"
                  class="form-input"
                  placeholder="Tu nombre"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Apellido</label>
                <input
                  v-model="form.apellido"
                  type="text"
                  class="form-input"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">

                <!-- OBSERVACIÓN CI/NIT obligatorio -->

                <label class="form-label">Cédula / CI *</label>
                <input
                  v-model="form.cedula"
                  type="text"
                  class="form-input"
                  placeholder="Número de CI"
                  maxlength="15"
                  required
              />
              </div>
              <div class="form-group">
                <label class="form-label">Género</label>
                <select v-model="form.genero" class="form-input form-select">
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <!-- Sección Contacto -->
            <div class="section-title">Información de Contacto</div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Fecha de Nacimiento</label>
                <input
                  v-model="form.fechaNacimiento"
                  type="date"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input
                  v-model="form.telefono"
                  type="tel"
                  class="form-input"
                  placeholder="Tu número de teléfono"
                />
              </div>
            </div>

            <div class="form-group form-group-full">
              <label class="form-label">Dirección</label>
              <input
                v-model="form.direccion"
                type="text"
                class="form-input"
                placeholder="Tu dirección de envío"
              />
            </div>

            <!-- Mensaje de error -->
            <div v-if="error" class="alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ error }}
            </div>

            <!-- Botón de envío -->
            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
            </button>

            <!-- Link a login -->
            <div class="login-link">
              <span>¿Ya tienes cuenta?</span>
              <RouterLink to="/login">Inicia sesión aquí</RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout principal */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #c6d8ff 0%, #9fb9ff 100%);
  z-index: 0;
}

.pattern {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.auth-container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  gap: 0;
}

/* Panel Izquierdo - Branding */
.brand-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 50px;
  background: linear-gradient(135deg, rgba(99, 110, 250, 0.1) 0%, rgba(99, 110, 250, 0.05) 100%);
}

.brand-content {
  text-align: left;
}

.brand-logo {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #13315f;
  margin-bottom: 8px;
}

.brand-tagline {
  font-size: 0.95rem;
  letter-spacing: 1px;
  color: #95a5a6;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.brand-divider {
  width: 40px;
  height: 2px;
  background: #5d92ff;
  margin-bottom: 24px;
}

.brand-description {
  font-size: 1.1rem;
  color: #2d4a7f;
  line-height: 1.6;
  margin-bottom: 40px;
  font-weight: 300;
}

.brand-benefits {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2d4a7f;
  font-size: 0.95rem;
}

.benefit-item svg {
  color: #5d92ff;
  flex-shrink: 0;
}

.brand-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #95a5a6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dot {
  color: #d1d5db;
}

/* Panel Derecho - Formulario */
.form-panel {
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow-y: auto;
}

.form-content {
  width: 100%;
  max-width: 450px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.8px;
  color: #13315f;
  margin: 0 0 8px 0;
}

.form-header p {
  font-size: 0.95rem;
  color: #95a5a6;
  margin: 0;
  font-weight: 300;
}

/* Formulario */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group-full {
  grid-column: 1 / -1 !important;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #2d4a7f;
  margin-top: 8px;
  margin-bottom: -16px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  color: #2d4a7f;
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
  background: rgba(255, 255, 255, 0.98);
  padding: 0 18px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input::placeholder,
.form-select::placeholder {
  color: #d1d5db;
  font-weight: 300;
}

.form-input:focus,
.form-select:focus {
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

/* Mensajes de error */
.alert-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff5f5;
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-left: 3px solid #dc2626;
  color: #991b1b;
  font-size: 0.9rem;
  border-radius: 8px;
}

.alert-error svg {
  color: #dc2626;
  flex-shrink: 0;
}

/* Botones */
.btn-primary {
  width: 100%;
  min-height: 56px;
  background: linear-gradient(135deg, #5d92ff 0%, #3f6cef 100%);
  color: #ffffff;
  border: none;
  border-radius: 18px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(93, 146, 255, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Link a login */
.login-link {
  text-align: center;
  font-size: 0.9rem;
  color: #95a5a6;
}

.login-link a {
  color: #5d92ff;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-left: 4px;
}

.login-link a:hover {
  color: #3f6cef;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1024px) {
  .auth-container {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }

  .brand-panel {
    display: none;
  }

  .form-panel {
    min-height: 100vh;
    padding: 30px 20px;
  }

  .form-content {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .form-header h1 {
    font-size: 1.5rem;
  }

  .form-panel {
    padding: 20px 16px;
  }

  .section-title {
    margin-top: 12px;
    margin-bottom: -8px;
  }
}
</style>
