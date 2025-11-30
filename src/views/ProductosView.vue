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

    <h2 style="margin-top: 0; text-align: center;">
      Productos de la boleta
    </h2>

    <p v-if="cargando" style="margin-top: 1rem;">Cargando información...</p>
    <p v-if="error" style="margin-top: 1rem; color: #b91c1c;">{{ error }}</p>

    <div v-if="!cargando">
      <h3 style="margin-top: 1.5rem;">Productos existentes</h3>

      <table
        v-if="productos.length"
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
              Categoría
            </th>
            <th
              style="
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
              "
            >
              Nombre del producto
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
          <tr v-for="p in productos" :key="p.idDetalle">
            <td style="padding: 0.4rem 0.75rem;">
              <select
                v-model="p.categoria"
                style="width: 100%; padding: 0.3rem 0.4rem;"
              >
                <option v-for="c in categorias" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </td>
            <td style="padding: 0.4rem 0.75rem;">
              <input
                v-model="p.nombre"
                type="text"
                style="
                  width: 100%;
                  padding: 0.3rem;
                  border-radius: 8px;
                  border: 1px solid #d1d5db;
                "
              />
            </td>
            <td style="padding: 0.4rem 0.75rem;">
              <input
                v-model.number="p.precio"
                type="number"
                min="0"
                style="
                  width: 100%;
                  padding: 0.3rem;
                  border-radius: 8px;
                  border: 1px solid #d1d5db;
                "
              />
            </td>
            <td style="padding: 0.4rem 0.75rem;">
              <button
                type="button"
                @click="guardarProducto(p)"
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
                @click="eliminarProducto(p.idDetalle)"
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

      <p v-else style="margin-top: 0.5rem;">
        No hay productos registrados para esta boleta.
      </p>

      <h3 style="margin-top: 1.5rem;">Agregar nuevo producto</h3>

      <div
        style="
          display: grid;
          grid-template-columns: 1.4fr 1.6fr 1fr auto;
          gap: 0.75rem;
          align-items: center;
          margin-top: 0.5rem;
        "
      >
        <div>
          <label style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Categoría</label
          >
          <select
            v-model="nuevoCategoria"
            style="width: 100%; padding: 0.3rem 0.4rem;"
          >
            <option v-for="c in categorias" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </div>

        <div>
          <label style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Nombre del producto</label
          >
          <input
            type="text"
            v-model="nuevoNombre"
            style="
              width: 100%;
              padding: 0.3rem;
              border-radius: 8px;
              border: 1px solid #d1d5db;
            "
          />
        </div>

        <div>
          <label style="display:block; font-size:0.85rem; margin-bottom:0.2rem;"
            >Precio</label
          >
          <input
            type="number"
            min="0"
            v-model.number="nuevoPrecio"
            style="
              width: 100%;
              padding: 0.3rem;
              border-radius: 8px;
              border: 1px solid #d1d5db;
            "
          />
        </div>

        <div style="margin-top: 1.3rem;">
          <button
            type="button"
            @click="agregarProducto"
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

const categorias = [
  "TECNOLOGÍA",
  "ELECTRONICA",
  "LÍNEA BLANCA",
  "VESTIMENTA Y CALZADO",
  "OTRO"
]

const productos = ref([])
const cargando = ref(false)
const error = ref("")

const nuevoCategoria = ref("TECNOLOGÍA")
const nuevoNombre = ref("")
const nuevoPrecio = ref(null)

const cargarProductos = async () => {
  try {
    cargando.value = true
    error.value = ""

    const res = await axios.get(
      `${API_BASE}/detalles-boleta/boleta/${idBoleta}`
    )

    productos.value = (res.data || []).map(det => ({
      idDetalle: det.idDetalle,
      idProducto: det.producto?.idProducto,
      productoOriginal: det.producto,
      categoria: det.producto?.categoria || "OTRO",
      nombre: det.producto?.nombreProducto || "",
      precio: det.precioUnitario ?? 0,
      cantidad: det.cantidad ?? 1
    }))
  } catch (e) {
    error.value = "No se pudieron cargar los productos."
    productos.value = []
  } finally {
    cargando.value = false
  }
}

const guardarProducto = async p => {
  try {
    error.value = ""

    // 1) Actualizar producto (nombre / categoría)
    if (p.idProducto) {
      const prod = p.productoOriginal || {}
      const productoPayload = {
        idProducto: p.idProducto,
        nombreProducto: p.nombre,
        marca: prod.marca || null,
        modelo: prod.modelo || null,
        categoria: p.categoria,
        sku: prod.sku || null,
        garantiaMeses:
          prod.garantiaMeses != null ? prod.garantiaMeses : 6
      }

      await axios.put(
        `${API_BASE}/productos/${p.idProducto}`,
        productoPayload
      )
    }

    // 2) Actualizar detalle (precio)
    const detallePayload = {
      idDetalle: p.idDetalle,
      boleta: { idBoleta: Number(idBoleta) },
      producto: { idProducto: p.idProducto },
      cantidad: p.cantidad || 1,
      precioUnitario: p.precio
    }

    await axios.put(
      `${API_BASE}/detalles-boleta/${p.idDetalle}`,
      detallePayload
    )

    await cargarProductos()
  } catch (e) {
    error.value = "No se pudo guardar el producto."
  }
}

const eliminarProducto = async idDetalle => {
  if (!confirm("¿Eliminar este producto de la boleta?")) return
  try {
    error.value = ""
    await axios.delete(`${API_BASE}/detalles-boleta/${idDetalle}`)
    await cargarProductos()
  } catch (e) {
    error.value = "No se pudo eliminar el producto."
  }
}

const agregarProducto = async () => {
  if (!nuevoNombre.value || nuevoPrecio.value == null) {
    error.value = "Debes ingresar nombre y precio del producto."
    return
  }

  try {
    error.value = ""

    // 1) Crear producto
    const productoPayload = {
      nombreProducto: nuevoNombre.value,
      marca: null,
      modelo: null,
      categoria: nuevoCategoria.value,
      sku: null,
      garantiaMeses: 6
    }

    const resProd = await axios.post(
      `${API_BASE}/productos`,
      productoPayload
    )
    const productoCreado = resProd.data

    // 2) Crear detalle_boleta
    const detallePayload = {
      boleta: { idBoleta: Number(idBoleta) },
      producto: { idProducto: productoCreado.idProducto },
      cantidad: 1,
      precioUnitario: nuevoPrecio.value
    }

    await axios.post(`${API_BASE}/detalles-boleta`, detallePayload)

    nuevoNombre.value = ""
    nuevoPrecio.value = null
    nuevoCategoria.value = "TECNOLOGÍA"

    await cargarProductos()
  } catch (e) {
    error.value = "No se pudo agregar el producto."
  }
}

const volverDetalle = () => {
  router.push({ name: "BoletaDetalle", params: { id: idBoleta } })
}

onMounted(cargarProductos)
</script>
