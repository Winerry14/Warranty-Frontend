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
    <h2 style="margin-top: 0; text-align: center;">Mis boletas</h2>
    <p style="margin-bottom: 1rem; text-align: center;">
      Listado de boletas registradas en Warranty.
    </p>

    <!-- Botón para ir a la pantalla de nueva boleta -->
    <div style="text-align: right; margin-bottom: 0.5rem;">
      <router-link
        :to="{ name: 'BoletaNueva' }"
        style="
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          font-size: 0.9rem;
        "
      >
        + Agregar boleta
      </router-link>
    </div>

    <p v-if="cargando" style="margin-top: 1rem;">Cargando boletas...</p>
    <p v-if="error" style="margin-top: 1rem; color: #b91c1c;">{{ error }}</p>

    <table
      v-if="boletas.length && !cargando && !error"
      style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;"
    >
      <thead>
        <tr>
          <th
            style="
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              padding: 0.5rem 0;
            "
          >
            N° Boleta
          </th>
          <th
            style="
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              padding: 0.5rem 0;
            "
          >
            Tienda
          </th>
          <th
            style="
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              padding: 0.5rem 0;
            "
          >
            Fecha compra
          </th>
          <th
            style="
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              padding: 0.5rem 0;
            "
          >
            Total
          </th>
          <th
            style="
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              padding: 0.5rem 0;
            "
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in boletas" :key="b.idBoleta || b.id">
          <td style="padding: 0.4rem 0;">{{ b.numeroBoleta }}</td>
          <td style="padding: 0.4rem 0;">
            {{ b.tienda ? b.tienda.nombreTienda : "-" }}
          </td>
          <td style="padding: 0.4rem 0;">{{ b.fechaCompra }}</td>
          <td style="padding: 0.4rem 0;">{{ formatoMonto(b.total) }}</td>
          <td style="padding: 0.4rem 0;">
            <router-link
              :to="{ name: 'BoletaDetalle', params: { id: b.idBoleta } }"
              style="color: #2563eb; text-decoration: none;"
            >
              Ver detalle
            </router-link>

            <!-- Botón Eliminar en rojo -->
            <span
              @click="eliminarBoleta(b.idBoleta)"
              style="
                margin-left: 0.75rem;
                color: #dc2626;
                cursor: pointer;
              "
            >
              Eliminar
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!boletas.length && !cargando && !error" style="margin-top: 1rem;">
      No hay boletas registradas.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const boletas = ref([])
const cargando = ref(false)
const error = ref("")

const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const cargarBoletas = async () => {
  try {
    cargando.value = true
    error.value = ""

    // Tomar usuario actual desde localStorage
    const usuarioJson = localStorage.getItem("usuarioActual")
    if (!usuarioJson) {
      error.value = "No hay usuario en sesión. Vuelve a iniciar sesión."
      boletas.value = []
      return
    }

    const usuarioActual = JSON.parse(usuarioJson)

    // Ahora pedimos SOLO las boletas de ese usuario
    const res = await axios.get(
      `${API_BASE}/boletas/usuario/${usuarioActual.idUsuario}`
    )

    boletas.value = res.data || []
  } catch (e) {
    error.value = "No se pudieron cargar las boletas desde el servidor."
  } finally {
    cargando.value = false
  }
}

const eliminarBoleta = async id => {
  const confirmado = window.confirm(
    "¿Seguro que deseas eliminar esta boleta? Esta acción no se puede deshacer."
  )
  if (!confirmado) return

  try {
    error.value = ""
    await axios.delete(`${API_BASE}/boletas/${id}`)
    // Sacamos la boleta eliminada de la lista sin recargar toda la página
    boletas.value = boletas.value.filter(b => b.idBoleta !== id)
  } catch (e) {
    error.value = "No se pudo eliminar la boleta."
  }
}

const formatoMonto = m => {
  if (m == null) return "-"
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP"
  }).format(m)
}

onMounted(cargarBoletas)
</script>
