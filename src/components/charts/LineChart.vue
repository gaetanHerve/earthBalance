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

const props = withDefaults(defineProps<{
  canvasId:   string
  labels:     (string | number)[]
  datasets:   ChartDataset[]
  height?:    number
  ariaLabel?: string
  yMin?:      number
  yMax?:      number
  showLegend?:boolean
}>(), {
  height: 180,
  ariaLabel: 'Graphique linéaire',
  showLegend: false,
})

let chart: ChartType | null = null

const GRID_COLOR = '#1f2d3d'

function buildDatasets() {
  return props.datasets.map((ds) => ({
    label:            ds.label,
    data:             ds.data,
    borderColor:      ds.borderColor,
    backgroundColor:  ds.backgroundColor ?? 'transparent',
    fill:             ds.fill ?? false,
    tension:          ds.tension ?? 0.4,
    pointRadius:      ds.pointRadius ?? 3,
    pointBackgroundColor: ds.borderColor,
    borderWidth:      2,
  }))
}

function initChart() {
  const ctx = (document.getElementById(props.canvasId) as HTMLCanvasElement | null)?.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: buildDatasets(),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: {
          display: props.showLegend,
          position: 'bottom',
          labels: { boxWidth: 10, padding: 8, color: '#94a3b8' },
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#1f2d3d',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
        },
      },
      scales: {
        x: { grid: { color: GRID_COLOR }, ticks: { color: '#64748b' } },
        y: {
          grid: { color: GRID_COLOR },
          ticks: { color: '#64748b' },
          beginAtZero: false,
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
  chart.data.labels = props.labels
  chart.data.datasets = buildDatasets()
  chart.update('active')
}, { deep: true })

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>
