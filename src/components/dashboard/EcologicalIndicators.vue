<template>
  <section aria-labelledby="ecological-title">
    <SectionTitle
      id="ecological-title"
      :title="t('dashboard.eco_title')"
      icon="fa-leaf"
      color-class="text-eb-green"
    />

    <!-- Toggle global vue résumé / projections -->
    <fieldset class="flex items-center gap-2 mb-4 border-0 p-0 m-0">
      <legend class="text-xs text-slate-500 float-left mr-2">{{ t('dashboard.global_toggle_label') }}</legend>
      <button
        :class="['text-xs px-3 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none',
          summaryMode ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan' : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200']"
        :aria-pressed="summaryMode"
        @click="summaryMode = true"
      >{{ t('dashboard.global_toggle_summary') }}</button>
      <button
        :class="['text-xs px-3 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none',
          !summaryMode ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan' : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200']"
        :aria-pressed="!summaryMode"
        @click="summaryMode = false"
      >{{ t('dashboard.global_toggle_detail') }}</button>
    </fieldset>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:grid-flow-dense gap-4">
      <Co2Widget        v-if="isVisible('co2')"         :series="eco.co2"         :summary-mode="summaryMode" />
      <ForestWidget     v-if="isVisible('forest')"      :series="eco.forest"      :summary-mode="summaryMode" />
      <EnergyMixWidget  v-if="isVisible('energyMix')"   :series="eco.energyMix"   :summary-mode="summaryMode" />
      <TemperatureWidget v-if="isVisible('temperature')" :series="eco.temperature" :summary-mode="summaryMode" />
      <SeaLevelWidget   v-if="isVisible('seaLevel')"    :series="eco.seaLevel"    :summary-mode="summaryMode" />
      <ExtremesWidget   v-if="isVisible('extremes')"    :series="eco.extremes"    :summary-mode="summaryMode" />
      <ResourcesWidget  v-if="isVisible('resources')"   :series="eco.resources"   :summary-mode="summaryMode" />

      <!-- Citations GIEC — remplissent les cases vides à xl -->
      <IpccQuoteCard
        v-for="quote in displayedQuotes"
        :key="quote.id"
        :quote="quote"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/layout/SectionTitle.vue'
import IpccQuoteCard from '@/components/dashboard/IpccQuoteCard.vue'
import Co2Widget        from '@/components/dashboard/widgets/Co2Widget.vue'
import TemperatureWidget from '@/components/dashboard/widgets/TemperatureWidget.vue'
import ForestWidget     from '@/components/dashboard/widgets/ForestWidget.vue'
import SeaLevelWidget   from '@/components/dashboard/widgets/SeaLevelWidget.vue'
import ExtremesWidget   from '@/components/dashboard/widgets/ExtremesWidget.vue'
import EnergyMixWidget  from '@/components/dashboard/widgets/EnergyMixWidget.vue'
import ResourcesWidget  from '@/components/dashboard/widgets/ResourcesWidget.vue'
import { ipccQuotes } from '@/data/ipccQuotes'
import type { EcologicalCharts } from '@/types/index'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  eco:             EcologicalCharts
  visibleWidgets?: string[]
}>(), { visibleWidgets: () => [] })

const summaryMode = ref(true)

const _shuffled = [...ipccQuotes]
for (let i = _shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[_shuffled[i], _shuffled[j]] = [_shuffled[j], _shuffled[i]]
}
const shuffledQuotes = _shuffled

const WIDGET_IDS = ['co2', 'temperature', 'forest', 'seaLevel', 'extremes', 'energyMix', 'resources']

function isVisible(id: string): boolean {
  return props.visibleWidgets.includes(id)
}

const emptySlots = computed(() => {
  const visibleCount = WIDGET_IDS.filter(id => props.visibleWidgets.includes(id)).length
  const cols = summaryMode.value ? 1 : 2
  const total = visibleCount * cols
  const rem = total % 4
  return rem === 0 ? 0 : 4 - rem
})

const displayedQuotes = computed(() => shuffledQuotes.slice(0, emptySlots.value))
</script>
