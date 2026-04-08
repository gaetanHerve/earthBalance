<template>
  <div class="relative" :style="{ height: height + 'px' }">
    <canvas :id="canvasId" :aria-label="ariaLabel" role="img"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

import type { Chart as ChartType } from 'chart.js'

const props = withDefaults(defineProps<{
  canvasId:   string
  labels:     string[]
  values:     number[]
  colors:     string[]
  height?:    number
  ariaLabel?: string
  yMax?:      number
  horizontal?:boolean
}>(), {
  height: 180,
  ariaLabel: 'Graphique en barres',
  horizontal: false,
})

let chart: ChartType | null = null

const GRID_COLOR = '#1f2d3d'

function initChart() {
  const ctx = (document.getElementById(props.canvasId) as HTMLCanvasElement | null)?.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [{
        label: '',
        data: props.values,
        backgroundColor: props.colors,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: props.horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#1f2d3d',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
        },
      },
      scales: {
        x: {
          grid: { display: !props.horizontal, color: GRID_COLOR },
          ticks: { color: '#64748b', font: { size: 9 } },
        },
        y: {
          grid: { color: GRID_COLOR },
          ticks: { color: '#64748b' },
          beginAtZero: true,
          ...(props.yMax !== undefined && { max: props.yMax }),
        },
      },
    },
  })
}

onMounted(initChart)

watch(() => [props.labels, props.values], () => {
  if (!chart) return
  chart.data.labels = props.labels
  chart.data.datasets[0].data = props.values
  chart.update('active')
}, { deep: true })

onBeforeUnmount(() => chart?.destroy())
</script>
