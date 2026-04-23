<template>
  <div>
    <div class="relative" :style="{ height: height + 'px' }">
      <canvas :id="canvasId" :aria-label="ariaLabel"></canvas>
    </div>
    <!-- HTML legend: status categories + threshold line -->
    <div class="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3" aria-hidden="true">
      <span class="flex items-center gap-1.5 text-xs text-red-400">
        <svg width="12" height="12" aria-hidden="true" class="shrink-0">
          <polygon points="6,0 12,12 0,12" fill="#ff5050"/>
        </svg>
        {{ t('limits.exceeded') }}
      </span>
      <span class="flex items-center gap-1.5 text-xs text-yellow-400">
        <svg width="10" height="10" aria-hidden="true" class="shrink-0">
          <rect x="0" y="0" width="10" height="10" fill="#facc15"/>
        </svg>
        {{ t('limits.risk_zone') }}
      </span>
      <span class="flex items-center gap-1.5 text-xs text-eb-green">
        <svg width="10" height="10" aria-hidden="true" class="shrink-0">
          <circle cx="5" cy="5" r="5" fill="#00ff88"/>
        </svg>
        {{ t('limits.safe') }}
      </span>
      <span class="flex items-center gap-1.5 text-xs text-slate-400">
        <svg width="24" height="6" aria-hidden="true" class="shrink-0">
          <line x1="0" y1="3" x2="24" y2="3" stroke="rgba(250,204,21,0.7)" stroke-width="1.5" stroke-dasharray="6 4" stroke-linecap="round"/>
        </svg>
        {{ t('limits.radar_threshold') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useI18n } from 'vue-i18n'

import type { LimitStatus } from '@/types/index'

Chart.register(...registerables)
import type { Chart as ChartType } from 'chart.js'

const props = withDefaults(defineProps<{
  canvasId:   string
  labels:     string[]
  values:     number[]
  statuses?:  LimitStatus[]
  height?:    number
  ariaLabel?: string
  maxValue?:  number
}>(), {
  height:    380,
  ariaLabel: 'Graphique radar des limites planétaires',
  maxValue:  2,
  statuses:  () => [],
})

const { t, locale } = useI18n()

let chart: ChartType | null = null

const STATUS_COLORS: Record<LimitStatus, string> = {
  depasse:          '#ff5050',
  zone_incertitude: '#facc15',
  safe:             '#00ff88',
}

const STATUS_SHAPES: Record<LimitStatus, string> = {
  depasse:          'triangle',
  zone_incertitude: 'rect',
  safe:             'circle',
}

function pointColors(): string[] {
  if (props.statuses.length) return props.statuses.map(s => STATUS_COLORS[s] ?? '#00ff88')
  return props.values.map(v => v > 1 ? '#ff5050' : '#00ff88')
}

function pointShapes(): string[] {
  if (props.statuses.length) return props.statuses.map(s => STATUS_SHAPES[s] ?? 'circle')
  return props.values.map(() => 'circle')
}

function initChart() {
  const ctx = (document.getElementById(props.canvasId) as HTMLCanvasElement | null)?.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label:                t('limits.radar_dataset'),
          data:                 props.values,
          borderColor:          '#00e5ff',
          backgroundColor:      'rgba(0,229,255,0.15)',
          pointBackgroundColor: pointColors(),
          pointBorderColor:     '#111827',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pointStyle:           pointShapes() as any,
          pointRadius:          6,
          pointHoverRadius:     8,
          borderWidth:          2,
        },
        {
          label:           t('limits.radar_threshold'),
          data:            new Array(props.labels.length).fill(1),
          borderColor:     'rgba(250,204,21,0.6)',
          backgroundColor: 'transparent',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          borderDash:      [6, 4] as any,
          pointRadius:     0,
          borderWidth:     1,
        },
      ],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      animation: { duration: 1200 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          borderColor:     '#1f2d3d',
          borderWidth:     1,
          titleColor:      '#e2e8f0',
          bodyColor:       '#94a3b8',
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex !== 0) return ''
              const i      = ctx.dataIndex
              const ratio  = ctx.parsed.r
              const status = props.statuses[i]
              const label  = status === 'depasse'
                ? t('limits.radar_exceeded')
                : status === 'zone_incertitude'
                  ? t('limits.risk_zone')
                  : t('limits.radar_at_limit')
              return `${label} — ${t('limits.radar_ratio')} : ×${ratio.toFixed(2)}`
            },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: props.maxValue,
          ticks: {
            stepSize:       0.5,
            color:          '#475569',
            backdropColor:  'transparent',
          },
          grid:        { color: '#1f2d3d' },
          angleLines:  { color: '#1f2d3d' },
          pointLabels: { color: '#94a3b8', font: { size: 10 } },
        },
      },
    },
  })
}

onMounted(initChart)

watch(locale, () => {
  chart?.destroy()
  chart = null
  nextTick(initChart)
})

watch(() => [props.values, props.statuses], () => {
  if (!chart) return
  chart.data.datasets[0].data = props.values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ds0 = chart.data.datasets[0] as any
  ds0.pointBackgroundColor = pointColors()
  ds0.pointStyle           = pointShapes()
  chart.update('active')
}, { deep: true })

onBeforeUnmount(() => chart?.destroy())
</script>
