<template>
  <Teleport to="body">
    <Transition name="beta-modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`beta-modal-title`"
        @keydown.esc="dismiss"
      >
        <div class="relative w-full max-w-lg bg-eb-card border border-amber-700/60 rounded-2xl shadow-2xl shadow-amber-900/30 p-6 space-y-5">
          <!-- En-tête -->
          <div class="flex items-start gap-3">
            <span class="shrink-0 w-10 h-10 rounded-full bg-amber-900/50 border border-amber-700/60 flex items-center justify-center" aria-hidden="true">
              <i class="fas fa-flask text-amber-400 text-base"></i>
            </span>
            <div>
              <p class="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-0.5">
                {{ t('beta_notice.title') }}
              </p>
              <h2 id="beta-modal-title" class="text-lg font-bold text-white leading-snug">
                {{ t('beta_notice.title') }}
              </h2>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-slate-300 leading-relaxed">
            {{ t('beta_notice.body') }}
          </p>

          <!-- Bouton -->
          <div class="flex justify-end">
            <button
              ref="continueBtn"
              class="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              @click="dismiss"
            >
              {{ t('beta_notice.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/config/storageKeys'

const { t } = useI18n()
const continueBtn = ref<HTMLButtonElement | null>(null)

const show = ref(false)

// Check sessionStorage on mount
show.value = !sessionStorage.getItem(STORAGE_KEYS.BETA_NOTICE_SEEN)

// Focus management
watch(show, async (isShowing) => {
  if (isShowing) {
    await nextTick()
    continueBtn.value?.focus()
  }
})

function dismiss() {
  sessionStorage.setItem(STORAGE_KEYS.BETA_NOTICE_SEEN, '1')
  show.value = false
}
</script>

<style scoped>
.beta-modal-enter-active,
.beta-modal-leave-active {
  transition: opacity 0.3s ease;
}

.beta-modal-enter-from,
.beta-modal-leave-to {
  opacity: 0;
}

.beta-modal-enter-to,
.beta-modal-leave-from {
  opacity: 1;
}
</style>
