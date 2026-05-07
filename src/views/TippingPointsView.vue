<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">
    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-black text-white mb-1">{{ t('tipping.page_title') }}</h1>
      <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">{{ t('tipping.page_subtitle') }}</p>
    </div>

    <!-- Compteur de déclenchés -->
    <div class="flex gap-3 flex-wrap">
      <span
        v-for="tp in allTps"
        :key="tp.id"
        class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium"
        :class="isTriggered(tp.id)
          ? 'bg-red-900/40 border-red-700/60 text-red-300'
          : 'bg-eb-card border-eb-border text-slate-500'"
      >
        <i
          class="fas text-[10px]"
          :class="isTriggered(tp.id) ? 'fa-triangle-exclamation text-red-400' : 'fa-circle-check text-slate-600'"
          aria-hidden="true"
        ></i>
        {{ t(`tipping.${tp.id}.name`) }}
        <span v-if="isTriggered(tp.id)" class="text-red-500 font-bold">
          — {{ t('tipping.triggered_on', { year: triggeredYear(tp.id) }) }}
        </span>
      </span>
    </div>

    <!-- Journal -->
    <section aria-label="Journal des points de bascule">
      <div v-if="tpStore.triggeredList.length === 0" class="text-sm text-slate-500 italic py-8 text-center">
        {{ t('tipping.journal_empty') }}
      </div>

      <div v-else class="space-y-4">
        <EbCard
          v-for="tp in tpStore.triggeredList"
          :key="tp.id"
          class="border-red-700/40"
        >
          <div class="flex items-start gap-4">
            <!-- Icône -->
            <div class="shrink-0 w-10 h-10 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center mt-0.5" aria-hidden="true">
              <i class="fas fa-triangle-exclamation text-red-400"></i>
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0 space-y-3">
              <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 class="text-base font-bold text-white">{{ t(`tipping.${tp.id}.name`) }}</h2>
                <span class="text-xs text-red-400 font-semibold">{{ t('tipping.triggered_on', { year: tp.year }) }}</span>
              </div>

              <p class="text-sm text-slate-300 leading-relaxed">
                {{ t(`tipping.${tp.id}.description`) }}
              </p>

              <div class="bg-red-950/25 border border-red-800/35 rounded-lg px-3 py-2">
                <p class="text-xs font-semibold text-red-400 mb-0.5">{{ t('tipping.effects_label') }}</p>
                <p class="text-sm text-slate-200">{{ t(`tipping.${tp.id}.effects`) }}</p>
              </div>

              <blockquote class="border-l-2 border-slate-700 pl-3 text-xs text-slate-400 italic leading-relaxed">
                {{ t(`tipping.${tp.id}.quote`) }}
              </blockquote>
            </div>
          </div>
        </EbCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TIPPING_POINTS } from '@/data/tippingPoints'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import EbCard from '@/components/layout/EbCard.vue'

const { t } = useI18n()
const tpStore = useTippingPointsStore()

const allTps = TIPPING_POINTS

function isTriggered(id: string): boolean {
  return !!tpStore.triggered[id]
}

function triggeredYear(id: string): number {
  return tpStore.triggered[id]?.year ?? 0
}
</script>
