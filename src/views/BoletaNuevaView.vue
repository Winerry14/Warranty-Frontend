<template>
  <div
    style="
      max-width: 1100px;
      margin: 2rem auto;
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      color: #111827;
    "
  >
    <button
      @click="$router.back()"
      style="
        margin-bottom: 1rem;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        border: 1px solid #d1d5db;
        background: #f9fafb;
        cursor: pointer;
      "
    >
      ⬅ Volver
    </button>

    <h2 style="margin-top: 0; text-align: center;">Subir boleta / factura</h2>

    <div
      style="
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: 1.5rem;
        margin-top: 1rem;
      "
    >
      <section>
        <h3>Datos de la boleta</h3>

        <!-- SELECT DE TIENDAS GUARDADAS (OPCIONAL) -->
        <div style="margin-bottom: 0.8rem;">
          <label>Seleccionar tienda guardada (opcional)</label><br />
          <select
            v-model="tiendaSeleccionadaId"
            @change="onSeleccionTienda"
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          >
            <option value="">
              Escribir datos de la tienda manualmente
            </option>
            <option
              v-for="t in tiendasDisponibles"
              :key="t.idTienda"
              :value="t.idTienda"
            >
              {{ t.nombreTienda }} ({{ t.rutTienda }})
            </option>
          </select>
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Nombre tienda</label><br />
          <input
            v-model="tiendaNombre"
            type="text"
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>RUT tienda</label><br />
          <input
            v-model="rutTienda"
            type="text"
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Dirección</label><br />
          <input
            v-model="direccionTienda"
            type="text"
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Número de boleta / factura</label><br />
          <input
            v-model="numeroBoleta"
            type="text"
            required
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Fecha de compra</label><br />
          <input
            v-model="fechaCompra"
            type="date"
            required
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Nombre vendedor</label><br />
          <input
            v-model="nombreVendedor"
            type="text"
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Total (CLP)</label><br />
          <input
            v-model.number="total"
            type="number"
            min="0"
            required
            style="width: 100%; padding: 0.4rem; border-radius: 8px; border: 1px solid #d1d5db;"
          />
        </div>
      </section>

      <section>
        <h3 style="text-align: center;">Subir boleta/factura (imagen o PDF)</h3>

        <div
          style="
            border: 1px dashed #9ca3af;
            border-radius: 12px;
            padding: 1rem;
            text-align: center;
            margin-bottom: 0.8rem;
          "
        >
          <p style="margin-bottom: 0.5rem;">
            Arrastra aquí o haz clic para seleccionar
          </p>
          <label
            style="
              display: inline-block;
              padding: 0.4rem 0.8rem;
              border-radius: 999px;
              border: 1px solid #d1d5db;
              background: #f9fafb;
              cursor: pointer;
            "
          >
            Seleccionar archivo
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              @change="onFileChange"
              style="display: none;"
            />
          </label>
          <p v-if="archivoNombre" style="margin-top: 0.5rem; font-size: 0.9rem;">
            Archivo seleccionado: <strong>{{ archivoNombre }}</strong>
          </p>
          <p v-if="rutaArchivoServidor" style="margin-top: 0.2rem; font-size: 0.8rem;">
            Archivo subido al servidor.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 0.8rem;">
          <button
            type="button"
            @click="usarOcr"
            :disabled="!archivo || ocrCargando"
            style="
              padding: 0.4rem 0.8rem;
              border-radius: 999px;
              border: none;
              background: #2563eb;
              color: white;
              cursor: pointer;
              font-size: 0.9rem;
            "
          >
            {{ ocrCargando ? "Leyendo con OCR..." : "Usar OCR" }}
          </button>
        </div>

        <p v-if="ocrMensaje" style="margin-top: 0.2rem; font-size: 0.85rem;">
          {{ ocrMensaje }}
        </p>

        <div v-if="textoOcr" style="margin-top: 0.8rem;">
          <label style="font-size: 0.9rem;">Texto leído (OCR)</label>
          <textarea
            v-model="textoOcr"
            rows="4"
            style="
              width: 100%;
              margin-top: 0.3rem;
              padding: 0.4rem;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              font-family: monospace;
              font-size: 0.85rem;
            "
          ></textarea>
          <p style="font-size: 0.8rem; margin-top: 0.2rem;">
            Puedes corregir manualmente estos datos. Algunos campos de la
            boleta se rellenan automáticamente a partir de este texto.
          </p>
        </div>

        <div style="margin-top: 1rem;">
          <h4>Productos de la compra</h4>
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              margin-top: 0.3rem;
              font-size: 0.9rem;
            "
          >
            <thead>
              <tr>
                <th
                  style="
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                    padding: 0.4rem 0;
                  "
                >
                  Nombre del producto
                </th>
                <th
                  style="
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                    padding: 0.4rem 0;
                  "
                >
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, idx) in productos" :key="idx">
                <td style="padding: 0.3rem 0;">
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
                <td style="padding: 0.3rem 0;">
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
              </tr>
            </tbody>
          </table>

          <button
            type="button"
            @click="agregarProducto"
            style="
              margin-top: 0.4rem;
              padding: 0.3rem 0.7rem;
              border-radius: 999px;
              border: 1px solid #d1d5db;
              background: #f9fafb;
              cursor: pointer;
              font-size: 0.8rem;
            "
          >
            + Agregar producto
          </button>
        </div>
      </section>
    </div>

    <div style="margin-top: 1.5rem; text-align: right;">
      <button
        type="button"
        @click="guardar"
        :disabled="guardando"
        style="
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          border: none;
          background: #16a34a;
          color: white;
          cursor: pointer;
        "
      >
        {{ guardando ? "Guardando..." : "Guardar boleta" }}
      </button>
    </div>

    <p v-if="error" style="margin-top: 0.8rem; color: #b91c1c;">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const tiendaNombre = ref("")
