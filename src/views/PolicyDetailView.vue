<template>
  <main class="max-w-screen-lg mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <!-- Breadcrumb / retour -->
    <div class="flex items-center gap-2 text-xs text-slate-500">
      <RouterLink to="/mitigation-policies" class="hover:text-eb-cyan transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none">
        <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>{{ t('policy_detail.back') }}
      </RouterLink>
      <span aria-hidden="true">/</span>
      <span class="text-slate-400 truncate">{{ policy?.title }}</span>
    </div>

    <!-- Politique introuvable -->
    <div v-if="!policy" class="text-center py-20 text-slate-500">
      <i class="fa fa-circle-xmark text-4xl mb-4 block opacity-30" aria-hidden="true"></i>
      <p class="text-lg font-semibold">{{ t('policy_detail.not_found') }}</p>
      <RouterLink to="/mitigation-policies" class="mt-4 inline-flex items-center gap-2 text-eb-cyan hover:underline">
        ← {{ t('policy_detail.back_to_list') }}
      </RouterLink>
    </div>

    <template v-else>

      <!-- ─── En-tête ─────────────────────────────────────────────────────── -->
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="font-mono text-slate-500">Session {{ policy.sessionId }} — Politique #{{ policy.number }}</span>
          <span
            class="px-2 py-0.5 rounded-full font-bold border"
            :class="statusStyle.class"
          >
            {{ statusStyle.label }}
          </span>
        </div>

        <h1 class="text-2xl md:text-3xl font-black text-white leading-tight">{{ policy.title }}</h1>

        <!-- Résumé -->
        <p v-if="detail?.summary" class="text-base text-slate-300 leading-relaxed max-w-3xl">
          {{ detail.summary }}
        </p>
      </div>

      <!-- ─── Référence GIEC ────────────────────────────────────────────── -->
      <section v-if="detail?.ipccReference" aria-labelledby="ipcc-ref-title">
        <SectionTitle id="ipcc-ref-title" :title="t('policy_detail.ipcc_ref_title')" icon="fa-book-open" color-class="text-eb-cyan" />
        <EbCard extra-class="border-eb-cyan/20">
          <div class="flex items-start gap-4">
            <div class="shrink-0 w-10 h-10 rounded-lg bg-eb-cyan/10 border border-eb-cyan/20 flex items-center justify-center">
              <i class="fa fa-landmark text-eb-cyan text-sm" aria-hidden="true"></i>
            </div>
            <div class="min-w-0 flex-1 space-y-3">
              <div>
                <div class="text-xs text-slate-500 uppercase tracking-widest font-bold mb-0.5">{{ t('policy_detail.report_label') }}</div>
                <div class="text-sm font-semibold text-slate-200">{{ detail.ipccReference.report }}</div>
              </div>
              <div>
                <div class="text-xs text-slate-500 uppercase tracking-widest font-bold mb-0.5">{{ t('policy_detail.section_label') }}</div>
                <div class="text-sm font-mono text-eb-cyan">{{ detail.ipccReference.section }}</div>
                <div class="text-sm text-slate-300 mt-0.5">{{ detail.ipccReference.sectionTitle }}</div>
              </div>
              <blockquote class="border-l-2 border-eb-cyan/40 pl-4 text-sm text-slate-400 italic leading-relaxed">
                "{{ detail.ipccReference.excerpt }}"
              </blockquote>
              <a
                :href="detail.ipccReference.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-xs text-eb-cyan hover:underline focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
              >
                <i class="fa fa-arrow-up-right-from-square" aria-hidden="true"></i>
                {{ t('policy_detail.read_report') }}
              </a>
            </div>
          </div>
        </EbCard>
      </section>

      <!-- ─── Description complète ─────────────────────────────────────── -->
      <section aria-labelledby="desc-title">
        <SectionTitle id="desc-title" :title="t('policy_detail.desc_title')" icon="fa-align-left" color-class="text-slate-300" />
        <EbCard>
          <div
            class="text-sm text-slate-300 leading-relaxed prose-sm"
            v-html="formattedDescription"
          ></div>
        </EbCard>
      </section>

      <!-- ─── Impact projeté ───────────────────────────────────────────── -->
      <section v-if="hasImpact" aria-labelledby="impact-title">
        <SectionTitle id="impact-title" :title="t('policy_detail.impact_title')" icon="fa-chart-bar" color-class="text-eb-green" />
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <EbCard
            v-for="item in impactItems"
            :key="item.key"
            extra-class="text-center !py-3 !px-4"
          >
            <div class="text-xs text-slate-500 mb-1">{{ item.label }}</div>
            <div class="text-xl font-black" :class="item.colorClass">{{ item.value }}</div>
          </EbCard>
        </div>
      </section>

      <!-- ─── Documentation ────────────────────────────────────────────── -->
      <section v-if="policy.resources?.length" aria-labelledby="resources-title">
        <SectionTitle id="resources-title" :title="t('policy_detail.resources_title')" icon="fa-link" color-class="text-slate-300" />
        <div class="space-y-3">
          <EbCard
            v-for="res in policy.resources"
            :key="res.url"
          >
            <a
              :href="res.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-start gap-3 focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
            >
              <i class="fa fa-arrow-up-right-from-square text-slate-500 group-hover:text-eb-cyan transition-colors mt-0.5 shrink-0 text-xs" aria-hidden="true"></i>
              <div>
                <div class="text-sm font-semibold text-eb-cyan group-hover:underline">{{ res.title }}</div>
                <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ res.excerpt }}</p>
              </div>
            </a>
          </EbCard>
        </div>
      </section>

      <!-- ─── Scénarios prospectifs ─────────────────────────────────────── -->
      <section v-if="hasNarratives" aria-labelledby="prospective-title">
        <SectionTitle id="prospective-title" :title="t('policy_detail.prospective')" icon="fa-chart-line" color-class="text-eb-green" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EbCard
            v-for="(scenario, key) in policy.prospectiveNarratives"
            :key="key"
            :extra-class="'border ' + scenario.borderClass"
          >
            <div class="text-xs font-bold uppercase tracking-widest mb-2" :class="scenario.colorClass">
              <i :class="['fa', scenarioIcon(key as string), 'mr-1']" aria-hidden="true"></i>
              {{ scenario.label }} — {{ scenario.horizon }}
            </div>
            <p class="text-sm text-slate-400 leading-relaxed" v-html="formatText(scenario.text)"></p>
          </EbCard>
        </div>
      </section>

    </template>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { policyDetails } from '@/data/policyDetails'
