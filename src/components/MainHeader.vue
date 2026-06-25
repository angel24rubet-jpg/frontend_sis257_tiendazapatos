<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores'
import CarritoWidget from './CarritoWidget.vue'
import CarritoFlotante from './CarritoFlotante.vue'

const authStore = useAuthStore()

const isAdmin = computed(() => {
  const regex = /admin|administrador|super/i
  const candidates: Array<string | null | undefined> = [
    authStore.role,
    localStorage.getItem('role'),
  ]
  // also inspect user object if available
  const u: any = authStore.user
  if (u && typeof u === 'object') {
    candidates.push(u.rol || u.role || null)
    if (u.usuario && typeof u.usuario === 'object') candidates.push(u.usuario.rol || u.usuario.role || null)
  }
  for (const c of candidates) {
    if (!c) continue
    try {
      if (regex.test(String(c))) return true
    } catch {}
  }
  return false
})

const isLoggedIn = computed(() => !!authStore.token)
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container-fluid px-5">
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-text">RAMOS</span>
      </RouterLink>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">INICIO</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">TIENDA RAMOS HISTORIA</RouterLink>
          </li>
          <!-- Mis Pedidos solo visible para usuarios logueados -->
          <li v-if="isLoggedIn" class="nav-item">
            <RouterLink to="/mis-pedidos" class="nav-link">Mis Pedidos</RouterLink>
          </li>
        </ul>

        <div class="navbar-actions">
          <!-- Carrito Widget -->
          <CarritoWidget />

          <!-- Botón de Login cuando NO está logueado -->
          <div v-if="!authStore.token" style="display:flex;gap:8px;align-items:center">
            <RouterLink to="/login" class="btn-login">Iniciar Sesión</RouterLink>
            <RouterLink to="/register" class="btn-register">Registrarse</RouterLink>
          </div>

          <!-- Cuando SÍ está logueado -->
          <div v-else style="display:flex;gap:8px;align-items:center">
            <!-- ADMIN: Solo Panel y Cerrar sesión -->
            <template v-if="isAdmin">
              <RouterLink to="/dashboard" class="btn-panel">Panel Admin</RouterLink>
            </template>
            <!-- CLIENTE: Mi Cuenta -->
            <template v-else>
              <RouterLink to="/cuenta" class="btn-panel">Mi Cuenta</RouterLink>
            </template>
            <button class="btn-logout" @click="authStore.logout()">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Carrito Flotante (Sidebar) -->
  <CarritoFlotante />
</template>

<style scoped>
/* Estilo editorial premium */

.navbar {
  /* Usar el mismo gradiente que la página para continuidad visual */
  border-bottom: none;
  padding: 0;
  background: linear-gradient(180deg, #eaf6ff 0%, #c2d8ff 100%) !important;
  box-shadow: 0 1px 0 rgba(11,53,80,0.06);
  transition: all 0.3s ease;
}

.container-fluid {
  padding-top: 20px;
  padding-bottom: 20px;
}

.navbar-brand {
  padding: 0;
  margin: 0;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: #0b3550;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  transition: opacity 0.2s ease;
}

.navbar-brand:hover .brand-text {
  opacity: 0.6;
}

.nav-link {
  color: #0b3550;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 10px 22px !important;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #062430;
}

.nav-link.router-link-active {
  color: #062430;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #062430;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-adm {
  background: #ff6b35;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  cursor: pointer;
}

.btn-adm:hover {
  background: #ff5722;
  color: #ffffff;
}

.btn-register {
  background: transparent;
  color: #0b3550;
  border: 1px solid rgba(11,53,80,0.12);
  padding: 8px 20px;
  text-decoration: none;
  font-weight: 600;
}

.btn-logout {
  background: transparent;
  color: #0b3550;
  border: 1px solid transparent;
  padding: 8px 18px;
  cursor: pointer;
}

.btn-logout:hover {
  color: #ffffff;
  background: #0b3550;
}

.btn-login {
  background: #0b3550;
  color: #ffffff;
  border: 1px solid transparent;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  border-radius: 4px;
}

.btn-login:hover {
  background: #062430;
  color: #ffffff;
}

.btn-panel {
  background: transparent;
  color: #0b3550;
  border: 1px solid rgba(11,53,80,0.12);
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn-panel:hover {
  background: #0b3550;
  color: #ffffff;
  border-color: rgba(11,53,80,0.12);
}

.navbar-toggler {
  padding: 0;
}

.navbar-toggler:focus {
  box-shadow: none;
}

@media (max-width: 991px) {
  .navbar-nav {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e5e5;
  }

  .nav-link {
    padding: 12px 0 !important;
  }

  .nav-link.router-link-active::after {
    left: 0;
  }

  .navbar-actions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e5e5;
  }

  .btn-login {
    width: 100%;
    text-align: center;
  }
}
</style>
