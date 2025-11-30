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

    <!-- RESUMEN PRINCIPAL -->
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

    <!-- BLOQUE DE GESTIÓN -->
    <div v-if="!cargando && !error" style="margin-top: 2rem;">
      <h3 style="text-align: center; margin-bottom: 0.5rem;">
        Gestión del sistema
      </h3>
      <p style="text-align: center; margin-bottom: 1rem;">
        Desde aquí el administrador puede mantener los catálogos que utiliza Warranty.
      </p>

      <div
        style="
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        "
      >
        <!-- TARJETA 1: TIENDAS -->
        <div
          style="
            padding: 1rem;
            border-radius: 12px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
          "
        >
          <h4 style="margin-top: 0;">Catálogo de tiendas</h4>
          <p style="font-size: 0.9rem; margin-bottom: 0.8rem;">
            Administra las tiendas donde los usuarios registran sus compras.
            Estas tiendas se utilizan al ingresar una nueva boleta o factura.
          </p>
          <button
            type="button"
            @click="irAGestionTiendas"
            style="
              padding: 0.45rem 1.2rem;
              border-radius: 999px;
              border: none;
              background: #2563eb;
              color: white;
              cursor: pointer;
              font-size: 0.9rem;
            "
          >
            Gestionar tiendas
          </button>
        </div>

        <!-- TARJETA 2: RESUMEN DE NOTIFICACIONES -->
        <div
          style="
            padding: 1rem;
            border-radius: 12px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
          "
        >
          <h4 style="margin-top: 0;">Estado de notificaciones</h4>
          <p style="font-size: 0.9rem; margin-bottom: 0.8rem;">
            Resumen de las notificaciones generadas por las garantías de los usuarios.
          </p>
          <ul style="list-style: none; padding-left: 0; font-size: 0.9rem;">
            <li style="margin-bottom: 0.2rem;">
              <strong>Pendientes:</strong> {{ notificacionesPendientes }}
            </li>
            <li style="margin-bottom: 0.2rem;">
              <strong>Enviadas:</strong> {{ notificacionesEnviadas }}
            </li>
            <li>
              <strong>Canceladas:</strong> {{ notificacionesCanceladas }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const totalUsuarios = ref(0)
const totalBoletas = ref(0)
const totalNotificaciones = ref(0)

// desglose de notificaciones por estado
const notificacionesPendientes = ref(0)
const notificacionesEnviadas = ref(0)
const notificacionesCanceladas = ref(0)

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

    const notificaciones = nRes.data || []
    totalNotificaciones.value = notificaciones.length

    // contar por estado
    notificacionesPendientes.value = notificaciones.filter(
      n => n.estado === "PENDIENTE"
    ).length
    notificacionesEnviadas.value = notificaciones.filter(
      n => n.estado === "ENVIADA"
    ).length
    notificacionesCanceladas.value = notificaciones.filter(
      n => n.estado === "CANCELADA"
    ).length
  } catch (e) {
    error.value = "No se pudieron cargar los datos del administrador."
  } finally {
    cargando.value = false
  }
}

const irAGestionTiendas = () => {
  router.push({ name: "TiendasAdmin" })
}

onMounted(cargarDatos)
</script>
