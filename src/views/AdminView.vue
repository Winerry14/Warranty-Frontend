<template>
  <div
    style="
      max-width: 900px;
      margin: 2rem auto;
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      color: #111827;
    "
  >
    <h2 style="margin-top: 0; text-align: center;">Panel administrador</h2>
    <p style="text-align: center; margin-bottom: 1rem;">
      Resumen general del sistema Warranty.
    </p>

    <p v-if="cargando">Cargando datos...</p>
    <p v-if="error" style="color: #b91c1c;">{{ error }}</p>

    <div
      v-if="!cargando && !error"
      style="
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
      "
    >
      <div
        style="
          padding: 1rem;
          border-radius: 12px;
          background: #eff6ff;
          text-align: center;
        "
      >
        <h3 style="margin: 0 0 0.3rem;">Usuarios</h3>
        <p style="font-size: 1.8rem; margin: 0;">{{ totalUsuarios }}</p>
      </div>

      <div
        style="
          padding: 1rem;
          border-radius: 12px;
          background: #ecfdf3;
          text-align: center;
        "
      >
        <h3 style="margin: 0 0 0.3rem;">Boletas</h3>
        <p style="font-size: 1.8rem; margin: 0;">{{ totalBoletas }}</p>
      </div>

      <div
        style="
          padding: 1rem;
          border-radius: 12px;
          background: #fef3c7;
          text-align: center;
        "
      >
        <h3 style="margin: 0 0 0.3rem;">Notificaciones</h3>
        <p style="font-size: 1.8rem; margin: 0;">{{ totalNotificaciones }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const totalUsuarios = ref(0)
const totalBoletas = ref(0)
const totalNotificaciones = ref(0)

const cargando = ref(false)
const error = ref("")

const cargarDatos = async () => {
  try {
    cargando.value = true
    error.value = ""

    const [uRes, bRes, nRes] = await Promise.all([
      axios.get(`${API_BASE}/usuarios`),
      axios.get(`${API_BASE}/boletas`),
      axios.get(`${API_BASE}/notificaciones`)
    ])

    totalUsuarios.value = (uRes.data || []).length
    totalBoletas.value = (bRes.data || []).length
    totalNotificaciones.value = (nRes.data || []).length
  } catch (e) {
    error.value = "No se pudieron cargar los datos del administrador."
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)
</script>
