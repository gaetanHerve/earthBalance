<template>
  <section aria-labelledby="societal-title">
    <SectionTitle
      id="societal-title"
      :title="t('dashboard.soc_title')"
      icon="fa-globe"
      color-class="text-eb-cyan"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">

      <!-- Sécurité alimentaire -->
      <EbCard extra-class="flex flex-col items-center">
        <div class="text-xs font-bold text-slate-400 mb-2 text-center">
          <i class="fa fa-wheat-awn text-yellow-500 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.food_title') }}
        </div>
        <GaugeChart
          canvas-id="foodGauge"
          :value="soc.foodSecurity.current"
          track-color="#facc15"
          :size="110"
          :font-size="22"
          :aria-label="t('dashboard.food_aria', { value: soc.foodSecurity.current })"
        >
          <span class="text-xl font-black text-yellow-400">{{ soc.foodSecurity.current }}</span>
          <span class="text-xs text-slate-500">/100</span>
        </GaugeChart>
        <div class="mt-2 text-xs text-slate-500">{{ t('dashboard.food_note') }}</div>
      </EbCard>

      <!-- Accès eau potable -->
      <EbCard extra-class="flex flex-col items-center">
        <div class="text-xs font-bold text-slate-400 mb-2 text-center">
          <i class="fa fa-droplet text-blue-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.water_title') }}
        </div>
        <GaugeChart
          canvas-id="waterGauge"
          :value="soc.waterAccess.current"
          track-color="#38bdf8"
          :size="110"
          :font-size="22"
          :aria-label="t('dashboard.water_aria', { value: soc.waterAccess.current })"
        >
          <span class="text-xl font-black text-blue-400">{{ soc.waterAccess.current }}</span>
          <span class="text-xs text-slate-500">%</span>
        </GaugeChart>
        <div class="mt-2 text-xs text-slate-500">{{ t('dashboard.water_note') }}</div>
      </EbCard>

      <!-- Conflits géopolitiques -->
      <EbCard>
        <div class="text-xs font-bold text-slate-400 mb-3">
          <i class="fa fa-shield-halved text-red-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.conflicts_title') }}
        </div>
        <div class="space-y-2">
          <div
            v-for="indicator in soc.geopoliticalConflicts.subIndicators"
            :key="indicator.label"
          >
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-400">{{ indicator.label }}</span>
              <span class="font-bold" :style="{ color: indicator.color }">{{ indicator.value }}/100</span>
            </div>
            <div
              class="bg-eb-border rounded-full h-3 overflow-hidden"
              role="progressbar"
              :aria-label="indicator.label"
              :aria-valuenow="indicator.value"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="h-full rounded-full"
                :style="{ width: indicator.value + '%', backgroundColor: indicator.color }"
              ></div>
            </div>
          </div>
        </div>
      </EbCard>

      <!-- Santé globale -->
      <EbCard>
        <div class="text-xs font-bold text-slate-400 mb-3">
          <i class="fa fa-heart-pulse text-pink-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.health_title') }}
        </div>
        <div class="space-y-2">
          <div
            v-for="stat in soc.globalHealth.stats"
            :key="stat.label"
            class="flex items-center justify-between bg-eb-mid rounded-lg px-3 py-2 border border-eb-border"
          >
            <span class="text-xs text-slate-400">{{ stat.label }}</span>
            <span class="font-bold text-sm" :style="{ color: stat.color }">{{ stat.value }}</span>
          </div>
        </div>
      </EbCard>

      <!-- Inégalités (Gini) -->
      <EbCard>
        <div class="text-xs font-bold text-slate-400 mb-3">
          <i class="fa fa-scale-balanced text-purple-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.inequality_title') }}
        </div>
        <div class="space-y-2">
          <div
            v-for="stat in soc.inequality.stats"
            :key="stat.label"
            class="flex items-center justify-between bg-eb-mid rounded-lg px-3 py-2 border border-eb-border"
          >
            <span class="text-xs text-slate-400">{{ stat.label }}</span>
            <span class="font-bold text-sm" :style="{ color: stat.color }">{{ stat.value }}</span>
          </div>
        </div>
      </EbCard>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/layout/SectionTitle.vue'
import EbCard from '@/components/layout/EbCard.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'

import type { SocietalIndicators } from '@/types/index'

const { t } = useI18n()

defineProps<{ soc: SocietalIndicators }>()
</script>
