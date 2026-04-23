<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">
    <!-- Intro + légende statuts -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white mb-1">{{ t('limits.title') }}</h1>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">{{ t('limits.intro') }}</p>
      </div>
      <div class="flex gap-3 text-xs shrink-0">
        <span class="flex items-center gap-1.5 bg-red-900/30 text-red-400 border border-red-700/30 px-2 py-1 rounded-full">
          <svg width="10" height="10" aria-hidden="true" class="shrink-0">
            <polygon points="5,0 10,10 0,10" fill="#ff5050"/>
          </svg>
          {{ t('limits.exceeded') }} ({{ limitsByStatus.depasse.length }})
        </span>
        <span class="flex items-center gap-1.5 bg-yellow-900/30 text-yellow-400 border border-yellow-700/30 px-2 py-1 rounded-full">
          <svg width="9" height="9" aria-hidden="true" class="shrink-0">
            <rect x="0" y="0" width="9" height="9" fill="#facc15"/>
          </svg>
          {{ t('limits.risk_zone') }} ({{ limitsByStatus.zone_incertitude.length }})
        </span>
        <span class="flex items-center gap-1.5 bg-green-900/30 text-eb-green border border-green-700/30 px-2 py-1 rounded-full">
          <svg width="9" height="9" aria-hidden="true" class="shrink-0">
            <circle cx="4.5" cy="4.5" r="4.5" fill="#00ff88"/>
          </svg>
          {{ t('limits.safe') }} ({{ limitsByStatus.safe.length }})
        </span>
      </div>
    </div>

    <!-- Graphique radar global -->
    <section aria-labelledby="radar-title">
      <SectionTitle id="radar-title" :title="t('limits.radar_title')" icon="fa-circle-nodes" color-class="text-eb-cyan" />
      <EbCard>
        <RadarChart
          v-if="radarData"
          canvas-id="globalRadar"
          :labels="localizedRadarLabels"
          :values="radarData.values"
          :statuses="limitStatuses"
          :height="420"
          :aria-label="t('limits.radar_aria')"
        />
        <ChartSkeleton v-else :height="420" :label="t('limits.loading_radar')" />
        <p class="text-xs text-slate-500 text-center mt-2">{{ t('limits.radar_note') }}</p>
      </EbCard>
    </section>

    <!-- 9 fiches individuelles -->
    <section aria-labelledby="limits-grid-title">
      <SectionTitle id="limits-grid-title" :title="t('limits.cards_title')" icon="fa-table-cells" color-class="text-eb-green" />

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <template v-if="loading">
          <output
            v-for="i in 9"
            :key="i"
            class="rounded-xl bg-eb-border/30 animate-pulse"
            style="height: 220px"
            aria-live="polite"
            :aria-label="t('limits.loading_card')"
          ></output>
        </template>
        <template v-else>
          <PlanetaryLimitCard
            v-for="limit in limits"
            :key="limit.id"
            :limit="limit"
          />
        </template>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { usePlanetsStore } from '@/store/planets.store'

import SectionTitle       from '@/components/layout/SectionTitle.vue'
import EbCard             from '@/components/layout/EbCard.vue'
import RadarChart         from '@/components/charts/RadarChart.vue'
import ChartSkeleton      from '@/components/charts/ChartSkeleton.vue'
import PlanetaryLimitCard from '@/components/limits/PlanetaryLimitCard.vue'

const { t, locale } = useI18n()
const store = usePlanetsStore()
const { limits, radarData, loading, limitsByStatus } = storeToRefs(store)

type LimitStatus = 'safe' | 'zone_incertitude' | 'depasse'

const isLimitStatus = (status: string): status is LimitStatus =>
  status === 'safe' || status === 'zone_incertitude' || status === 'depasse'

const localizedRadarLabels = computed<string[]>(() =>
  limits.value.map((l: { name: string; nameEn: string }) => locale.value === 'en' ? l.nameEn : l.name)
)

const limitStatuses = computed<LimitStatus[]>(() =>
  limits.value
    .map((l: { status: string }) => l.status)
    .filter(isLimitStatus)
)

onMounted(() => store.fetchAll())
</script>
