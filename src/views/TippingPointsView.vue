<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-black text-white mb-1">{{ t('tipping.page_title') }}</h1>
      <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">{{ t('tipping.page_subtitle') }}</p>
    </div>

    <!-- Avertissement bascules désactivées -->
    <div
      v-if="!tpStore.enabled"
      class="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-600/40 bg-amber-900/15"
      role="status"
    >
      <i class="fa fa-toggle-off text-amber-400 mt-0.5 shrink-0" aria-hidden="true"></i>
      <p class="text-sm text-amber-300">{{ t('tipping.disabled_notice') }}</p>
    </div>

    <!-- Catalogue de tous les points de bascule -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <EbCard
        v-for="tp in sortedTps"
        :key="tp.id"
        :class="isTriggered(tp.id)
          ? 'border-red-700/50 bg-red-950/10'
          : 'border-eb-border'"
      >
        <div class="flex items-start gap-4">

          <!-- Icône statut -->
          <div
            class="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center mt-0.5"
            :class="isTriggered(tp.id)
              ? 'bg-red-900/40 border-red-700/50'
              : 'bg-eb-dark border-eb-border'"
            aria-hidden="true"
          >
            <i
              class="fas"
              :class="isTriggered(tp.id)
                ? 'fa-triangle-exclamation text-red-400'
                : 'fa-shield-halved text-slate-600'"
            ></i>
          </div>

          <div class="flex-1 min-w-0 space-y-3">

            <!-- Nom + badge état -->
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 class="text-base font-bold" :class="isTriggered(tp.id) ? 'text-red-200' : 'text-slate-200'">
                {{ t(`tipping.${tp.id}.name`) }}
              </h2>
              <span
                class="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                :class="isTriggered(tp.id)
                  ? 'bg-red-900/40 border-red-700/60 text-red-300'
                  : 'bg-eb-card border-eb-border text-slate-500'"
              >
                <i
                  class="fas mr-1 text-[9px]"
                  :class="isTriggered(tp.id) ? 'fa-triangle-exclamation' : 'fa-circle-check'"
                  aria-hidden="true"
                ></i>
                {{ isTriggered(tp.id)
                  ? t('tipping.triggered_on', { year: triggeredYear(tp.id) })
                  : t('tipping.trigger_not_reached') }}
              </span>
            </div>

            <!-- Seuil de déclenchement -->
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-500">{{ t('tipping.trigger_label') }} :</span>
              <span
                class="font-mono px-2 py-0.5 rounded border text-[11px]"
                :class="isTriggered(tp.id)
                  ? 'bg-red-900/20 border-red-800/40 text-red-300'
                  : 'bg-eb-dark border-eb-border text-slate-300'"
              >
                {{ thresholdLabel(tp) }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-sm leading-relaxed" :class="isTriggered(tp.id) ? 'text-slate-300' : 'text-slate-400'">
              {{ t(`tipping.${tp.id}.description`) }}
            </p>

            <!-- Effets permanents -->
            <div
              class="rounded-lg px-3 py-2 border"
              :class="isTriggered(tp.id)
                ? 'bg-red-950/25 border-red-800/35'
                : 'bg-eb-dark/60 border-eb-border/60'"
            >
              <p
                class="text-xs font-semibold mb-0.5"
                :class="isTriggered(tp.id) ? 'text-red-400' : 'text-slate-500'"
              >
                {{ t('tipping.effects_label') }}
              </p>
              <p class="text-sm" :class="isTriggered(tp.id) ? 'text-slate-200' : 'text-slate-400'">
                {{ t(`tipping.${tp.id}.effects`) }}
              </p>
            </div>

            <!-- Citation GIEC -->
            <blockquote class="border-l-2 border-slate-700 pl-3 text-xs text-slate-500 italic leading-relaxed">
              {{ t(`tipping.${tp.id}.quote`) }}
            </blockquote>

          </div>
        </div>
      </EbCard>
    </div>

  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TIPPING_POINTS, type TippingPointDef } from '@/data/tippingPoints'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import EbCard from '@/components/layout/EbCard.vue'

const { t } = useI18n()
const tpStore = useTippingPointsStore()

function isTriggered(id: string): boolean {
  return !!tpStore.triggered[id]
}

function triggeredYear(id: string): number {
  return tpStore.triggered[id]?.year ?? 0
}

function thresholdLabel(tp: TippingPointDef): string {
  const { variable, threshold, comparison } = tp.trigger
  if (variable === 'temp') {
    const op = comparison === '>' ? '>' : '<'
    return `${op} +${threshold}°C ${t('tipping.trigger_unit_temp')}`
  }
  const op = comparison === '<' ? '<' : '>'
  return `${op} ${threshold} % ${t('tipping.trigger_unit_forest')}`
}

// Triés : déclenchés en premier (ordre chronologique), puis non déclenchés
const sortedTps = computed(() =>
  [...TIPPING_POINTS].sort((a, b) => {
    const aYear = tpStore.triggered[a.id]?.year
    const bYear = tpStore.triggered[b.id]?.year
    if (aYear !== undefined && bYear !== undefined) return aYear - bYear
    if (aYear !== undefined) return -1
    if (bYear !== undefined) return 1
    return 0
  })
)
</script>
