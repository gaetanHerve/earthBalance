<template>
  <div class="chart-container relative" :style="{ height: height + 'px' }">
    <canvas :id="canvasId" :aria-label="ariaLabel" role="img"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

import type { ChartDataset } from '@/types/index'
import type { Chart as ChartType } from 'chart.js'

// Formes distinctes assignées automatiquement par dataset (RGAA — pas uniquement la couleur)
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

function shouldShowLegend(): boolean {
  if (props.showLegend === true)  return true
  if (props.showLegend === false) return false
  return props.datasets.length > 1
}

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
        legend: {
          display:  shouldShowLegend(),
          position: 'bottom',
          labels: {
            color:           '#94a3b8',
            usePointStyle:   true,
          },
        },
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
