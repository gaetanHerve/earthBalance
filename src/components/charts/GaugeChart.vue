<template>
  <div
    class="gauge-wrap relative mx-auto"
    :style="{ width: size + 'px', height: size + 'px' }"
    :aria-label="ariaLabel"
    role="img"
  >
    <canvas :id="canvasId" class="absolute top-0 left-0 w-full h-full"></canvas>
    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <slot>
        <span class="font-black leading-none" :style="{ fontSize: fontSize + 'px', color: trackColor }">
          {{ value }}
        </span>
        <span class="text-xs text-slate-500 mt-0.5">{{ unit }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { Chart as ChartType } from 'chart.js'

Chart.register(...registerables)

const props = withDefaults(defineProps<{
  canvasId:    string
  value:       number
  max?:        number
  trackColor?: string
  bgColor?:    string
  size?:       number
  fontSize?:   number
  unit?:       string
  ariaLabel?:  string
}>(), {
  max: 100,
  trackColor: '#00ff88',
  bgColor: '#1f2d3d',
  size: 140,
  fontSize: 24,
  unit: '',
  ariaLabel: 'Jauge',
})

let chart: ChartType | null = null

function initChart() {
  const ctx = (document.getElementById(props.canvasId) as HTMLCanvasElement | null)?.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [props.value, props.max - props.value],
        backgroundColor: [props.trackColor, props.bgColor],
        borderWidth: 0,
        circumference: 270,
        rotation: 225,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      animation: { animateRotate: true, duration: 1200 },
      plugins: {
        legend:  { display: false },
        tooltip: { enabled: false },
      },
    },
  })
}

onMounted(initChart)

watch(() => props.value, (newVal) => {
  if (!chart) return
  chart.data.datasets[0].data = [newVal, props.max - newVal]
  chart.update('active')
})

onBeforeUnmount(() => chart?.destroy())
</script>
