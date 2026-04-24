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
  currentYear?: number
}>(), {
  height:     180,
  ariaLabel:  'Graphique linéaire',
  showLegend: 'auto',
})

// ─── Plugin : ligne verticale "année courante" ────────────────────────────────

function getXForYear(chartInstance: ChartType, year: number): number | null {
  const labels = chartInstance.data.labels as number[]
  if (!labels?.length) return null

  const first = labels[0]
  const last  = labels[labels.length - 1]
  if (year < first || year > last) return null

  const exactIdx = labels.indexOf(year)
  if (exactIdx !== -1) return chartInstance.scales.x.getPixelForValue(exactIdx)

  let prevIdx = 0
  for (let i = 0; i < labels.length - 1; i++) {
    if (labels[i] <= year && labels[i + 1] >= year) { prevIdx = i; break }
  }
  const t  = (year - labels[prevIdx]) / (labels[prevIdx + 1] - labels[prevIdx])
  const x0 = chartInstance.scales.x.getPixelForValue(prevIdx)
  const x1 = chartInstance.scales.x.getPixelForValue(prevIdx + 1)
  return x0 + (x1 - x0) * t
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

const currentYearPlugin = {
  id: 'currentYearLine',
  afterDraw(chartInstance: ChartType) {
    if (props.currentYear === undefined) return
    const x = getXForYear(chartInstance, props.currentYear)
    if (x === null) return

    const { top, bottom } = chartInstance.chartArea
    const ctx = chartInstance.ctx

    ctx.save()

    // Ligne pointillée amber
    ctx.beginPath()
    ctx.setLineDash([4, 3])
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.7
    ctx.moveTo(x, top + 21)
    ctx.lineTo(x, bottom)
    ctx.stroke()

    // Badge année
    const label = String(props.currentYear)
    ctx.font = 'bold 10px ui-monospace, SFMono-Regular, monospace'
    ctx.globalAlpha = 1
    const textWidth = ctx.measureText(label).width
    const padX = 5
    const bw = textWidth + padX * 2; const bh = 14
    const bx = x - bw / 2; const by = top + 5

    ctx.fillStyle = '#451a03'
    drawRoundRect(ctx, bx, by, bw, bh, 3)
    ctx.fill()

    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 1
    ctx.setLineDash([])
    ctx.globalAlpha = 0.6
    drawRoundRect(ctx, bx, by, bw, bh, 3)
    ctx.stroke()

    ctx.globalAlpha = 1
    ctx.fillStyle = '#fbbf24'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, x, by + bh / 2 + 0.5)

    ctx.restore()
  },
}

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
    plugins: [currentYearPlugin],
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

watch(() => props.currentYear, () => { chart?.update('active') })

onBeforeUnmount(() => { chart?.destroy() })
</script>
