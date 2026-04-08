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
  height?:    number
  ariaLabel?: string
  maxValue?:  number
}>(), {
  height: 380,
  ariaLabel: 'Graphique radar des limites planétaires',
  maxValue: 2,
})

let chart: ChartType | null = null

function initChart() {
  const ctx = (document.getElementById(props.canvasId) as HTMLCanvasElement | null)?.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'État actuel (ratio seuil)',
          data: props.values,
          borderColor: '#00e5ff',
          backgroundColor: 'rgba(0,229,255,0.15)',
          pointBackgroundColor: props.values.map((v) => v > 1 ? '#ff5050' : '#00ff88'),
          pointBorderColor: '#111827',
          pointRadius: 5,
          borderWidth: 2,
        },
        {
          // Ligne de seuil critique (ratio = 1)
          label: 'Seuil critique',
          data: new Array(props.labels.length).fill(1),
          borderColor: 'rgba(250,204,21,0.6)',
          backgroundColor: 'transparent',
          borderDash: [6, 4],
          pointRadius: 0,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', boxWidth: 12, padding: 12 },
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#1f2d3d',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
          callbacks: {
            label: (ctx) => {
              const ratio = ctx.parsed.r
              const status = ratio > 1 ? '⚠ Dépassé' : '✓ En limite'
              return `${status} — ratio : ×${ratio.toFixed(2)}`
            },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: props.maxValue,
          ticks: {
            stepSize: 0.5,
            color: '#475569',
            backdropColor: 'transparent',
          },
          grid:        { color: '#1f2d3d' },
          angleLines:  { color: '#1f2d3d' },
          pointLabels: {
            color: '#94a3b8',
            font: { size: 10 },
          },
        },
      },
    },
  })
}

onMounted(initChart)

watch(() => props.values, (newVals) => {
  if (!chart) return
  chart.data.datasets[0].data = newVals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(chart.data.datasets[0] as any).pointBackgroundColor = newVals.map((v) => v > 1 ? '#ff5050' : '#00ff88')
  chart.update('active')
}, { deep: true })

onBeforeUnmount(() => chart?.destroy())
</script>
