<template>
  <dialog
    ref="dialogEl"
    class="game-intro-dialog"
    :aria-label="t('game_intro.aria_dialog')"
    @close="onClose"
  >
    <div class="game-intro-inner">

      <!-- Branding -->
      <div class="intro-item" :style="{ animationDelay: '0s' }">
        <div class="flex flex-col items-center gap-2 mb-8">
          <i class="fa fa-earth-americas text-eb-cyan text-4xl" aria-hidden="true"></i>
          <span class="text-eb-cyan font-black tracking-widest text-sm uppercase">EarthBalance</span>
        </div>
      </div>

      <!-- Paragraphe 1 — grand / accrocheur -->
      <p class="intro-item intro-p1" :style="{ animationDelay: '0.18s' }">
        {{ t('game_intro.p1') }}
      </p>

      <!-- Paragraphes 2–5 -->
      <p class="intro-item intro-p2" :style="{ animationDelay: '0.36s' }">
        {{ t('game_intro.p2') }}
      </p>
      <p class="intro-item intro-p2" :style="{ animationDelay: '0.54s' }">
        {{ t('game_intro.p3') }}
      </p>
      <p class="intro-item intro-p2" :style="{ animationDelay: '0.72s' }">
        {{ t('game_intro.p4') }}
      </p>
      <p class="intro-item intro-p2" :style="{ animationDelay: '0.90s' }">
        {{ t('game_intro.p5') }}
      </p>

      <!-- Séparateur -->
      <hr class="intro-item intro-sep" :style="{ animationDelay: '1.08s' }" aria-hidden="true" />

      <!-- Paragraphe 6 — italique / centré -->
      <p class="intro-item intro-p6" :style="{ animationDelay: '1.26s' }">
        {{ t('game_intro.p6') }}
      </p>

      <!-- Paragraphe 7 — climax -->
      <p class="intro-item intro-p7" :style="{ animationDelay: '1.44s' }">
        {{ t('game_intro.p7') }}
      </p>

      <!-- CTA -->
      <div class="intro-item flex justify-center mt-10" :style="{ animationDelay: '1.62s' }">
        <button
          class="px-10 py-3 rounded-xl font-black text-base bg-eb-cyan text-eb-dark hover:bg-cyan-300 transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none"
          @click="dismiss"
        >
          {{ t('game_intro.cta') }}
        </button>
      </div>

    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/store/game.store'
import { STORAGE_KEYS } from '@/config/storageKeys'

const { t } = useI18n()
const gameStore = useGameStore()
const dialogEl  = ref<HTMLDialogElement | null>(null)

onMounted(() => {
  if (gameStore.introVisible) dialogEl.value?.showModal()
})

watch(
  () => gameStore.introVisible,
  (visible) => { if (visible) dialogEl.value?.showModal() },
)

function dismiss(): void {
  dialogEl.value?.close()
}

function onClose(): void {
  localStorage.setItem(STORAGE_KEYS.INTRO_SEEN, '1')
  gameStore.introVisible = false
}
</script>

<style scoped>
.game-intro-dialog {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100svh;
  max-width: none;
  max-height: none;
  margin: 0;
  border: none;
  padding: 0;
  background: transparent;
  overflow-y: auto;
}

.game-intro-dialog::backdrop {
  background: rgba(6, 10, 18, 0.97);
}

.game-intro-inner {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 42rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

@keyframes introFadeIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-item {
  opacity: 0;
  animation: introFadeIn 0.55s ease-out forwards;
  animation-fill-mode: both;
}

.intro-p1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.intro-p2 {
  font-size: 0.9375rem;
  color: #94a3b8;
  margin-bottom: 1rem;
  line-height: 1.7;
}

.intro-sep {
  border: none;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  margin: 1.5rem 0;
}

.intro-p6 {
  font-size: 1rem;
  font-style: italic;
  color: #cbd5e1;
  text-align: center;
  margin-bottom: 1rem;
}

.intro-p7 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f1f5f9;
  text-align: center;
  line-height: 1.5;
}
</style>
