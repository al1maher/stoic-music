<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <ManageUpload :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.mySongs') }}</span>
            <i
              :class="{ 'float-right': $i18n.locale === 'en', 'float-left': $i18n.locale === 'ar' }"
              class="fa fa-compact-disc text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <ManageSongsList
              v-for="(song, index) in songs"
              :key="song.id"
              :song="song"
              :updateSongs="updateSongs"
              :index="index"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ManageUpload from '../components/ManageUpload.vue'
import ManageSongsList from '../components/ManageSongsList.vue'

import { songsCollection, auth } from '@/includes/firebase'

export default {
  name: 'ManageView',
  components: {
    ManageUpload,
    ManageSongsList
  },
  data() {
    return {
      songs: [],
      usavedFlag: false
    }
  },
  async created() {
    await this.fetchSongs()
  },
  methods: {
    async fetchSongs() {
      try {
        const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

        // Map the documents to an array of songs
        snapshot.forEach(this.addSong)
        console.log(this.songs)
      } catch (error) {
        console.error('Error fetching songs:', error)
      }
    },
    updateSongs(index, values) {
      this.songs[index].modified_name = values.modified_name
      this.songs[index].genre = values.genre
    },
    removeSong(index) {
      this.songs.splice(index, 1)
    },
    addSong(document) {
      const song = {
        ...document.data(),
        id: document.id
      }
      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure want to leave?')
      next(leave)
    }
  }
}
</script>
