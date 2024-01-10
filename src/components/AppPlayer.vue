<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center mb-2" v-if="current_song.modified_name">
      <span class="song-title font-bold">{{ current_song.modified_name }}</span> by
      <span class="song-artist">{{ current_song.display_name }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click="toggleAudio">
        <i
          class="fa text-gray-500 text-xl hover:text-yellow-500 transition-all duration-300"
          :class="{ 'fa-play': !playing, 'fa-pause': playing }"
        >
        </i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ seek }}</div>
      <!-- Scrub Container  -->
      <div
        @mousedown.prevent="startDrag"
        @mousemove.prevent="dragProgress"
        @mouseup.prevent="endDrag"
        @mouseleave.prevent="endDrag"
        @click.prevent="updateSeek"
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg hover:text-yellow-500 transition-colors duration-300"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ duration }}</div>

      <!--Repeat-->
      <button type="button" @click.prevent="toggleLoopState">
        <i
          :class="{ 'text-yellow-500': loop }"
          class="fa fa-retweet text-gray-500 text-xl hover:text-yellow-500 transition-all duration-300"
        ></i>
      </button>

      <!--Sound Control-->
      <button type="button" @click.prevent="toggleVolume" v-if="current_song.modified_name">
        <i
          :class="{
            'fa-volume-off': soundPercentage < '1%',
            'fa-volume-down': parseFloat(soundPercentage) > 0 && parseFloat(soundPercentage) <= 60,
            'fa-volume-up': parseFloat(soundPercentage) > 60
          }"
          class="fas text-gray-500 text-xl hover:text-yellow-500 transition-all duration-300"
        ></i>
      </button>
      <div
        v-if="current_song.modified_name"
        @click.prevent="updateVolume"
        class="w-40 h-2 rounded bg-gray-200 relative cursor-pointer"
      >
        <span
          :style="{ left: soundPercentage }"
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
        >
          <i class="fas fa-circle hover:text-yellow-500"></i>
        </span>
        <span
          :style="{ width: soundPercentage }"
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import usePlayerStore from '@/stores/player'

export default {
  name: 'AppPlayer',
  computed: {
    ...mapState(usePlayerStore, [
      'current_song',
      'playing',
      'seek',
      'duration',
      'playerProgress',
      'soundPercentage',
      'loop'
    ])
  },
  methods: {
    ...mapActions(usePlayerStore, [
      'toggleAudio',
      'updateSeek',
      'toggleVolume',
      'updateVolume',
      'toggleLoopState',
      'dragProgress',
      'startDrag',
      'endDrag'
    ])
  }
}
</script>
