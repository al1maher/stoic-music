import { createRouter, createWebHistory } from 'vue-router'

import useUserStore from '@/stores/user.js'

const Home = () => import('@/views/HomeView.vue')
const About = () => import('@/views/AboutView.vue')
const Manage = () => import('@/views/ManageView.vue')
const Song = () => import('@/views/SongView.vue')

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    name: 'about',
    path: '/about',
    component: About,
    meta: {
      title: 'About'
    }
  },
  {
    name: 'manage',
    path: '/manage',
    component: Manage,
    meta: {
      requiresAuth: true,
      title: 'Manage'
    }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
    meta: {
      dynamicTitle: true
    }
  },

  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  },
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  const hasTitle = to.meta && to.meta.title
  document.title = hasTitle ? `Stoic Music | ${to.meta.title}` : 'Stoic Music'
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const store = useUserStore()

  if (store.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router
