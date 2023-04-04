import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/UserLogin.vue'
import Register from '@/views/UserRegister.vue'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
