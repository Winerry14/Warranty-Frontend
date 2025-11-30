import { createRouter, createWebHistory } from "vue-router"
import LoginView from "../views/LoginView.vue"
import RegistroView from "../views/RegistroView.vue"
import BoletasView from "../views/BoletasView.vue"
import BoletaDetalleView from "../views/BoletaDetalleView.vue"
import BoletaNuevaView from "../views/BoletaNuevaView.vue"
import AdminView from "../views/AdminView.vue"
import NotificacionesView from "../views/NotificacionesView.vue"
import ProductosView from "../views/ProductosView.vue"
import TiendasAdminView from "../views/TiendasAdminView.vue" // NUEVO

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
  {
    path: "/boletas/:id/notificaciones",
    name: "Notificaciones",
    component: NotificacionesView,
    props: true
  },
  {
    path: "/boletas/:id/productos",
    name: "ProductosBoleta",
    component: ProductosView,
    props: true
  },

  { path: "/admin", name: "Admin", component: AdminView },
  {
    path: "/admin/tiendas",
    name: "TiendasAdmin",
    component: TiendasAdminView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ["Login", "Registro"]

  const stored = localStorage.getItem("usuarioActual")
  const usuario = stored ? JSON.parse(stored) : null
  const authRequired = !publicPages.includes(to.name)

  if (to.name === "Login") {
    if (usuario) {
      localStorage.removeItem("usuarioActual")
    }
    return next()
  }

  if (authRequired && !usuario) {
    return next({ name: "Login" })
  }

  if ((to.name === "Admin" || to.name === "TiendasAdmin") && usuario?.rol !== "ADMIN") {
    return next({ name: "Boletas" })
  }

  next()
})

export default router
