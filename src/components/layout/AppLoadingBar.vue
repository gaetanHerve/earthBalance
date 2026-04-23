<template>
  <Transition name="loading-bar">
    <div
      v-if="visible"
      class="loading-bar"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="progress"
      :aria-label="t('common.page_loading')"
    >
      <div class="loading-bar-fill" :style="{ width: progress + '%' }"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const visible  = ref(false)
const progress = ref(0)

let fillTimer:    ReturnType<typeof setTimeout> | null = null
let hideTimer:    ReturnType<typeof setTimeout> | null = null
let progressInterval: ReturnType<typeof setInterval> | null = null

function start() {
  clearAll()
  visible.value  = true
  progress.value = 0

  // Monte rapidement à 30%, puis progresse lentement jusqu'à 85%
  fillTimer = setTimeout(() => { progress.value = 30 }, 50)
  progressInterval = setInterval(() => {
    if (progress.value < 85) progress.value += 2
    else clearInterval(progressInterval!)
  }, 120)
}

function finish() {
  clearAll()
  progress.value = 100
  hideTimer = setTimeout(() => {
    visible.value  = false
    progress.value = 0
  }, 350)
}

function clearAll() {
  if (fillTimer)         clearTimeout(fillTimer)
  if (hideTimer)         clearTimeout(hideTimer)
  if (progressInterval)  clearInterval(progressInterval)
}

const removeBeforeEach = router.beforeEach(start)
const removeAfterEach  = router.afterEach(() => setTimeout(finish, 300))

onUnmounted(() => {
  removeBeforeEach()
  removeAfterEach()
  clearAll()
})
</script>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  background: transparent;
  pointer-events: none;
}

.loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00e5ff);
  transition: width 0.25s ease;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
}

/* Transition sur le conteneur lui-même */
.loading-bar-enter-active { transition: opacity 0.15s ease; }
.loading-bar-leave-active { transition: opacity 0.35s ease; }
.loading-bar-enter-from,
.loading-bar-leave-to    { opacity: 0; }
</style>