const rutTienda = ref("")
const direccionTienda = ref("")

const numeroBoleta = ref("")
const fechaCompra = ref("")
const nombreVendedor = ref("")
const total = ref(null)

const archivo = ref(null)
const archivoNombre = ref("")
const rutaArchivoServidor = ref("")

const textoOcr = ref("")
const ocrMensaje = ref("")
const ocrCargando = ref(false)

const productos = ref([
  { nombre: "Producto 1", precio: null },
  { nombre: "Producto 2", precio: null }
])

const guardando = ref(false)
const error = ref("")

const tiendasDisponibles = ref([])
const tiendaSeleccionadaId = ref("")

const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const cargarTiendas = async () => {
  try {
    const res = await axios.get(`${API_BASE}/tiendas`)
    tiendasDisponibles.value = res.data || []
  } catch (e) {
    // Si falla cargar tiendas, no es crítico para guardar boleta
    console.error("No se pudieron cargar las tiendas", e)
  }
}

const onSeleccionTienda = () => {
  const tienda = tiendasDisponibles.value.find(
    t => t.idTienda === Number(tiendaSeleccionadaId.value)
  )

  if (!tienda) {
    tiendaNombre.value = ""
    rutTienda.value = ""
    direccionTienda.value = ""
    return
  }

  tiendaNombre.value = tienda.nombreTienda || ""
  rutTienda.value = tienda.rutTienda || ""
  direccionTienda.value = tienda.direccion || ""
}

