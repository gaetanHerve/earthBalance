<template>
  <div class="relative" :style="{ height: height + 'px' }">
    <canvas :id="canvasId" aria-label="Résultats du vote en temps réel" role="img"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

import type { Chart as ChartType } from 'chart.js'

const props = withDefaults(defineProps<{
  canvasId: string
  pour?:    number
  contre?:  number
  abst?:    number
  height?:  number
}>(), { pour: 0, contre: 0, abst: 0, height: 160 })

let chart: ChartType | null = null

function initChart() {
  const ctx = (document.getElementById(props.canvasId) as HTMLCanvasElement | null)?.getContext('2d')
  if (!ctx) return
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pour', 'Contre', 'Abstention'],
      datasets: [{
        data: [props.pour, props.contre, props.abst],
        backgroundColor: ['rgba(0,255,136,0.8)', 'rgba(255,80,80,0.8)', 'rgba(71,85,105,0.8)'],
        borderColor: ['#00ff88', '#ff5050', '#475569'],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      animation: { animateRotate: true, duration: 800 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', boxWidth: 10, padding: 8 },
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#1f2d3d',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
        },
      },
    },
  })
}

onMounted(initChart)

watch(() => [props.pour, props.contre, props.abst], ([p, c, a]) => {
  if (!chart) return
  chart.data.datasets[0].data = [p, c, a]
  chart.update('active')
})

onBeforeUnmount(() => chart?.destroy())
</script>
