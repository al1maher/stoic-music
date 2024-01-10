<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t('manage.upload') }}</span>
      <i
        :class="{ 'float-right': $i18n.locale === 'en', 'float-left': $i18n.locale === 'ar' }"
        class="fas fa-upload text-green-400 text-2xl"
      ></i>
    </div>
    <div class="p-6">
      <transition name="alert">
        <div
          v-if="show_alert"
          :class="alert_variant"
          class="text-white text-center font-bold p-4 mb-4"
        >
          {{ alert_message }}
        </div>
      </transition>
      <!-- Upload Dropbox -->
      <div
        class="hidden lg:block w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ $t('manage.drop') }}</h5>
      </div>
      <input type="file" multiple @change="upload($event)" class="hidden" ref="fileInput" />
      <button
        class="w-full bg-green-400 hover:bg-green-500 my-2 text-white py-2 px-4 rounded"
        @click="$refs.fileInput.click()"
      >
        {{ $t('manage.select') }}
      </button>

      <hr class="my-6" />
      <!-- Progess Bar -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div v-if="upload.currentProgress !== 100" class="flex justify-between items-center">
          <div class="font-bold text-sm" :class="upload.textClass">
            <i :class="upload.icon"></i>
            {{ upload.name }}
          </div>
          <div>
            <i
              @click="cancelUpload(upload)"
              class="fas fa-times text-gray-700 cursor-pointer hover:text-gray-600"
            ></i>
          </div>
        </div>

        <div
        v-if="upload.currentProgress !== 100"
          class="flex h-4 overflow-hidden bg-gray-200 rounded"
        >
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase'
export default {
  name: 'ManageUpload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! your song is being uploaded.'
    }
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false

      this.show_alert = true
      this.in_submission = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait! your song is being uploaded.'

      //Object Destructuring into an Array
      //Ternary Operator to distinguish between drag and drop and fallback
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          console.log('File is not supported!')
          return
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            currentProgress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            textClass: 'text-red-400'
          })
          return
        }

        const storageRef = storage.ref()
        const songsRef = storageRef.child(`songs/${file.name}`)

        const task = songsRef.put(file)

        const uploadIndex =
          this.uploads.push({
            //Reminder: push method returns the length of the array
            task,
            currentProgress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            textClass: ''
          }) - 1

        task.on(
          'state_changed',
          //Progress bar function
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[uploadIndex].currentProgress = progress
          },
          //Error function
          (error) => {
            //If an error happened, change the progress bar to failed state
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times'
            this.uploads[uploadIndex].textClass = 'text-red-400'
            console.log(error)
          },
          //Success function
          async () => {
            //Saving the Data (songs) in the database first
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            }

            song.url = await task.snapshot.ref.getDownloadURL()

            const songRef = await songsCollection.add(song)

            const songSnapshot = await songRef.get()

            this.addSong(songSnapshot)

            //Updating the progress bar to success state
            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].textClass = 'text-green-400'

            this.in_submission = false
            this.alert_variant = 'bg-green-500'
            this.alert_message = 'Song uploaded successfully!'

            setTimeout(() => {
              this.show_alert = false
            }, 2000)
          }
        )
      })
    },
    cancelUpload(upload) {
      upload.task.cancel()
    }
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  }
}
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: opacity 1s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
}
</style>
