<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <!-- Dernière politique adoptée -->
    <div
      v-if="lastValidated"
      class="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-eb-green/30 bg-eb-green/5"
    >
      <div class="flex items-center gap-2 shrink-0">
        <i class="fa fa-circle-check text-eb-green text-sm" aria-hidden="true"></i>
        <span class="text-xs font-semibold text-eb-green uppercase tracking-wide">{{ t('policies.last_adopted_label') }}</span>
        <span class="text-[10px] text-slate-500 font-mono">· {{ t('policies.last_adopted_year', { year: lastValidated.year }) }}</span>
      </div>

      <div class="flex flex-wrap items-center gap-3 min-w-0">
        <span class="text-xs text-slate-500 font-mono shrink-0">{{ lastValidated.policy.number }}</span>
        <span class="text-sm font-bold text-white truncate">{{ lastValidated.policy.title }}</span>
      </div>

      <div class="flex flex-wrap items-center gap-2 ml-auto">
        <span
          v-if="lastValidated.policy.projectedImpact?.['emissionsReductionGtCO2yr']"
          class="text-[10px] bg-eb-dark border border-eb-border rounded px-2 py-0.5 text-eb-green font-bold"
        >
          −{{ lastValidated.policy.projectedImpact['emissionsReductionGtCO2yr'] }} Gt/an
        </span>
        <span
          v-if="lastValidated.policy.projectedImpact?.['tempReductionC2100']"
          class="text-[10px] bg-eb-dark border border-eb-border rounded px-2 py-0.5 text-eb-cyan font-bold"
        >
          −{{ lastValidated.policy.projectedImpact['tempReductionC2100'] }}°C {{ t('policies.in_2100') }}
        </span>
        <RouterLink
          :to="`/mitigation-policies/${lastValidated.policy.id}`"
          class="text-[10px] text-slate-500 hover:text-eb-cyan transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
        >
          <i class="fa fa-circle-info mr-1" aria-hidden="true"></i>{{ t('policies.detail_link') }}
        </RouterLink>
      </div>
    </div>

    <!-- Personnalisation des widgets -->
    <WidgetCustomizer :visible="visibleWidgets" @toggle="toggleWidget" />

    <!-- Indicateurs Écologiques -->
    <EcologicalIndicators
      v-if="ecologicalCharts"
      :eco="ecologicalCharts"
      :visible-widgets="visibleWidgets"
    />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <ChartSkeleton v-for="i in 5" :key="i"
        :class="i === 1 ? 'col-span-1 md:col-span-2' : ''"
        :height="220"
      />
    </div>

    <!-- Indicateurs Sociétaux -->
    <SocietalIndicators
      v-if="societalIndicators"
      :soc="societalIndicators"
    />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartSkeleton v-for="i in 4" :key="i" :height="180" />
    </div>

  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useDashboardStore }          from '@/store/dashboard.store'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { useLocalizedPolicies }       from '@/composables/useLocalizedPolicies'

import WidgetCustomizer     from '@/components/dashboard/WidgetCustomizer.vue'
import EcologicalIndicators from '@/components/dashboard/EcologicalIndicators.vue'
import SocietalIndicators   from '@/components/dashboard/SocietalIndicators.vue'
import ChartSkeleton        from '@/components/charts/ChartSkeleton.vue'

const { t } = useI18n()
const { localizedPolicy } = useLocalizedPolicies()
const dashStore               = useDashboardStore()
const mitigationPoliciesStore = useMitigationPoliciesStore()

const { ecologicalCharts, societalIndicators, visibleWidgets } = storeToRefs(dashStore)
const { validatedPolicyMeta } = storeToRefs(mitigationPoliciesStore)
const { getMitigationPolicy } = mitigationPoliciesStore

const lastValidated = computed(() => {
  const meta = validatedPolicyMeta.value.at(-1)
  if (!meta) return null
  const policy = getMitigationPolicy(meta.id)
  return policy ? { policy: localizedPolicy(policy), year: meta.year } : null
})

onMounted(() => dashStore.fetchAll())

function toggleWidget(id: string): void {
  dashStore.toggleWidget(id)
}
</script>
