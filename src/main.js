import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VeeValidatePlugin from './includes/validation'
import progressBar from './includes/ProgressBar'
import i18n from '@/includes/i18n'

import Icon from '@/directives/icon'

import { registerSW } from 'virtual:pwa-register'

import { auth } from './includes/firebase'
import { GlobalComponents } from './includes/_globals'

import './assets/base.css'
import './assets/main.css'
import 'nprogress/nprogress.css'

registerSW({ immediate: true })

progressBar(router)

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)
    app.use(i18n)
    app.use(GlobalComponents)
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
