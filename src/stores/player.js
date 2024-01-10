import { defineStore } from 'pinia'
import { Howl } from 'howler'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
    soundPercentage: '100%',
    loop: false,
    isDragging: false
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        if (song.id === this.current_song.id) {
          this.toggleAudio()
          return
        }
        this.sound.stop()
        this.sound.unload()
      }

      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true,
        loop: this.loop,
        volume: 1
      })

      this.sound.play()
      this.soundPercentage = '100%'

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      // Checking if the object is a Howl object
      if (!this.sound.playing) {
        return
      }
      // Toggling play/pause
      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    progress() {
      this.seek = formatTime(this.sound.seek())
      this.duration = formatTime(this.sound.duration())
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }

      const { x, width } = event.currentTarget.getBoundingClientRect()

      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once('seek', this.progress)
    },
    toggleVolume() {
      if (this.sound instanceof Howl) {
        if (this.sound.volume() === 0) {
          if (this.originalVolume !== undefined) {
            const savedVolume = this.originalVolume
            this.sound.volume(savedVolume)
            this.soundPercentage = `${savedVolume * 100}%`
          } else {
            // If originalVolume is not defined (possibly not muted before), set to 100%
            this.sound.volume(1)
            this.soundPercentage = '100%'
          }
        } else {
          // Mute and save the current soundPercentage
          this.originalVolume = this.sound.volume()
          this.sound.volume(0)
          this.soundPercentage = '0%'
        }
      }
    },
    updateVolume(event) {
      if (this.sound instanceof Howl && this.sound.playing()) {
        const { x, width } = event.currentTarget.getBoundingClientRect()

        const clickX = event.clientX - x
        const percentage = clickX / width
        const newVolume = Math.max(0, Math.min(1, percentage))

        this.sound.volume(newVolume)
        this.soundPercentage = `${newVolume * 100}%`
      }
    },
    toggleLoopState() {
      this.loop = !this.loop
      if (this.sound instanceof Howl) {
        this.sound.loop(this.loop)
      }
      console.log(this.loop)
    },
    startDrag(event) {
      this.isDragging = true
      this.animationFrameId = requestAnimationFrame(() => this.dragProgress(event))
    },
    endDrag() {
      if (this.isDragging) {
        this.isDragging = false
        // Stop updating the progress bar during dragging
        cancelAnimationFrame(this.animationFrameId)

        // Check if the sound is still playing and call progress
        if (this.sound.playing()) {
          requestAnimationFrame(this.progress)
        }
      }
    },
    dragProgress(event) {
      // if (!this.sound.playing()) {
      //   return
      // }
      if (this.isDragging) {
        const target = event.currentTarget
        if (!target) {
          return
        }

        const { x, width } = target.getBoundingClientRect()
        const clickX = event.clientX - x
        const percentage = clickX / width
        const newProgress = Math.max(0, Math.min(1, percentage))

        const newSeekTime = newProgress * this.sound.duration()
        this.sound.seek(newSeekTime)

        // Update the progress bar immediately
        this.seek = formatTime(newSeekTime)
        this.playerProgress = `${(newSeekTime / this.sound.duration()) * 100}%`

        if (this.sound.playing()) {
          requestAnimationFrame(() => this.dragProgress(event)) // Keep updating during dragging
        }
      }
    }
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }
      return false
    },
    toggleLoop: (state) => {
      return state.loop
    }
  }
})

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')
  return `${formattedMinutes}:${formattedSeconds}`
}
