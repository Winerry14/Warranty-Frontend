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
    <button
      @click="volverDetalle"
      style="
        margin-bottom: 1rem;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        border: 1px solid #d1d5db;
        background: #f9fafb;
        cursor: pointer;
      "
    >
      ⬅ Volver a detalle de boleta
    </button>

    <!-- TÍTULO AJUSTADO -->
    <h2 style="margin-top: 0; text-align: center;">
      Notificaciones programadas
    </h2>

    <p v-if="cargando" style="margin-top: 1rem;">Cargando información...</p>
    <p v-if="error" style="margin-top: 1rem; color: #b91c1c;">{{ error }}</p>

    <div v-if="!cargando">
      <h3 style="margin-top: 1.5rem;">Notificaciones existentes</h3>

      <table
        v-if="notificaciones.length"
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
              Fecha envío (día)
            </th>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
              "
            >
              Hora
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
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
              "
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in notificaciones" :key="n.idNotificacion">
            <td style="padding: 0.4rem 0.75rem;">
              <input
                type="date"
                v-model="n.fecha"
                style="width: 100%; padding: 0.2rem 0.4rem;"
              />
            </td>
            <td style="padding: 0.4rem 0.75rem;">
              <input
                type="time"
                v-model="n.hora"
                style="width: 100%; padding: 0.2rem 0.4rem;"
              />
            </td>
            <td style="padding: 0.4rem 0.75rem;">
              <select
                v-model="n.estado"
                style="width: 100%; padding: 0.25rem 0.4rem;"
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="ENVIADA">ENVIADA</option>
                <option value="CANCELADA">CANCELADA</option>
              </select>
            </td>
            <td style="padding: 0.4rem 0.75rem;">
              <button
                type="button"
                @click="guardarNotificacion(n)"
                style="
                  margin-right: 0.4rem;
                  padding: 0.3rem 0.7rem;
                  border-radius: 999px;
                  border: none;
                  background: #2563eb;
                  color: white;
                  cursor: pointer;
                "
              >
                Guardar
              </button>
              <button
                type="button"
                @click="eliminarNotificacion(n.idNotificacion)"
                style="
                  padding: 0.3rem 0.7rem;
                  border-radius: 999px;
                  border: none;
                  background: #b91c1c;
                  color: white;
                  cursor: pointer;
                "
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p
        v-else
        style="margin-top: 0.5rem;"
      >
        No hay notificaciones para esta boleta.
      </p>

      <h3 style="margin-top: 1.5rem;">Agregar nueva notificación</h3>

      <div
        style="
          display: grid;
          grid-template-columns: 1.3fr 1fr 1.2fr auto;
          gap: 0.75rem;
          align-items: center;
          margin-top: 0.5rem;
        "
      >
        <div>
          <label style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Fecha envío (día)</label
          >
          <input
            type="date"
            v-model="nuevaFecha"
            style="width: 100%; padding: 0.3rem 0.4rem;"
          />
        </div>

        <div>
          <label style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Hora</label
          >
          <input
            type="time"
            v-model="nuevaHora"
            style="width: 100%; padding: 0.3rem 0.4rem;"
          />
        </div>

        <div>
          <label style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Estado</label
          >
          <select
            v-model="nuevoEstado"
            style="width: 100%; padding: 0.3rem 0.4rem;"
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ENVIADA">ENVIADA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
        </div>

        <div style="margin-top: 1.3rem;">
          <button
            type="button"
            @click="agregarNotificacion"
            style="
              padding: 0.45rem 1.2rem;
              border-radius: 999px;
              border: none;
              background: #16a34a;
              color: white;
              cursor: pointer;
            "
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

const route = useRoute()
const router = useRouter()
const idBoleta = route.params.id

const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const notificaciones = ref([])
const cargando = ref(false)
const error = ref("")
const idGarantia = ref(null)

const nuevaFecha = ref("")
const nuevaHora = ref("")
const nuevoEstado = ref("PENDIENTE")

const construirFechaEnvio = (fecha, hora) => {
  if (!fecha) return null
  const h = hora && hora.length >= 5 ? hora.slice(0, 5) : "00:00"
  return `${fecha}T${h}:00`
}

const cargarNotificaciones = async () => {
  try {
    cargando.value = true
    error.value = ""

    const resGarantia = await axios.get(
      `${API_BASE}/garantias/boleta/${idBoleta}`
    )
    const garantia = resGarantia.data
    idGarantia.value = garantia.idGarantia

    if (garantia.notificaciones) {
      notificaciones.value = garantia.notificaciones.map(n => {
        let fecha = ""
        let hora = ""
        if (n.fechaEnvio) {
          const partes = n.fechaEnvio.split("T")
          fecha = partes[0]
          hora = partes[1] ? partes[1].slice(0, 5) : ""
        }
        return {
          ...n,
          fecha,
          hora,
          garantia: { idGarantia: garantia.idGarantia }
        }
      })
    } else {
      notificaciones.value = []
    }
  } catch (e) {
    error.value = "No se pudieron cargar las notificaciones."
  } finally {
    cargando.value = false
  }
}

const guardarNotificacion = async n => {
  try {
    error.value = ""
    const fechaEnvio = construirFechaEnvio(n.fecha, n.hora)

    const payload = {
      idNotificacion: n.idNotificacion,
      fechaEnvio,
      tipoNotificacion: "EMAIL",
      estado: n.estado,
      boleta: n.boleta || null,
      garantia: n.garantia || { idGarantia: idGarantia.value },
      reglaNotificacion: n.reglaNotificacion || null
    }

    await axios.put(`${API_BASE}/notificaciones/${n.idNotificacion}`, payload)
    await cargarNotificaciones()
  } catch (e) {
    error.value = "No se pudo guardar la notificación."
  }
}

const eliminarNotificacion = async id => {
  if (!confirm("¿Eliminar esta notificación?")) return
  try {
    error.value = ""
    await axios.delete(`${API_BASE}/notificaciones/${id}`)
    notificaciones.value = notificaciones.value.filter(
      n => n.idNotificacion !== id
    )
  } catch (e) {
    error.value = "No se pudo eliminar la notificación."
  }
}

const agregarNotificacion = async () => {
  try {
    error.value = ""
    const fechaEnvio = construirFechaEnvio(nuevaFecha.value, nuevaHora.value)
    if (!fechaEnvio) {
      error.value = "Debes seleccionar al menos la fecha."
      return
    }

    const payload = {
      fechaEnvio,
      tipoNotificacion: "EMAIL",
      estado: nuevoEstado.value,
      garantia: { idGarantia: idGarantia.value }
    }

    await axios.post(`${API_BASE}/notificaciones`, payload)

    nuevaFecha.value = ""
    nuevaHora.value = ""
    nuevoEstado.value = "PENDIENTE"

    await cargarNotificaciones()
  } catch (e) {
    error.value = "No se pudo agregar la notificación."
  }
}

const volverDetalle = () => {
  router.push({ name: "BoletaDetalle", params: { id: idBoleta } })
}

onMounted(cargarNotificaciones)
</script>

