<template>
  <div class="rounded-xl border border-eb-border bg-eb-card p-5 space-y-5"
       style="border-left: 2px solid rgba(251,146,60,0.5);">

    <!-- En-tête -->
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="fa fa-bolt text-orange-400" aria-hidden="true"></i>
          {{ t('dashboard.extremes_section') }}
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">{{ t('dashboard.extremes_subtitle') }}</p>
      </div>
      <span class="text-[10px] font-mono text-slate-600 shrink-0 mt-0.5">{{ t('dashboard.extremes_ref') }}</span>
    </div>

    <!-- 3 métriques clés -->
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="m in metrics"
        :key="m.valueKey"
        class="flex flex-col gap-1 rounded-lg border border-eb-border bg-eb-mid/60 px-3 py-2.5"
      >
        <span class="text-xl font-black text-orange-400 tabular-nums leading-none">
          {{ t(m.valueKey) }}
        </span>
        <span class="text-[10px] text-slate-400 leading-snug">{{ t(m.labelKey) }}</span>
      </div>
    </div>

    <!-- Indicateur de tendance visuel -->
    <div class="rounded-lg border border-orange-500/20 bg-orange-950/20 px-4 py-3 flex items-start gap-3"
         role="status" aria-live="polite">
      <div class="shrink-0 mt-0.5">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <polygon points="10,2 18,16 2,16" fill="#fb923c" opacity="0.9"/>
          <rect x="9" y="9" width="2" height="4" fill="#0a0f1e"/>
          <rect x="9" y="14.5" width="2" height="2" fill="#0a0f1e"/>
        </svg>
      </div>
      <p class="text-xs text-orange-200/80 leading-relaxed">{{ t('dashboard.extremes_trend') }}</p>
    </div>

    <!-- Exposition mondiale -->
    <p class="text-xs text-slate-400 leading-relaxed border-t border-eb-border pt-4">
      <i class="fa fa-earth-europe text-orange-400/70 mr-1.5" aria-hidden="true"></i>
      {{ t('dashboard.extremes_exposure') }}
    </p>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const metrics = [
  { valueKey: 'dashboard.extremes_m1_value', labelKey: 'dashboard.extremes_m1_label' },
  { valueKey: 'dashboard.extremes_m2_value', labelKey: 'dashboard.extremes_m2_label' },
  { valueKey: 'dashboard.extremes_m3_value', labelKey: 'dashboard.extremes_m3_label' },
]
</script>
