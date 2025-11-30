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
        Bienvenido a Warranty
      </h1>
      <p style="margin: 0 0 1.2rem; text-align: center; font-size: 0.95rem;">
        Gestión de Garantías
      </p>

      <form @submit.prevent="iniciarSesion">
        <div style="margin-bottom: 0.8rem;">
          <label>Email</label><br />
          <input
            v-model="email"
            type="email"
            placeholder="ejemplo@correo.com"
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
          {{ cargando ? "Ingresando..." : "Iniciar Sesión" }}
        </button>
      </form>

      <p v-if="error" style="margin-top: 0.8rem; color: #b91c1c;">
        {{ error }}
      </p>

      <hr style="margin: 1.2rem 0; border-color: #e5e7eb;" />

      <p style="margin: 0 0 0.5rem; font-size: 0.9rem; text-align: center;">
        ¿No tienes cuenta? Regístrate aquí
      </p>
      <div style="text-align: center;">
        <router-link
          :to="{ name: 'Registro' }"
          style="
            font-size: 0.9rem;
            color: #2563eb;
            text-decoration: none;
          "
        >
          Crear cuenta
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

const email = ref("")
const password = ref("")
const cargando = ref(false)
const error = ref("")

const API_BASE = "https://warranty-backend-hryd.onrender.com/api"

const iniciarSesion = async () => {
  try {
    cargando.value = true
    error.value = ""

    if (!email.value || !password.value) {
      error.value = "Debes ingresar email y contraseña."
      return
    }

    const res = await axios.get(`${API_BASE}/usuarios`)
    const usuarios = res.data || []

    const u = usuarios.find(u => u.email === email.value)

    if (!u) {
      error.value = "Usuario no encontrado."
      return
    }

    if (u.password !== password.value) {
      error.value = "Contraseña incorrecta."
      return
    }

    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({
        idUsuario: u.idUsuario,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol
      })
    )

    if (u.rol === "ADMIN") {
      router.push({ name: "Admin" })
    } else {
      router.push({ name: "Boletas" })
    }
  } catch (e) {
    error.value = "Error al iniciar sesión."
  } finally {
    cargando.value = false
  }
}
</script>
