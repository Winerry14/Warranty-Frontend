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
    <h2 style="margin-top: 0; text-align: center;">Detalle de boleta</h2>

    <p v-if="cargando" style="margin-top: 1rem;">Cargando información...</p>
    <p v-if="error" style="margin-top: 1rem; color: #b91c1c;">{{ error }}</p>

    <div v-if="boleta && !cargando && !error">
      <!-- DATOS DE LA BOLETA -->
      <h3>Datos de la boleta</h3>
      <p><strong>N° Boleta:</strong> {{ boleta.numeroBoleta }}</p>
      <p>
        <strong>Tienda:</strong>
        {{ boleta.tienda ? boleta.tienda.nombreTienda : "-" }}
      </p>
      <p><strong>Fecha compra:</strong> {{ formatearFecha(boleta.fechaCompra) }}</p>
      <p><strong>Total:</strong> {{ formatoMonto(boleta.total) }}</p>
      <p><strong>Vendedor:</strong> {{ boleta.nombreVendedor || "-" }}</p>

      <p v-if="boleta.urlImagen" style="margin-top: 1rem;">
        <strong>Imagen / archivo de boleta:</strong><br />
        <a
          :href="`${API_BASE}/boletas/${boleta.idBoleta}/archivo`"
          target="_blank"
          style="color: #2563eb; text-decoration: none;"
        >
          Ver archivo
        </a>
      </p>

      <!-- SEPARADOR 1 -->
      <hr style="margin: 1.5rem 0;" />

      <!-- PRODUCTOS DE LA COMPRA -->
      <h3>Productos de la compra</h3>

      <table
        v-if="productosResumen.length"
        style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;"
      >
        <thead>
          <tr>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
              "
            >
              Producto
            </th>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
              "
            >
              Precio
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in productosResumen" :key="p.idDetalle">
            <td style="padding: 0.4rem 0.75rem;">
              {{ p.nombreProducto }}
            </td>
            <td style="padding: 0.4rem 0.75rem;">
              {{ formatoMonto(p.precio) }}
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else style="margin-top: 0.5rem;">
        Aún no hay productos registrados para esta boleta.
      </p>

      <!-- BOTÓN GESTIONAR PRODUCTOS -->
      <div style="margin-top: 1rem; text-align: left;">
        <button
          type="button"
          @click="irAGestionProductos"
          style="
            padding: 0.6rem 1.2rem;
            border-radius: 999px;
            border: none;
            background: #6b21a8;
            color: white;
            cursor: pointer;
          "
        >
          Gestionar productos
        </button>
      </div>

      <!-- SEPARADOR 2 -->
      <hr style="margin: 1.5rem 0;" />

      <!-- DATOS DE LA GARANTÍA -->
      <div v-if="garantia">
        <h3>Garantía asociada</h3>
        <p><strong>Inicio:</strong> {{ formatearFecha(garantia.fechaInicio) }}</p>
        <p><strong>Término:</strong> {{ formatearFecha(garantia.fechaTermino) }}</p>
        <p>
          <strong>Estado:</strong>
          <span :style="estiloEstadoGarantia(garantia.estado)">
            {{ garantia.estado }}
          </span>
        </p>
        <p><strong>Días restantes:</strong> {{ diasRestantes }}</p>

        <!-- SEPARADOR 3 -->
        <hr style="margin: 1.5rem 0;" />

        <!-- NOTIFICACIONES -->
        <h3 style="margin-top: 1.5rem;">Notificaciones programadas</h3>

        <table
          v-if="garantia.notificaciones && garantia.notificaciones.length"
          style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;"
        >
          <thead>
            <tr>
              <th
                style="
                  text-align: left;
                  border-bottom: 1px solid #e5e7eb;
                  padding: 0.5rem 0.75rem;
                "
              >
                Fecha aviso
              </th>
              <th
                style="
                  text-align: left;
                  border-bottom: 1px solid #e5e7eb;
                  padding: 0.5rem 0.75rem;
                "
              >
                Tipo
              </th>
              <th
                style="
                  text-align: left;
                  border-bottom: 1px solid #e5e7eb;
                  padding: 0.5rem 0.75rem;
                "
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="n in garantia.notificaciones"
              :key="n.idNotificacion || n.id"
            >
              <td style="padding: 0.4rem 0.75rem;">
                {{ formatearFechaHora(n.fechaEnvio) }}
              </td>
              <td style="padding: 0.4rem 0.75rem;">
                EMAIL
              </td>
              <td style="padding: 0.4rem 0.75rem;">
                <span :style="estiloEstadoNotificacion(n.estado)">
                  {{ n.estado }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <p
          v-if="!garantia.notificaciones || !garantia.notificaciones.length"
          style="margin-top: 0.5rem;"
        >
          No hay notificaciones programadas para esta garantía.
        </p>

        <!-- BOTONES ABAJO -->
        <div
          style="
            margin-top: 1.5rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
          "
        >
          <button
            type="button"
            @click="irAGestionNotificaciones"
            style="
              padding: 0.6rem 1.2rem;
              border-radius: 999px;
              border: none;
              background: #6b21a8;
              color: white;
              cursor: pointer;
            "
          >
            Gestionar notificaciones
          </button>

          <button
            type="button"
            @click="descargarPdf"
            style="
              padding: 0.6rem 1.2rem;
              border-radius: 999px;
              border: none;
              background: #2563eb;
              color: white;
              cursor: pointer;
            "
          >
            Reclamar (PDF)
          </button>
        </div>
      </div>

      <p v-else style="margin-top: 1rem;">
        Esta boleta aún no tiene una garantía asociada.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const boleta = ref(null)
const garantia = ref(null)
const productos = ref([])
const cargando = ref(false)
const error = ref("")

const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const productosResumen = computed(() => {
  if (!productos.value) return []
  return productos.value.slice(0, 3)
})

const cargarDatos = async () => {
  try {
    cargando.value = true
    error.value = ""

    const resBoleta = await axios.get(`${API_BASE}/boletas/${id}`)
    boleta.value = resBoleta.data

    // Productos asociados a la boleta
    try {
      const resDetalles = await axios.get(
        `${API_BASE}/detalles-boleta/boleta/${id}`
      )

      productos.value = (resDetalles.data || []).map(d => ({
        idDetalle: d.idDetalle,
        nombreProducto: d.producto?.nombreProducto || "Producto sin nombre",
        precio: d.precioUnitario ?? 0
      }))
    } catch (e) {
      productos.value = []
    }

    // Garantía asociada
    try {
      const resGarantia = await axios.get(
        `${API_BASE}/garantias/boleta/${id}`
      )
      garantia.value = resGarantia.data
    } catch (e) {
      garantia.value = null
    }
  } catch (e) {
    error.value = "No se pudo cargar la boleta desde el servidor."
  } finally {
    cargando.value = false
  }
}

const diasRestantes = computed(() => {
  if (!garantia.value || !garantia.value.fechaTermino) return "-"
  const hoy = new Date()
  const fin = new Date(garantia.value.fechaTermino)
  const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24))
  return diff < 0 ? 0 : diff
})

