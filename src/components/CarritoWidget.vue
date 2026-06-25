<script setup lang="ts">
import { useCarritoStore } from '@/stores'

const carritoStore = useCarritoStore()
</script>

<template>
  <button @click="carritoStore.abrirCarrito()" class="cart-widget" aria-label="Abrir carrito">
    <span class="cart-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 6h15l-1.5 9h-12L4 4H2" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M6 6L7.5 3h11" />
      </svg>
    </span>
    <Transition name="badge">
      <span v-if="carritoStore.cantidadTotal > 0" class="cart-badge">
        {{ carritoStore.cantidadTotal }}
      </span>
    </Transition>
  </button>
</template>

<style scoped>
.cart-widget {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #0b3550;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.cart-widget:hover {
  transform: scale(1.03);
  background: #0d4165;
  box-shadow: 0 4px 12px rgba(11, 53, 80, 0.18);
}

.cart-icon svg {
  width: 20px;
  height: 20px;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff5a5f;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  box-shadow: 0 0 0 3px rgba(255, 90, 95, 0.12);
}

/* Badge Animation */
.badge-enter-active,
.badge-leave-active {
  transition: all 0.18s ease;
}

.badge-enter-from {
  opacity: 0;
  transform: scale(0.35);
}

.badge-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
