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
import earthGlobeSrc from '@/assets/earth-globe.png'

Chart.register(...registerables)
import type { Chart as ChartType } from 'chart.js'

// ─── Plugin Terre (module-level) ───────────────────────────────────────────────
// Stratégie de rendu :
//   • beforeDraw — fond océan (gradient) + continents (image PNG prétraitée)
//     dessinés AVANT le radar ; la grille et le fill cyan s'affichent par-dessus.
//   • afterDraw  — halo ionosphérique eb-cyan dessiné APRÈS tout le contenu.
//   • Clip au polygone-seuil (getDistanceFromCenterForValue(1) → pixels).
//   • WeakSet : opt-in par instance sans fuite mémoire.

type RadialScale = {
  xCenter: number
  yCenter: number
  getPointPosition: (index: number, distanceFromCenter: number) => { x: number; y: number }
  getDistanceFromCenterForValue: (value: number) => number
}

// ─── Prétraitement de l'image ─────────────────────────────────────────────────
// Pixels sombres (continents, luminosité < LAND_THRESHOLD) → vert forêt.
// Pixels clairs (océans, fond blanc, ombre) → transparent.
// Traité une seule fois au chargement du module, mis en cache dans _earthCanvas.
const LAND_THRESHOLD = 145

let _earthCanvas: HTMLCanvasElement | null = null
const _earthPendingUpdates: Array<() => void> = []

;(async () => {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image()
    el.onload  = () => resolve(el)
    el.onerror = reject
    el.src = earthGlobeSrc
  })
  const off = document.createElement('canvas')
  off.width = img.width; off.height = img.height
  const offCtx = off.getContext('2d')!
  offCtx.drawImage(img, 0, 0)
  const id = offCtx.getImageData(0, 0, img.width, img.height)
  const d  = id.data
  for (let i = 0; i < d.length; i += 4) {
    const br = (d[i] + d[i + 1] + d[i + 2]) / 3
    if (br > LAND_THRESHOLD) {
      d[i + 3] = 0
    } else {
      d[i]     = 28
      d[i + 1] = 115
      d[i + 2] = 55
      d[i + 3] = Math.min(255, Math.round((LAND_THRESHOLD - br) / LAND_THRESHOLD * 510))
    }
  }
  offCtx.putImageData(id, 0, 0)
  _earthCanvas = off
  // Déclenche le rendu des charts déjà créés mais en attente du canvas
  _earthPendingUpdates.splice(0).forEach(fn => fn())
})()

const _earthCharts = new WeakSet<object>()

// Helper : retourne vertices + avgRadius depuis la scale radar.
// Utilisé dans beforeDraw (corps Terre) et afterDraw (halo).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function earthGeometry(chart: any) {
  const scale = chart.scales['r'] as unknown as RadialScale
  if (!scale?.getPointPosition || !scale?.getDistanceFromCenterForValue) return null
  const n  = (chart.data.labels as unknown[]).length
  const cx = scale.xCenter
  const cy = scale.yCenter
  // getPointPosition prend des pixels. getDistanceFromCenterForValue convertit la valeur 1 → pixels.
  const thresholdPx = scale.getDistanceFromCenterForValue(1)
  const vertices    = Array.from({ length: n }, (_, i) => scale.getPointPosition(i, thresholdPx))
  const avgRadius   = vertices.reduce((s, v) => s + Math.hypot(v.x - cx, v.y - cy), 0) / n
  return { n, cx, cy, vertices, avgRadius }
}

