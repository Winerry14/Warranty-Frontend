import { createRouter, createWebHistory } from "vue-router"
import LoginView from "../views/LoginView.vue"
import RegistroView from "../views/RegistroView.vue"
import BoletasView from "../views/BoletasView.vue"
import BoletaDetalleView from "../views/BoletaDetalleView.vue"
import BoletaNuevaView from "../views/BoletaNuevaView.vue"
import AdminView from "../views/AdminView.vue"

const routes = [
  { path: "/", name: "Login", component: LoginView },

  { path: "/registro", name: "Registro", component: RegistroView },

  { path: "/boletas", name: "Boletas", component: BoletasView },
  { path: "/boletas/nueva", name: "BoletaNueva", component: BoletaNuevaView },
  {
    path: "/boletas/:id",
    name: "BoletaDetalle",
    component: BoletaDetalleView,
    props: true
  },

  { path: "/admin", name: "Admin", component: AdminView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protección de rutas según login y rol
router.beforeEach((to, from, next) => {
  const publicPages = ["Login", "Registro"]
  const authRequired = !publicPages.includes(to.name)

  const stored = localStorage.getItem("usuarioActual")
  const usuario = stored ? JSON.parse(stored) : null

  if (authRequired && !usuario) {
    return next({ name: "Login" })
  }

  if (to.name === "Admin" && usuario?.rol !== "ADMIN") {
    return next({ name: "Boletas" })
  }

  next()
})

export default router