const onFileChange = async event => {
  const files = event.target.files
  if (files && files.length > 0) {
    archivo.value = files[0]
    archivoNombre.value = files[0].name
    ocrMensaje.value = ""
    rutaArchivoServidor.value = ""

    const formData = new FormData()
    formData.append("file", archivo.value)

    try {
      const res = await axios.post(`${API_BASE}/boletas/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      rutaArchivoServidor.value = res.data.ruta || ""
    } catch (e) {
      rutaArchivoServidor.value = ""
      error.value = "No se pudo subir el archivo de la boleta."
    }
  } else {
    archivo.value = null
    archivoNombre.value = ""
    rutaArchivoServidor.value = ""
  }
}

const usarOcr = async () => {
  if (!archivo.value) {
    ocrMensaje.value = "Primero debes seleccionar una imagen o PDF."
    return
  }

  try {
    ocrCargando.value = true
    ocrMensaje.value = ""
    textoOcr.value = ""

    const formData = new FormData()
    formData.append("file", archivo.value)

    const res = await axios.post(`${API_BASE}/ocr/extract`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    ocrMensaje.value = res.data.mensaje || "OCR ejecutado."
    textoOcr.value = res.data.texto || ""

    rellenarDesdeOcr(textoOcr.value)
  } catch (e) {
    ocrMensaje.value = "Error al ejecutar OCR."
  } finally {
    ocrCargando.value = false
  }
}

const agregarProducto = () => {
  productos.value.push({ nombre: "", precio: null })
}

const guardar = async () => {
  try {
    guardando.value = true
    error.value = ""

    const usuarioJson = localStorage.getItem("usuarioActual")
    if (!usuarioJson) {
      error.value = "No hay usuario en sesión. Vuelve a iniciar sesión."
      return
    }
    const usuarioActual = JSON.parse(usuarioJson)

    const payloadBoleta = {
      numeroBoleta: numeroBoleta.value,
      fechaCompra: fechaCompra.value,
      total: total.value,
      nombreVendedor: nombreVendedor.value || null,
      urlImagen: rutaArchivoServidor.value || null,
      usuario: { idUsuario: usuarioActual.idUsuario },
      tienda: {
        idTienda: null,
        nombreTienda: tiendaNombre.value || "Tienda sin nombre",
        rutTienda: rutTienda.value || null,
        direccion: direccionTienda.value || null
      }
    }

    const resBoleta = await axios.post(`${API_BASE}/boletas`, payloadBoleta)
    const boletaCreada = resBoleta.data

    if (!boletaCreada || !boletaCreada.idBoleta) {
      error.value = "La boleta se creó sin un ID válido."
      return
    }

    const idBoleta = boletaCreada.idBoleta

    const productosValidos = productos.value.filter(
      p =>
        p.nombre &&
        p.nombre.trim().length > 0 &&
        p.precio != null &&
        p.precio >= 0
    )

    for (const p of productosValidos) {
      try {
        const payloadProducto = {
          nombreProducto: p.nombre,
          marca: null,
          modelo: null,
          categoria: "OTRO",
          sku: null,
          garantiaMeses: 6
        }

        const resProd = await axios.post(
          `${API_BASE}/productos`,
          payloadProducto
        )
        const productoCreado = resProd.data

        if (!productoCreado || !productoCreado.idProducto) {
          continue
        }

        const payloadDetalle = {
          boleta: { idBoleta },
          producto: { idProducto: productoCreado.idProducto },
          cantidad: 1,
          precioUnitario: p.precio
        }

        await axios.post(`${API_BASE}/detalles-boleta`, payloadDetalle)
      } catch (e) {
        console.error("Error creando producto/detalle:", e)
      }
    }

    router.push({ name: "Boletas" })
  } catch (e) {
    error.value = "No se pudo guardar la boleta."
  } finally {
    guardando.value = false
  }
}

const rellenarDesdeOcr = texto => {
  if (!texto) return

  const lineas = texto
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0)

  if (!rutTienda.value || !tiendaNombre.value) {
    const idxRut = lineas.findIndex(l =>
      /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/.test(l)
    )
    if (idxRut >= 0) {
      const matchRut = lineas[idxRut].match(
        /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/
      )
      if (matchRut && !rutTienda.value) {
        rutTienda.value = matchRut[0]
      }
      if (idxRut > 0 && !tiendaNombre.value) {
        tiendaNombre.value = lineas[idxRut - 1]
      }
    }
  }

  if (!numeroBoleta.value) {
    let num = ""
    for (const l of lineas) {
      if (/boleta|factura|n°|no\./i.test(l)) {
        const matchNum = l.match(/(\d{4,10})/)
        if (matchNum) {
          num = matchNum[1]
          break
        }
      }
    }

    if (!num) {
      const matchAlt = texto.match(/\b\d{3,4}[- ]\d{5,9}\b/)
      if (matchAlt) {
        num = matchAlt[0]
      }
    }

    if (num) {
      numeroBoleta.value = num
    }
  }

  if (!nombreVendedor.value) {
    const lineaVend = lineas.find(l => /vendedor/i.test(l))
    if (lineaVend) {
      const m = lineaVend.match(/vendedor[:\- ]*(.+)$/i)
      if (m && m[1]) {
        nombreVendedor.value = m[1].trim()
      }
    }
  }

  if (!fechaCompra.value) {
    let formatoISO = ""

    const matchFecha = texto.match(/\b(\d{2})[\/\-](\d{2})[\/\-](\d{4})\b/)
    if (matchFecha) {
      const d = matchFecha[1]
      const m = matchFecha[2]
      const y = matchFecha[3]
      formatoISO = `${y}-${m}-${d}`
    } else {
      const matchISO = texto.match(/\b(20\d{2})[\/\-](\d{2})[\/\-](\d{2})\b/)
      if (matchISO) {
        const y = matchISO[1]
        const m = matchISO[2]
        const d = matchISO[3]
        formatoISO = `${y}-${m}-${d}`
      }
    }

    if (formatoISO) {
      fechaCompra.value = formatoISO
    }
  }

  if (!total.value) {
    let posibleMonto = null

    for (const linea of lineas) {
      if (/total/i.test(linea)) {
        const matchMonto = linea.match(/(\d{1,3}(\.\d{3})+|\d{4,})/)
        if (matchMonto) {
          posibleMonto = matchMonto[1]
        }
      }
    }

    if (!posibleMonto) {
      const montos = []
      const regexNum = /(\d{1,3}(?:\.\d{3})+|\d{4,})/g
      let m
      while ((m = regexNum.exec(texto)) !== null) {
        montos.push(m[1])
      }
      if (montos.length) {
        posibleMonto = montos[montos.length - 1]
      }
    }

    if (posibleMonto) {
      const limpio = posibleMonto.replace(/\./g, "").replace(/\s/g, "")
      const n = parseInt(limpio, 10)
      if (!isNaN(n)) {
        total.value = n
      }
    }
  }
}

onMounted(cargarTiendas)
</script>