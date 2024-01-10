// In your timer.js
import { shallowRef, computed } from 'vue'

const TTL = 60 * 1000 // 1 minute
let timerId
const TTLCounter = shallowRef(0)

export function computedTTL() {
  if (!timerId) {
    timerId = setInterval(() => {
      TTLCounter.value++
    }, TTL)
  }

  return computed(() => {
    return TTLCounter.value
  })
}
