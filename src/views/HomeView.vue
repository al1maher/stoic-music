<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-10 md:py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-3xl md:text-5xl mb-3 md:mb-5">{{ $t('home.listen') }}</h1>
          <p class="my-text w-full md:w-8/12 mx-auto sm:w-10/12 lg:w-8/12 xl:w-6/12 md:px-6">
            {{ $t('home.info') }}
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-3 md:mt-5 -mb-10 md:-mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{ $t('home.songs') }}</span>
          <i
            class="fa fa-headphones text-yellow-500 text-xl"
            :class="{ 'float-right': $i18n.locale === 'en', 'float-left': $i18n.locale === 'ar' }"
          ></i>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <HomeSongItem v-for="song in songs" :key="song.id" :song="song" />
        </ol>
      </div>
    </section>
  </main>
</template>

<script>
import HomeSongItem from '../components/HomeSongItem.vue'
import { songsCollection } from '@/includes/firebase'
export default {
  name: 'HomeView',
  components: {
    HomeSongItem
  },
  data() {
    return {
      songs: [],
      maxPerPage: 10,
      pendingRequest: false
    }
  },
  async created() {
    this.getSongs()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async getSongs() {
      if (this.pendingRequest) {
        return
      }

      this.pendingRequest = true
      let snapshots
      if (this.songs.length) {
        const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docId).get()
        snapshots = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get()
      } else {
        snapshots = await songsCollection.orderBy('modified_name').limit(this.maxPerPage).get()
      }
      snapshots.forEach((doc) => {
        this.songs.push({
          docId: doc.id,
          ...doc.data()
        })
      })
      this.pendingRequest = false
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    }
  }
}
</script>

<style scoped>
.my-text {
  text-wrap: balance;
}
</style>
