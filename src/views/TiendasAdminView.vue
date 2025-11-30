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
      @click="volverAdmin"
      style="
        margin-bottom: 1rem;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        border: 1px solid #d1d5db;
        background: #f9fafb;
        cursor: pointer;
      "
    >
      ⬅ Volver al panel administrador
    </button>

    <h2 style="margin-top: 0; text-align: center;">Gestión de tiendas</h2>
    <p style="text-align: center; margin-bottom: 1rem; font-size: 0.95rem;">
      Administra las tiendas que se utilizan al registrar nuevas boletas o facturas.
    </p>

    <p v-if="cargando" style="margin-top: 0.5rem;">Cargando tiendas...</p>
    <p v-if="error" style="margin-top: 0.5rem; color: #b91c1c;">{{ error }}</p>

    <!-- LISTADO DE TIENDAS -->
    <div v-if="!cargando">
      <h3 style="margin-top: 1rem;">Tiendas registradas</h3>

      <table
        v-if="tiendas.length"
        style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;"
      >
        <thead>
          <tr>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.4rem 0.5rem;
              "
            >
              Nombre tienda
            </th>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.4rem 0.5rem;
              "
            >
              RUT
            </th>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.4rem 0.5rem;
              "
            >
              Dirección
            </th>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.4rem 0.5rem;
              "
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tiendas" :key="t.idTienda">
            <td style="padding: 0.3rem 0.5rem;">
              <input
                v-model="t.nombreTienda"
                type="text"
                style="
                  width: 100%;
                  padding: 0.3rem;
                  border-radius: 8px;
                  border: 1px solid #d1d5db;
                  font-size: 0.9rem;
                "
              />
            </td>
            <td style="padding: 0.3rem 0.5rem;">
              <input
                v-model="t.rutTienda"
                type="text"
                style="
                  width: 100%;
                  padding: 0.3rem;
                  border-radius: 8px;
                  border: 1px solid #d1d5db;
                  font-size: 0.9rem;
                "
              />
            </td>
            <td style="padding: 0.3rem 0.5rem;">
              <input
                v-model="t.direccion"
                type="text"
                style="
                  width: 100%;
                  padding: 0.3rem;
                  border-radius: 8px;
                  border: 1px solid #d1d5db;
                  font-size: 0.9rem;
                "
              />
            </td>
            <td style="padding: 0.3rem 0.5rem;">
              <button
                type="button"
                @click="guardarTienda(t)"
                style="
                  margin-right: 0.3rem;
                  padding: 0.3rem 0.7rem;
                  border-radius: 999px;
                  border: none;
                  background: #2563eb;
                  color: #ffffff;
                  cursor: pointer;
                  font-size: 0.85rem;
                "
              >
                Guardar
              </button>
              <button
                type="button"
                @click="eliminarTienda(t.idTienda)"
                style="
                  padding: 0.3rem 0.7rem;
                  border-radius: 999px;
                  border: none;
                  background: #b91c1c;
                  color: #ffffff;
                  cursor: pointer;
                  font-size: 0.85rem;
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
        Aún no hay tiendas registradas.
      </p>

      <!-- AGREGAR NUEVA TIENDA -->
      <h3 style="margin-top: 1.5rem;">Agregar nueva tienda</h3>

      <div
        style="
          display: grid;
          grid-template-columns: 1.3fr 0.8fr 1.4fr auto;
          gap: 0.75rem;
          align-items: center;
          margin-top: 0.5rem;
        "
      >
        <div>
          <label
            style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Nombre tienda</label
          >
          <input
            v-model="nuevaTienda.nombreTienda"
            type="text"
            style="
              width: 100%;
              padding: 0.35rem;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              font-size: 0.9rem;
            "
          />
        </div>
        <div>
          <label
            style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >RUT tienda</label
          >
          <input
            v-model="nuevaTienda.rutTienda"
            type="text"
            style="
              width: 100%;
              padding: 0.35rem;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              font-size: 0.9rem;
            "
          />
        </div>
        <div>
          <label
            style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Dirección</label
          >
          <input
            v-model="nuevaTienda.direccion"
            type="text"
            style="
              width: 100%;
              padding: 0.35rem;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              font-size: 0.9rem;
            "
          />
        </div>
        <div style="margin-top: 1.3rem;">
          <button
            type="button"
            @click="agregarTienda"
            style="
              padding: 0.45rem 1rem;
              border-radius: 999px;
              border: none;
              background: #16a34a;
              color: #ffffff;
              cursor: pointer;
              font-size: 0.9rem;
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
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()
const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const tiendas = ref([])
const cargando = ref(false)
const error = ref("")

const nuevaTienda = ref({
  nombreTienda: "",
  rutTienda: "",
  direccion: ""
})

const cargarTiendas = async () => {
  try {
    cargando.value = true
    error.value = ""
    const res = await axios.get(`${API_BASE}/tiendas`)
    tiendas.value = res.data || []
  } catch (e) {
    error.value = "No se pudieron cargar las tiendas."
  } finally {
    cargando.value = false
  }
}

const agregarTienda = async () => {
  if (!nuevaTienda.value.nombreTienda) {
    error.value = "El nombre de la tienda es obligatorio."
    return
  }

  try {
    error.value = ""
    const payload = {
      nombreTienda: nuevaTienda.value.nombreTienda,
      rutTienda: nuevaTienda.value.rutTienda || null,
      direccion: nuevaTienda.value.direccion || null
    }

    await axios.post(`${API_BASE}/tiendas`, payload)
    nuevaTienda.value = {
      nombreTienda: "",
      rutTienda: "",
      direccion: ""
    }
    await cargarTiendas()
  } catch (e) {
    error.value = "No se pudo agregar la tienda."
  }
}

const guardarTienda = async tienda => {
  if (!tienda.nombreTienda) {
    error.value = "El nombre de la tienda es obligatorio."
    return
  }

  try {
    error.value = ""
    const payload = {
      idTienda: tienda.idTienda,
      nombreTienda: tienda.nombreTienda,
      rutTienda: tienda.rutTienda || null,
      direccion: tienda.direccion || null
    }

    await axios.put(`${API_BASE}/tiendas/${tienda.idTienda}`, payload)
    await cargarTiendas()
  } catch (e) {
    error.value = "No se pudo guardar la tienda."
  }
}

const eliminarTienda = async id => {
  if (!confirm("¿Eliminar esta tienda?")) return

  try {
    error.value = ""
    await axios.delete(`${API_BASE}/tiendas/${id}`)
    tiendas.value = tiendas.value.filter(t => t.idTienda !== id)
  } catch (e) {
    error.value = "No se pudo eliminar la tienda. Es posible que esté asociada a boletas."
  }
}

const volverAdmin = () => {
  router.push({ name: "Admin" })
}

onMounted(cargarTiendas)
</script>
