import { createRouter, createWebHistory } from '@ionic/vue-router';
import Welcome from '../views/Welcome.vue'
import ProfileUser from '../views/User/Perfil.vue'
import Notificaciones from '../views/Notificaciones.vue'

function auth(to,from, next){
  if(localStorage.usuario){
    next({name:'/user'});
  }else{
    next();
  }
}

const routes = [
  {
    path: '/',
    redirect: '/principal'
  },
  {
    path: '/principal',
    beforeEnter:auth,
    component: Welcome
  },
  {
    path: '/Login',
    beforeEnter:auth,
    component: ()=> import('../views/Login.vue')

  },
  {
    path: '/PassRecovery',
    component: ()=> import('../views/PasswordRecovery.vue')

  },
  {
    path: '/SignUp',
    beforeEnter:auth,
    component: ()=> import('../views/SignUp.vue')

  },
  {
  path: '/user',
  name:'/user',
    component: ()=> import('../views/User/BaseUser.vue')
  },
  {
  path: '/ProfileUser',
    component: ProfileUser
  },
  {
  path: '/Notificaciones',
    component: Notificaciones
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
