<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex items-center justify-between py-5 px-4 flex-wrap">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl" :to="{ name: 'home' }">{{
        $t('header.appName')
      }}</router-link>

      <!-- Toggle button for small screens -->
      <button class="block sm:hidden text-white px-2" @click.prevent="toggleMobileMenu">
        <svg
          class="fill-current h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      <div
        :class="{ hidden: !isMobileMenuOpen }"
        class="w-full sm:w-auto mt-4 sm:mt-0 sm:flex-grow sm:flex"
      >
        <!-- Primary Navigation -->
        <ul
          class="flex"
          :class="{
            'md:ml-2 ml-auto': currentLocale === 'English (US)',
            'md:mr-2 mr-auto': currentLocale === 'العربية (مصر)'
          }"
        >
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">{{
              $t('header.about')
            }}</router-link>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">{{
              $t('header.logReg')
            }}</a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t('header.manage')
              }}</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">{{
                $t('header.logout')
              }}</a>
            </li>
          </template>
        </ul>
        <ul
          class="mt-0"
          :class="{
            'ml-auto': currentLocale === 'English (US)',
            'mr-auto': currentLocale === 'العربية (مصر)'
          }"
        >
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">{{
              currentLocale
            }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from 'pinia'
import useModalStore from '../stores/modal'
import useUserStore from '../stores/user'
export default {
  name: 'AppHeader',
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  computed: {
    ...mapStores(useModalStore, useUserStore),
    currentLocale() {
      return this.$i18n.locale === 'ar' ? 'العربية (مصر)' : 'English (US)'
    }
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
    signOut() {
      this.userStore.signOut()
      if (this.$route.name === 'manage') {
        this.$router.push({ name: 'home' })
      }
    },
    changeLocale() {
      const newLocale = this.$i18n.locale === 'ar' ? 'en' : 'ar'
      this.$i18n.locale = newLocale

      // Update text direction based on the new locale
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    }
  }
}
</script>
