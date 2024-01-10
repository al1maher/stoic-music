<template>
  <AppHeader />

  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component"></component>
    </transition>
  </RouterView>

  <AppPlayer />

  <AppAuth />
</template>

<script>
import AppAuth from './components/AppAuth.vue'
import AppHeader from './components/AppHeader.vue'
import AppPlayer from './components/AppPlayer.vue'

import { mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'

import { auth } from './includes/firebase'

export default {
  name: 'App',
  components: {
    AppAuth,
    AppHeader,
    AppPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
