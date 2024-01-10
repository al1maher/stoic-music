<template>
  <li class="p-6 bg-gray-50 border border-gray-200">
    <!-- Comment Author -->
    <div class="mb-5">
      <div class="font-bold">{{ comment.name }}</div>
      <time>{{ timeSince(comment.datePosted) }}</time>
    </div>

    <p>
      {{ comment.content }}
    </p>
  </li>
</template>

<script>
import { computedTTL } from '@/includes/timer'
export default {
  name: 'SingleComment',
  props: ['comment'],
  setup() {
    const updateTrigger = computedTTL()

    return {
      updateTrigger
    }
  },
  methods: {
    timeSince(timestamp) {
      const datePosted = new Date(timestamp)
      const currentDate = new Date()
      const seconds = Math.floor((currentDate - datePosted) / 1000)

      //Accessing the updateTrigger value to add timeSince function as a dependency
      this.updateTrigger.value

      let interval = Math.floor(seconds / 31536000)
      if (interval > 1) {
        return `${interval} years ago`
      }

      interval = Math.floor(seconds / 2592000)
      if (interval > 1) {
        return `${interval} months ago`
      }

      interval = Math.floor(seconds / 86400)
      if (interval >= 1) {
        if (interval < 2) {
          return '1 day ago'
        } else if (interval < 30) {
          return `${interval} days ago`
        } else if (interval < 60) {
          return '1 month ago'
        } else {
          const months = Math.floor(interval / 30)
          return months > 1 ? `${months} months ago` : '1 month ago'
        }
      }

      interval = Math.floor(seconds / 3600)
      if (interval >= 1) {
        return `${interval} ${interval === 1 ? 'hour' : 'hours'} ago`
      }

      interval = Math.floor(seconds / 60)
      if (interval >= 1) {
        return `${interval} ${interval === 1 ? 'minute' : 'minutes'} ago`
      }

      return `${Math.floor(seconds)} seconds ago`
    }
  }
}
</script>
