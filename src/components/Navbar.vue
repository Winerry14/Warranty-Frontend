<template>
  <nav class="navbar">
    <!-- USUARIO NORMAL -->
    <template v-if="estaLogueado && !esAdmin">
      <button @click="irABoletas">Boletas</button>
      <button @click="cerrarSesion">Cerrar sesión</button>
    </template>

    <!-- ADMIN -->
    <template v-else-if="estaLogueado && esAdmin">
      <button @click="irAAdmin">Panel admin</button>
      <button @click="cerrarSesion">Cerrar sesión</button>
    </template>

    <!-- SIN SESIÓN -->
    <template v-else>
      <button @click="irALogin">Iniciar sesión</button>
    </template>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const estaLogueado = ref(false)
const esAdmin = ref(false)

function cargarUsuario() {
  const stored = localStorage.getItem("usuarioActual")
  const usuario = stored ? JSON.parse(stored) : null
  estaLogueado.value = !!usuario
  esAdmin.value = usuario?.rol === "ADMIN"
}

onMounted(() => {
  cargarUsuario()
})

router.afterEach(() => {
  cargarUsuario()
})

function irALogin() {
  router.push({ name: "Login" })
}

function irABoletas() {
  router.push({ name: "Boletas" })
}

function irAAdmin() {
  router.push({ name: "Admin" })
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActual")
  cargarUsuario()
  router.push({ name: "Login" })
}
</script>

<style scoped>
.navbar {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: #111827;
  color: #f9fafb;
}

button {
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
}
</style>
