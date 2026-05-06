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

// ─── Plugin Terre (module-level) ───────────────────────────────────────────────
// Enregistré globalement une seule fois pour garantir que Chart.js l'appelle.
// Un WeakSet trace les instances de charts qui doivent afficher la Terre,
// sans créer de fuite mémoire (les entrées sont collectées avec le chart).
//
// Stratégie de rendu :
//   • Hook afterDraw — s'exécute après le rendu complet du chart (grille, données,
//     labels), jamais effacé par le clearCanvas interne de Chart.js.
//   • globalCompositeOperation 'destination-over' — insère les pixels de la Terre
//     DERRIÈRE le contenu déjà dessiné : le fill cyan et les lignes du radar
//     restent visibles au-dessus, la Terre transparaît en dessous.
//   • Clip au polygone-seuil (ratio = 1 sur chaque axe) — la forme irrégulière
//     reflète l'asymétrie des dépassements, c'est intentionnel.
//   • Le halo atmosphérique est dessiné en dernière étape avec 'source-over'
//     (compositing par défaut) pour apparaître sur le contenu du chart.

type RadialScale = {
  xCenter: number
  yCenter: number
  getPointPosition: (index: number, distanceFromCenter: number) => { x: number; y: number }
}

// Continents : {dx, dy} = décalage depuis le centre (fraction du rayon moyen)
//              {rx, ry} = demi-axes de l'ellipse, {rot} = rotation en radians
const CONTINENTS = [
  { dx:  0.28, dy: -0.25, rx: 0.42, ry: 0.22, rot: -0.17 },  // Eurasie
  { dx:  0.12, dy:  0.2,  rx: 0.16, ry: 0.3,  rot: -0.14 },  // Afrique
  { dx: -0.32, dy: -0.18, rx: 0.28, ry: 0.24, rot:  0.26 },  // Amérique du Nord
  { dx: -0.18, dy:  0.3,  rx: 0.14, ry: 0.22, rot:  0.14 },  // Amérique du Sud
  { dx:  0.4,  dy:  0.25, rx: 0.16, ry: 0.1,  rot: -0.44 },  // Australie
  { dx:  0,    dy:  0.55, rx: 0.38, ry: 0.1,  rot:  0    },  // Antarctique
  { dx: -0.2,  dy: -0.45, rx: 0.1,  ry: 0.06, rot:  0    },  // Groenland
] as const

const _earthCharts = new WeakSet<object>()

Chart.register({
  id: 'earthBackground',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterDraw(chart: any): void {
    if (!_earthCharts.has(chart)) return

    const scale = chart.scales['r'] as unknown as RadialScale
    if (!scale?.getPointPosition) return

    const n  = (chart.data.labels as unknown[]).length
    const cx = scale.xCenter
    const cy = scale.yCenter

    // Sommets du polygone-seuil (ratio = 1 sur chaque axe)
    const vertices = Array.from({ length: n }, (_, i) => scale.getPointPosition(i, 1))

    // Rayon moyen : unité de référence pour gradients et continents
    const avgRadius = vertices.reduce(
      (sum, v) => sum + Math.hypot(v.x - cx, v.y - cy), 0,
    ) / n

    const ctx = chart.ctx as CanvasRenderingContext2D
    ctx.save()

    // ── Clip au polygone-seuil ─────────────────────────────────────────────────
    ctx.beginPath()
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let i = 1; i < n; i++) ctx.lineTo(vertices[i].x, vertices[i].y)
    ctx.closePath()
    ctx.clip()

    // 'destination-over' : les pixels de la Terre s'insèrent derrière
    // le contenu déjà dessiné (fill cyan, lignes, points, grille)
    ctx.globalCompositeOperation = 'destination-over'

    // ── 1. Océan — gradient radial (source lumineuse haut-gauche) ─────────────
    const oceanGrad = ctx.createRadialGradient(
      cx - avgRadius * 0.18, cy - avgRadius * 0.22, avgRadius * 0.05,
      cx,                    cy,                    avgRadius * 1.05,
    )
    oceanGrad.addColorStop(0,    '#0d2a55')
    oceanGrad.addColorStop(0.45, '#071530')
    oceanGrad.addColorStop(1,    '#030a14')
    ctx.fillStyle = oceanGrad
    ctx.fillRect(cx - avgRadius * 1.2, cy - avgRadius * 1.2, avgRadius * 2.4, avgRadius * 2.4)

    // ── 2. Masses continentales ────────────────────────────────────────────────
    for (const { dx, dy, rx, ry, rot } of CONTINENTS) {
      ctx.save()
      ctx.translate(cx + dx * avgRadius, cy + dy * avgRadius)
      ctx.rotate(rot)
      ctx.scale(rx * avgRadius, ry * avgRadius)
      ctx.beginPath()
      ctx.arc(0, 0, 1, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(10, 55, 30, 0.72)'
      ctx.fill()
      ctx.restore()
    }

    // ── 3. Reflet atmosphérique — diffusion de Rayleigh (lumière bleue) ───────
    const atmosGrad = ctx.createRadialGradient(
      cx - avgRadius * 0.35, cy - avgRadius * 0.4, 0,
      cx - avgRadius * 0.15, cy - avgRadius * 0.2, avgRadius * 0.65,
    )
    atmosGrad.addColorStop(0,   'rgba(100, 180, 255, 0.13)')
    atmosGrad.addColorStop(0.6, 'rgba(50,  120, 220, 0.04)')
    atmosGrad.addColorStop(1,   'rgba(0,   0,   0,   0)'   )
    ctx.fillStyle = atmosGrad
    ctx.fillRect(cx - avgRadius * 1.2, cy - avgRadius * 1.2, avgRadius * 2.4, avgRadius * 2.4)

    ctx.restore()  // fin du clip + réinitialise globalCompositeOperation

    // ── 4. Halo ionosphérique — 'source-over' par défaut, visible sur le chart ─
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let i = 1; i < n; i++) ctx.lineTo(vertices[i].x, vertices[i].y)
    ctx.closePath()
    ctx.shadowColor = 'rgba(0, 229, 255, 0.45)'
    ctx.shadowBlur  = 16
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.18)'
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
  if (props.showEarth) _earthCharts.add(chart)
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