const formatoMonto = m => {
  if (m == null) return "-"
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP"
  }).format(m)
}

// NUEVO: formateo de fecha y fecha+hora
const formatearFecha = f => {
  if (!f) return "-"
  const soloFecha = String(f).split("T")[0] // "2025-11-28"
  const [y, m, d] = soloFecha.split("-")
  if (!y || !m || !d) return soloFecha
  return `${d}-${m}-${y}` // "28-11-2025"
}

const formatearFechaHora = f => {
  if (!f) return "-"
  const [fecha, horaCompleta] = String(f).split("T")
  const [y, m, d] = fecha.split("-")
  const fechaBonita = y && m && d ? `${d}-${m}-${y}` : fecha
  if (!horaCompleta) return fechaBonita
  const hora = horaCompleta.slice(0, 5) // "hh:mm"
  return `${fechaBonita} ${hora}`
}

const estiloEstadoGarantia = estado => {
  const base =
    "display:inline-block;padding:0.25rem 0.7rem;border-radius:999px;font-size:0.85rem;"
  if (estado === "VIGENTE") {
    return base + "background:#dcfce7;color:#166534;"
  }
  return base + "background:#fee2e2;color:#b91c1c;"
}

const estiloEstadoNotificacion = estado => {
  const base =
    "display:inline-block;padding:0.2rem 0.6rem;border-radius:999px;font-size:0.8rem;"
  if (estado === "PENDIENTE") {
    return base + "background:#fef3c7;color:#92400e;"
  }
  if (estado === "ENVIADA") {
    return base + "background:#dcfce7;color:#166534;"
  }
  return base + "background:#e5e7eb;color:#374151;"
}

const descargarPdf = () => {
  if (!garantia.value || !garantia.value.idGarantia) return
  const url = `${API_BASE}/garantias/${garantia.value.idGarantia}/pdf`
  window.open(url, "_blank")
}

const irAGestionNotificaciones = () => {
  router.push({ name: "Notificaciones", params: { id } })
}

const irAGestionProductos = () => {
  router.push({ name: "ProductosBoleta", params: { id } })
}

onMounted(cargarDatos)
</script>
