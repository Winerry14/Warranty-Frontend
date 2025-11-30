<template>
  <div
    style="
      background: #e5e7eb;
      min-height: 100vh;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 420px;
        margin: 30px auto;
        background: #ffffff;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
        color: #111827;
      "
    >
      <h1 style="margin: 0 0 0.5rem; text-align: center;">
        Crear cuenta
      </h1>
      <p style="margin: 0 0 1.2rem; text-align: center; font-size: 0.95rem;">
        Regístrate para gestionar tus garantías en Warranty.
      </p>

      <form @submit.prevent="registrar">
        <div style="margin-bottom: 0.8rem;">
          <label>Nombre completo</label><br />
          <input
            v-model="nombre"
            type="text"
            required
            style="
              width: 100%;
              padding: 0.45rem;
              border-radius: 10px;
              border: 1px solid #d1d5db;
            "
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Email</label><br />
          <input
            v-model="email"
            type="email"
            required
            style="
              width: 100%;
              padding: 0.45rem;
              border-radius: 10px;
              border: 1px solid #d1d5db;
            "
          />
        </div>

        <div style="margin-bottom: 0.8rem;">
          <label>Contraseña</label><br />
          <input
            v-model="password"
            type="password"
            required
            style="
              width: 100%;
              padding: 0.45rem;
              border-radius: 10px;
              border: 1px solid #d1d5db;
            "
          />
        </div>

        <button
          type="submit"
          :disabled="cargando"
          style="
            width: 100%;
            padding: 0.5rem;
            border-radius: 999px;
            border: none;
            background: #2563eb;
            color: white;
            cursor: pointer;
            margin-top: 0.3rem;
          "
        >
          {{ cargando ? "Creando cuenta..." : "Crear cuenta" }}
        </button>
      </form>

      <p v-if="error" style="margin-top: 0.8rem; color: #b91c1c;">
        {{ error }}
      </p>
      <p v-if="mensaje" style="margin-top: 0.8rem; color: #15803d;">
        {{ mensaje }}
      </p>

      <hr style="margin: 1.2rem 0; border-color: #e5e7eb;" />

      <p style="margin: 0; font-size: 0.9rem; text-align: center;">
        ¿Ya tienes cuenta?
      </p>
      <div style="text-align: center; margin-top: 0.3rem;">
        <router-link
          :to="{ name: 'Login' }"
          style="
            font-size: 0.9rem;
            color: #2563eb;
            text-decoration: none;
          "
        >
          Volver a iniciar sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const nombre = ref("")
const email = ref("")
const password = ref("")
const cargando = ref(false)
const error = ref("")
const mensaje = ref("")

const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const registrar = async () => {
  try {
    cargando.value = true
    error.value = ""
    mensaje.value = ""

    const payload = {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      rol: "USUARIO"
    }

    const res = await axios.post(`${API_BASE}/usuarios`, payload)

    const u = res.data
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({
        idUsuario: u.idUsuario,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol
      })
    )

    router.push({ name: "Boletas" })
  } catch (e) {
    if (e.response && e.response.status === 500) {
      error.value =
        "No se pudo crear la cuenta. Es posible que el email ya exista."
    } else {
      error.value = "Error al registrar usuario."
    }
  } finally {
    cargando.value = false
  }
}
</script>