import SectionTitle from '@/components/layout/SectionTitle.vue'
import EbCard       from '@/components/layout/EbCard.vue'

const { t } = useI18n()
const route = useRoute()
const store = useMitigationPoliciesStore()

const id     = computed(() => route.params.id as string)
const policy = computed(() => store.getMitigationPolicy(id.value))
const detail = computed(() => policyDetails[id.value] ?? null)

const statusStyle = computed(() => {
  switch (policy.value?.status) {
    case 'validated': return { label: t('status.validated'), class: 'text-eb-green border-eb-green/40 bg-eb-green/10' }
    case 'active':    return { label: t('status.active'),    class: 'text-eb-cyan border-eb-cyan/40 bg-eb-cyan/10'   }
    case 'rejected':  return { label: t('status.rejected'),  class: 'text-red-400 border-red-400/40 bg-red-500/10'   }
    case 'expired':   return { label: t('status.expired'),   class: 'text-slate-400 border-slate-600 bg-slate-800'   }
    default:          return { label: '',                     class: ''                                                }
  }
})

const hasImpact = computed(() =>
  policy.value?.projectedImpact && Object.keys(policy.value.projectedImpact).length > 0
)

const hasNarratives = computed(() =>
  policy.value?.prospectiveNarratives && Object.keys(policy.value.prospectiveNarratives).length > 0
)

const impactItems = computed(() => {
  const impact = policy.value?.projectedImpact ?? {}
  const items = []
  if (impact['emissionsReductionGtCO2yr'])
    items.push({ key: 'co2',  label: t('policy_detail.impact_co2'),  value: `−${impact['emissionsReductionGtCO2yr']} GtCO₂/an`, colorClass: 'text-eb-green' })
  if (impact['tempReductionC2100'])
    items.push({ key: 'temp', label: t('policy_detail.impact_temp'), value: `−${impact['tempReductionC2100']}°C`,               colorClass: 'text-eb-cyan' })
  if (impact['fullEffectYear'])
    items.push({ key: 'year', label: t('policy_detail.impact_year'), value: String(impact['fullEffectYear']),                    colorClass: 'text-yellow-400' })
  if (impact['co2ReductionPct'])
    items.push({ key: 'pct',  label: t('policy_detail.impact_pct'),  value: `−${impact['co2ReductionPct']}%`,                   colorClass: 'text-eb-green' })
  if (impact['renewableShareIn2034'])
    items.push({ key: 'ren',  label: t('policy_detail.impact_ren'),  value: `${impact['renewableShareIn2034']}%`,                colorClass: 'text-eb-cyan' })
  return items
})

const formattedDescription = computed(() =>
  (policy.value?.description ?? '').replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200">$1</strong>').replace(/\n/g, '<br>')
)

function scenarioIcon(key: string): string {
  return ({ optimistic: 'fa-plus-circle', moderate: 'fa-chart-line', pessimistic: 'fa-minus-circle' } as Record<string, string>)[key] ?? 'fa-circle'
}

function formatText(text: string | undefined): string {
  return text?.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200">$1</strong>') ?? ''
}
</script>
