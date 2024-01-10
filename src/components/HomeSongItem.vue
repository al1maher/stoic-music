<style scoped>
  .song-item-container {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    .song-item-container {
      max-width: 200px; /* Adjust the max-width as per your preference */
    }
  }
</style>

<template>
  <router-link
    :to="`/song/${song.docId}`"
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    :id="`song-id-$`"
  >
    <div>
      <a href="#" class="font-bold block text-gray-600 song-item-container">{{ song.modified_name }}</a>
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg hover:text-yellow-500 transition duration-300 group">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docId }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i
            class="fa fa-comments text-gray-600 group-hover:text-yellow-500 transition duration-300"
          ></i>
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </router-link>
</template>


<script>
export default {
  name: 'HomeSongItem',
  props: {
    song: {
      type: Object,
      required: true
    }
  },
}
</script>
