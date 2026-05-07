<template>
  <Teleport to="body">
    <Transition name="tp-modal">
      <div
        v-if="current"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`tp-modal-title`"
        @keydown.esc="dismiss"
      >
        <div class="relative w-full max-w-lg bg-eb-card border border-red-700/60 rounded-2xl shadow-2xl shadow-red-900/30 p-6 space-y-5">
          <!-- En-tête -->
          <div class="flex items-start gap-3">
            <span class="shrink-0 w-10 h-10 rounded-full bg-red-900/50 border border-red-700/60 flex items-center justify-center" aria-hidden="true">
              <i class="fas fa-triangle-exclamation text-red-400 text-base"></i>
            </span>
            <div>
              <p class="text-xs text-red-400 font-semibold uppercase tracking-wider mb-0.5">
                {{ t('tipping.modal_title') }}
              </p>
              <h2 id="tp-modal-title" class="text-lg font-bold text-white leading-snug">
                {{ t(`tipping.${current.id}.name`) }}
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ t('tipping.triggered_on', { year: current.year }) }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-slate-300 leading-relaxed">
            {{ t(`tipping.${current.id}.description`) }}
          </p>

          <!-- Effets -->
          <div class="bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
            <p class="text-xs font-semibold text-red-400 mb-1">{{ t('tipping.effects_label') }}</p>
            <p class="text-sm text-slate-200">{{ t(`tipping.${current.id}.effects`) }}</p>
          </div>

          <!-- Citation -->
          <blockquote class="border-l-2 border-slate-600 pl-3 text-xs text-slate-400 italic leading-relaxed">
            {{ t(`tipping.${current.id}.quote`) }}
          </blockquote>

          <!-- Bouton -->
          <div class="flex justify-end">
            <button
              ref="continueBtn"
              class="px-5 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              @click="dismiss"
            >
              {{ t('tipping.modal_continue') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TIPPING_POINTS } from '@/data/tippingPoints'
import { useTippingPointsStore } from '@/store/tippingPoints.store'

const { t } = useI18n()
const tpStore = useTippingPointsStore()
const continueBtn = ref<HTMLButtonElement | null>(null)

const current = computed(() => {
  const id = tpStore.pendingModalIds[0]
  if (!id) return null
  const tp = TIPPING_POINTS.find(t => t.id === id)
  if (!tp) return null
  return { ...tp, year: tpStore.triggered[id]?.year ?? 0 }
})

// Focus le bouton Continuer à l'ouverture pour l'accessibilité
watch(current, async (val) => {
  if (val) {
    await nextTick()
    continueBtn.value?.focus()
  }
})

function dismiss(): void {
  tpStore.dismissModal()
}
</script>

<style scoped>
.tp-modal-enter-active,
.tp-modal-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.tp-modal-enter-from,
.tp-modal-leave-to    { opacity: 0; transform: scale(0.96); }
</style>
