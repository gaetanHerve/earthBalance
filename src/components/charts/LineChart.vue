<template>
  <div>
    <div class="chart-container relative" :style="{ height: height + 'px' }">
      <canvas :id="canvasId" :aria-label="ariaLabel"></canvas>
    </div>
    <div
      v-if="legendVisible"
      class="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2"
      aria-hidden="true"
    >
      <span
        v-for="(item, i) in resolvedLegendItems"
        :key="i"
        class="flex items-center gap-1.5 text-xs text-slate-400"
      >
        <svg width="20" height="8" aria-hidden="true" class="shrink-0">
          <line x1="0" y1="4" x2="20" y2="4" :stroke="item.color" stroke-width="2"/>
          <circle
            v-if="item.pointStyle === 'circle'"
            cx="10" cy="4" r="3"
            :fill="item.color"
          />
          <polygon
            v-else-if="item.pointStyle === 'triangle'"
            points="10,1 13.5,7 6.5,7"
            :fill="item.color"
          />
          <rect
            v-else-if="item.pointStyle === 'rect'"
            x="7" y="1" width="6" height="6"
            :fill="item.color"
          />
          <rect
            v-else-if="item.pointStyle === 'rectRot'"
            x="7" y="1" width="6" height="6"
            :fill="item.color"
            transform="rotate(45 10 4)"
          />
          <polygon
            v-else-if="item.pointStyle === 'star'"
            points="10,0.5 11.5,3.5 14.5,3.5 12,5.5 13,8 10,6 7,8 8,5.5 5.5,3.5 8.5,3.5"
            :fill="item.color"
          />
          <g v-else-if="item.pointStyle === 'cross'">
            <line x1="7"  y1="4" x2="13" y2="4" :stroke="item.color" stroke-width="2"/>
            <line x1="10" y1="1" x2="10" y2="7" :stroke="item.color" stroke-width="2"/>
          </g>
          <g v-else-if="item.pointStyle === 'crossRot'">
            <line x1="7"  y1="1" x2="13" y2="7" :stroke="item.color" stroke-width="2"/>
            <line x1="13" y1="1" x2="7"  y2="7" :stroke="item.color" stroke-width="2"/>
          </g>
          <rect
            v-else-if="item.pointStyle === 'rectRounded'"
            x="7" y="1" width="6" height="6" rx="2"
            :fill="item.color"
          />
          <line
            v-else-if="item.pointStyle === 'dash'"
            x1="6" y1="4" x2="14" y2="4"
            :stroke="item.color" stroke-width="3"
          />
          <!-- fallback -->
          <circle v-else cx="10" cy="4" r="3" :fill="item.color"/>
        </svg>
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

import type { ChartDataset } from '@/types/index'
import type { Chart as ChartType } from 'chart.js'

const POINT_STYLES = [
  'circle', 'triangle', 'rect', 'rectRot', 'star', 'cross', 'crossRot', 'rectRounded', 'dash',
] as const

const props = withDefaults(defineProps<{
  canvasId:    string
  labels:      (string | number)[]
  datasets:    ChartDataset[]
  height?:     number
  ariaLabel?:  string
  yMin?:       number
  yMax?:       number
  showLegend?: boolean | 'auto'
}>(), {
  height:     180,
  ariaLabel:  'Graphique linéaire',
  showLegend: 'auto',
})

let chart: ChartType | null = null

const GRID_COLOR = '#1f2d3d'

const legendVisible = computed<boolean>(() => {
  if (props.showLegend === true)  return true
  if (props.showLegend === false) return false
  return props.datasets.length > 1
})

const resolvedLegendItems = computed(() =>
  props.datasets.map((ds, i) => ({
    label:      ds.label,
    color:      ds.borderColor as string,
    pointStyle: ds.pointStyle ?? POINT_STYLES[i % POINT_STYLES.length],
  }))
)

function buildDatasets() {
  return props.datasets.map((ds, index: number) => ({
    label:                ds.label,
    data:                 ds.data,
    borderColor:          ds.borderColor,
    backgroundColor:      ds.backgroundColor ?? 'transparent',
    fill:                 ds.fill ?? false,
    tension:              ds.tension ?? 0.4,
    pointRadius:          ds.pointRadius ?? 3,
    pointHoverRadius:     (ds.pointRadius ?? 3) + 2,
    pointStyle:           ds.pointStyle ?? POINT_STYLES[index % POINT_STYLES.length],
    pointBackgroundColor: ds.borderColor,
    borderDash:           ds.borderDash,
    borderWidth:          2,
  }))
}

function initChart() {
  const ctx = (document.getElementById(props.canvasId) as HTMLCanvasElement | null)?.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels:   props.labels,
      datasets: buildDatasets(),
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          borderColor:     '#1f2d3d',
          borderWidth:     1,
          titleColor:      '#e2e8f0',
          bodyColor:       '#94a3b8',
          usePointStyle:   true,
        },
      },
      scales: {
        x: { grid: { color: GRID_COLOR }, ticks: { color: '#64748b' } },
        y: {
          grid:         { color: GRID_COLOR },
          ticks:        { color: '#64748b' },
          beginAtZero:  false,
          ...(props.yMin !== undefined && { min: props.yMin }),
          ...(props.yMax !== undefined && { max: props.yMax }),
        },
      },
    },
  })
}

onMounted(initChart)

watch(() => [props.labels, props.datasets], () => {
  if (!chart) return
  chart.data.labels   = props.labels
  chart.data.datasets = buildDatasets()
  chart.update('active')
}, { deep: true })

onBeforeUnmount(() => { chart?.destroy() })
</script>
