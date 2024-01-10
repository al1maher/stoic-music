<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div
        class="container mx-auto flex flex-col items-center justify-center lg:flex-row lg:justify-start"
      >
        <!-- Play/Pause Button -->
        <button
          id="play_button"
          @click.prevent="newSong(song)"
          type="button"
          :class="{
            'bg-yellow-500 text-white animate-pulse': playing && current_song.id === song.id
          }"
          class="z-50 h-24 w-24 text-xl lg:text-3xl bg-white text-black rounded-full focus:outline-none hover:bg-yellow-500 hover:text-white mb-4 lg:mb-0"
        >
          <i
            class="fas"
            :class="{
              'fa-play': !playing || (playing && current_song.id !== song.id),
              'fa-pause': playing && current_song.id === song.id
            }"
          ></i>
        </button>
        <div class="z-50 text-center lg:text-start lg:ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold mb-2 lg:mb-0">{{ song.modified_name }}</div>
          <div class="mb-2 lg:mb-4">{{ song.genre }}</div>
          <!-- <div class="song-price">{{ $n(10, 'currency') }}</div> -->
        </div>
      </div>
    </section>

    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc('song.comment_count', song.comment_count, { count: song.comment_count })
          }}</span>
          <i
            :class="{ 'float-right': $i18n.locale === 'en', 'float-left': $i18n.locale === 'ar' }"
            class="fa fa-comments text-green-400 text-2xl"
          ></i>
        </div>
        <div class="p-6">
          <div
            v-if="comment_show_alert"
            :class="comment_alert_variant"
            class="text-white text-center font-bold p-4 mb-4"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form v-if="userLoggedIn" :validation-schema="schema" @submit="addComment">
            <vee-field
              name="comment"
              as="textarea"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              :placeholder="$t('song.addComment')"
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              :disabled="comment_in_submission"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              {{ $t('song.submit') }}
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">{{ $t('song.latest') }}</option>
            <option value="2">{{ $t('song.oldest') }}</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto" id="#comments">
      <SingleComment :comment="comment" v-for="comment in sortedComments" :key="comment.docId" />
    </ul>
  </main>
</template>

<script>
import { songsCollection, commentsCollection, auth } from '@/includes/firebase'
import { mapState, mapActions } from 'pinia'
import usePlayerStore from '@/stores/player'
import useUserStore from '@/stores/user'

import SingleComment from '../components/SingleComment.vue'

export default {
  name: 'SongView',
  components: {
    SingleComment
  },
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3'
      },
      songComments: [],
      sort: '1',
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted.',
      myTime: 0
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['playing', 'current_song']),
    sortedComments() {
      return this.songComments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        } else if (this.sort === '2') {
          return new Date(a.datePosted) - new Date(b.datePosted)
        }
      })
    }
  },
  async beforeRouteEnter(to, from, next) {
    let songId = to.params.id

    const songSnapshot = await songsCollection.doc(songId).get()

    next((vm) => {
      if (!songSnapshot.exists) {
        this.$router.push({ name: 'home' })
        return
      }

      vm.song = {
        id: songSnapshot.id,
        ...songSnapshot.data()
      }

      document.title = `Stoic Music | ${vm.song.modified_name}`

      const { sort } = vm.$route.query
      vm.sort = sort === '1' || sort === '2' ? sort : '1'

      vm.getComments()
    })
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = 'Please wait! Your comment is being submitted.'

      this.songComments = []
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.song.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }
      console.log(comment)

      await commentsCollection.add(comment)

      this.song.comment_count += 1

      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count
      })

      this.getComments()
      this.comment_in_submission = false
      this.comment_alert_message = 'Comment submitted successfully!'
      this.comment_alert_variant = 'bg-green-500'

      resetForm()
    },
    async getComments() {
      const commentsSnapshot = await commentsCollection.where('sid', '==', this.song.id).get()
      this.songComments = []
      commentsSnapshot.forEach((doc) => {
        this.songComments.push({
          docId: doc.id,
          ...doc.data()
        })
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }
      this.$router.push({
        query: {
          sort: newVal
        }
      })
    }
  }
}
</script>
