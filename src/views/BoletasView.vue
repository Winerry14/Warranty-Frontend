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
    <p style="text-align: center; margin-bottom: 1rem;">
      Listado de boletas registradas en Warranty.
    </p>

    <div style="text-align: right; margin-bottom: 1rem;">
      <button
        type="button"
        @click="irANuevaBoleta"
        style="
          padding: 0.5rem 1.2rem;
          border-radius: 999px;
          border: none;
          background: #2563eb;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
        "
      >
        + Agregar boleta
      </button>
    </div>

    <p v-if="cargando">Cargando boletas...</p>
    <p v-if="error" style="color: #b91c1c;">{{ error }}</p>

    <div v-if="!cargando && !error">
      <p v-if="!boletas.length" style="margin-top: 1rem;">
        Aún no tienes boletas registradas.
      </p>

      <table
        v-else
        style="
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        "
      >
        <thead>
          <tr>
            <th
              style="
                text-align: left;
                padding: 0.6rem 0.75rem;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              N° Boleta
            </th>
            <th
              style="
                text-align: left;
                padding: 0.6rem 0.75rem;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              Tienda
            </th>
            <th
              style="
                text-align: left;
                padding: 0.6rem 0.75rem;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              Fecha compra
            </th>
            <th
              style="
                text-align: left;
                padding: 0.6rem 0.75rem;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              Total pagado
            </th>
            <th
              style="
                text-align: left;
                padding: 0.6rem 0.75rem;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="b in boletas"
            :key="b.idBoleta"
          >
            <td style="padding: 0.55rem 0.75rem;">
              {{ b.numeroBoleta }}
            </td>
            <td style="padding: 0.55rem 0.75rem;">
              {{ b.tienda ? b.tienda.nombreTienda : "-" }}
            </td>
            <td style="padding: 0.55rem 0.75rem;">
              {{ formatearFecha(b.fechaCompra) }}
            </td>
            <td style="padding: 0.55rem 0.75rem;">
              {{ formatoMonto(b.total) }}
            </td>
            <td style="padding: 0.55rem 0.75rem;">
              <button
                type="button"
                @click="verDetalle(b.idBoleta)"
                style="
                  background: none;
                  border: none;
                  color: #2563eb;
                  cursor: pointer;
                  margin-right: 0.5rem;
                "
              >
                Ver detalle
              </button>
              <button
                type="button"
                @click="eliminarBoleta(b.idBoleta)"
                style="
                  background: none;
                  border: none;
                  color: #b91c1c;
                  cursor: pointer;
                "
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()
const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const boletas = ref([])
const cargando = ref(false)
const error = ref("")

const cargarBoletas = async () => {
  try {
    cargando.value = true
    error.value = ""

    const usuarioJson = localStorage.getItem("usuarioActual")
    if (!usuarioJson) {
      error.value = "No hay usuario en sesión. Vuelve a iniciar sesión."
      return
    }
    const usuarioActual = JSON.parse(usuarioJson)

    const res = await axios.get(`${API_BASE}/boletas/usuario/${usuarioActual.idUsuario}`)
    boletas.value = res.data || []
  } catch (e) {
    error.value = "No se pudieron cargar las boletas."
  } finally {
    cargando.value = false
  }
}

const formatearFecha = fecha => {
  if (!fecha) return "-"
  // espera formato "YYYY-MM-DD"
  const partes = fecha.split("-")
  if (partes.length !== 3) return fecha
  const [yyyy, mm, dd] = partes
  return `${dd}-${mm}-${yyyy}`
}

const formatoMonto = m => {
  if (m == null) return "-"
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP"
  }).format(m)
}

const irANuevaBoleta = () => {
  router.push({ name: "BoletaNueva" })
}

const verDetalle = id => {
  router.push({ name: "BoletaDetalle", params: { id } })
}

const eliminarBoleta = async id => {
  const confirmar = window.confirm("¿Seguro que deseas eliminar esta boleta?")
  if (!confirmar) return

  try {
    await axios.delete(`${API_BASE}/boletas/${id}`)
    boletas.value = boletas.value.filter(b => b.idBoleta !== id)
  } catch (e) {
    alert("No se pudo eliminar la boleta.")
  }
}

onMounted(cargarBoletas)
</script>
