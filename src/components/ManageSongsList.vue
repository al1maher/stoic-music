<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div>
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        aria-label="Delete Song"
        title="Delete Song"
        @click.prevent="deleteSong"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600"
        :class="{ 'float-right': $i18n.locale === 'en', 'float-left': $i18n.locale === 'ar' }"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        aria-label="Edit Song"
        title="Edit Song"
        @click.prevent="showForm = !showForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600"
        :class="{ 'float-right': $i18n.locale === 'en', 'float-left': $i18n.locale === 'ar' }"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <transition name="form">
      <div v-show="showForm">
        <transition name="alert">
          <div
            v-if="show_alert"
            :class="alert_variant"
            class="text-white text-center font-bold p-4 mb-4"
          >
            {{ alert_message }}
          </div>
        </transition>
        <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
          <div class="mb-3">
            <label class="inline-block">{{ $t('manage.songTitle') }}</label>
            <vee-field
              name="modified_name"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              placeholder="Enter Song Title"
              @input="updateUnsavedFlag(true)"
            />
            <ErrorMessage class="text-red-600" name="modified_name" />
          </div>
          <div class="mb-3">
            <label class="inline-block mb-2">{{ $t('manage.genre') }}</label>
            <vee-field
              name="genre"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              placeholder="Enter Genre"
              @input="updateUnsavedFlag(true)"
            />
            <ErrorMessage class="text-red-600" name="genre" />
          </div>
          <button
            :disabled="in_submission"
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 mr-2"
          >
            {{ $t('manage.submit') }}
          </button>
          <button
            @click.prevent="showForm = false"
            :disabled="in_submission"
            type="button"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
          >
            {{ $t('manage.goBack') }}
          </button>
        </vee-form>
      </div>
    </transition>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate'
import { songsCollection, storage } from '@/includes/firebase'

export default {
  name: 'ManageSongsList',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSongs: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! updating song info.'
    }
  },
  components: { ErrorMessage },
  methods: {
    async edit(values) {
      this.show_alert = true
      this.in_submission = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait! Updating Song Info.'

      try {
        await songsCollection.doc(this.song.id).update(values)
      } catch (error) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Please try again later.'
        return
      }

      this.updateSongs(this.index, values)

      this.updateUnsavedFlag(false)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Form submitted succefuly!'

      setTimeout(() => {
        this.show_alert = false
      }, 2000)
      setTimeout(() => {
        this.showForm = false
      }, 2500)
    },
    async deleteSong() {
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)
      console.log(songRef)

      await songRef.delete()
      await songsCollection.doc(this.song.id).delete()

      this.removeSong(this.index)
    }
  }
}
</script>

<style scoped>
.form-enter-active,
.form-leave-active {
  transition:
    transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55),
    opacity 0.5s ease;
}

.form-enter-from,
.form-leave-to {
  transform: translateY(-50%) scaleY(0);
  opacity: 0;
}

.form-enter-to,
.form-leave-from {
  transform: translateY(0) scaleY(1);
  opacity: 1;
}

.alert-enter-active,
.alert-leave-active {
  transition: opacity 1s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
}
</style>