Chart.register({
  id: 'earthBackground',

  // Corps de la Terre dessiné AVANT le radar — la grille et le fill s'affichent par-dessus.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeDraw(chart: any): void {
    if (!_earthCharts.has(chart) || !_earthCanvas) return
    const geo = earthGeometry(chart)
    if (!geo) return
    const { n, cx, cy, vertices, avgRadius } = geo
    const ctx = chart.ctx as CanvasRenderingContext2D
    ctx.save()

    // Clip au polygone-seuil
    ctx.beginPath()
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let i = 1; i < n; i++) ctx.lineTo(vertices[i].x, vertices[i].y)
    ctx.closePath()
    ctx.clip()

    // ── 1. Océan — gradient radial bleu ───────────────────────────────────────
    const oceanGrad = ctx.createRadialGradient(
      cx - avgRadius * 0.2, cy - avgRadius * 0.25, avgRadius * 0.05,
      cx + avgRadius * 0.1, cy + avgRadius * 0.1,  avgRadius * 1.1,
    )
    oceanGrad.addColorStop(0,    '#2a7fd4')
    oceanGrad.addColorStop(0.35, '#1050a0')
    oceanGrad.addColorStop(0.7,  '#082050')
    oceanGrad.addColorStop(1,    '#020c22')
    ctx.fillStyle = oceanGrad
    ctx.fillRect(cx - avgRadius * 1.2, cy - avgRadius * 1.2, avgRadius * 2.4, avgRadius * 2.4)

    // ── 2. Continents — image PNG prétraitée (pixels sombres → vert, océans → transparent) ──
    // Le globe occupe ~80 % de la largeur de l'image (le reste est fond/ombre).
    // Scale 1/0.80 = 1.25 garantit que le globe remplit le rayon du polygone-seuil.
    // Décalage Y de 5 % pour compenser l'ombre portée qui déplace le globe vers le haut.
    const imgSize = avgRadius * 2 * 2
    ctx.drawImage(_earthCanvas, cx - imgSize / 2, cy - imgSize / 2 - imgSize * 0.01, imgSize, imgSize)

    ctx.restore()
  },

  // Halo ionosphérique dessiné APRÈS le radar — lueur eb-cyan sur les bords du seuil.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterDraw(chart: any): void {
    if (!_earthCharts.has(chart)) return
    const geo = earthGeometry(chart)
    if (!geo) return
    const { n, vertices } = geo
    const ctx = chart.ctx as CanvasRenderingContext2D
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let i = 1; i < n; i++) ctx.lineTo(vertices[i].x, vertices[i].y)
    ctx.closePath()
    ctx.shadowColor = 'rgba(0, 229, 255, 0.55)'
    ctx.shadowBlur  = 20
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.28)'
    ctx.lineWidth   = 2.5
    ctx.stroke()
    ctx.restore()
  },
})

const props = withDefaults(defineProps<{
  canvasId:   string
  labels:     string[]
  values:     number[]
  statuses?:  LimitStatus[]
  height?:    number
  ariaLabel?: string
  maxValue?:  number
  showEarth?: boolean
}>(), {
  height:    380,
  ariaLabel: 'Graphique radar des limites planétaires',
  maxValue:  2,
  statuses:  () => [],
  showEarth: false,
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
          backgroundColor:      'rgba(0,229,255,0.1)',
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
              let label: string
              if (status === 'depasse')          label = t('limits.radar_exceeded')
              else if (status === 'zone_incertitude') label = t('limits.risk_zone')
              else                               label = t('limits.radar_at_limit')
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
            stepSize:      0.5,
            color:         '#475569',
            backdropColor: 'transparent',
          },
          grid:        { color: '#1f2d3d' },
          angleLines:  { color: '#1f2d3d' },
          pointLabels: { color: '#94a3b8', font: { size: 10 } },
        },
      },
    },
  })
  if (props.showEarth) {
    _earthCharts.add(chart)
    if (_earthCanvas === null) {
      // Image pas encore prête — on demande un re-rendu dès qu'elle le sera
      _earthPendingUpdates.push(() => chart?.update())
    }
  }
}

onMounted(initChart)

watch(locale, () => {
  if (chart) _earthCharts.delete(chart)
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

onBeforeUnmount(() => {
  if (chart) _earthCharts.delete(chart)
  chart?.destroy()
})
</script>
