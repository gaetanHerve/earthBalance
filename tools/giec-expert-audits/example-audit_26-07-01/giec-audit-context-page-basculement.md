Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Auditer la cohérence des données climatiques de l'application earthBalance avec les conclusions du GIEC AR6.

Scope analysé : Points de bascule
Date : 2026-07-01

## Contexte GIEC — extraits de l'index RAG local

[AR6_WG2]:
hat ‘Primary tropical forest comprised a net source of carbon to the atmosphere, 2001–2019 (emissions 0.6 Gt y−1, net 0.1 Gt y−1) (Harris et al., 2021). Anthropogenic climate change has thawed Arctic permafrost (Guo et al., 2020), carbon emissions 1.7 ± 0.8 Gt y−1, 2003– 2017 (Natali et al., 2019)’. This also supports the upper limit for this transition lying at 1°C. The potential global loss of a

---

[AR6_WG2]:
obally Projected to transition to very high risk 2.0°C–3.5°C (medium confidence) RFC4 Global aggregate impacts: impacts to socio-ecological systems that can be aggregated globally into a single metric, such as monetary damages, lives affected, species lost or ecosystem degradation at a global scale. Aggregate impacts on biodiversity with damages of global significance (e.g., drought, pine bark bee

---

[AR6_WG1]:
confidence) and 4°C (medium confidence) above pre-industrial levels. New studies since SROCC (Gregory et al., 2020; Van Breedam et al., 2020) confirm this assessment (see also Figure 9.30). Clark et al. (2016) estimate a complete loss to take about 8000 years at 5.5°C and about 3000 years at 8.6°C. Based on the agreement between new and previous studies, there is therefore high confidence that the

---

[AR6_WG1]:
on et al., 2008). Some of the abrupt climate changes and climate tipping points discussed in this Report could have severe local climate responses, such as extreme temperature, droughts, forest fires, ice-sheet loss and collapse of the thermohaline circulation (Sections 4.7.2, 5.4.9, 8.6 and 9.2.3). There is evidence of abrupt changes in Earth’s history, and some of these events have been interpre

---

[AR6_WG2]:
increasing temperature levels (high confidence). There is high confidence in the existence of threshold behaviour of the Greenland Ice Sheet in a warmer climate (WGI AR6 Ch 9, FoxKemper et al., 2021); however, there is low agreement on the nature of the thresholds and the associated tipping points. Similarly, the likelihood for accelerated and irreversible mass loss from Antarctica increases with 

## Fichiers source analysés

### src/data/tippingPoints.ts
```typescript
export type TippingPointDef = {
  id: string
  trigger: {
    variable:   'temp' | 'forest'
    threshold:  number
    comparison: '>' | '<'
  }
  // Effets sur les séries de simulation (injectés dans simulation.store)
  deltaTemp?:   number   // °C ajoutés de l'année de déclenchement → 2100
  deltaCo2Ppm?: number   // ppm ajoutés
  deltaForest?: number   // % forêt supplémentaire perdu (négatif)
  // Effets directs sur les ratios (consommés dans LimitsView)
  deltaBiodiversityRatio?:  number
  deltaAcidificationRatio?: number
  deltaWaterRatio?:         number
}

export const TIPPING_POINTS: TippingPointDef[] = [
  {
    id:      'tp-permafrost',
    trigger: { variable: 'temp', threshold: 1.5, comparison: '>' },
    deltaTemp:              0.25,
    deltaCo2Ppm:            15,
    deltaBiodiversityRatio: 0.2,
  },
  {
    id:      'tp-coral',
    trigger: { variable: 'temp', threshold: 1.5, comparison: '>' },
    deltaBiodiversityRatio: 0.25,
  },
  {
    id:      'tp-amazon',
    trigger: { variable: 'forest', threshold: 45, comparison: '<' },
    deltaTemp:              0.3,
    deltaForest:           -8,
    deltaBiodiversityRatio: 0.2,
  },
  {
    id:      'tp-arctic',
    trigger: { variable: 'temp', threshold: 1.5, comparison: '>' },
    deltaTemp: 0.3,
  },
  {
    id:      'tp-amoc',
    trigger: { variable: 'temp', threshold: 3.0, comparison: '>' },
    deltaTemp:      0.2,
    deltaWaterRatio: 0.15,
  },
]

```

### src/store/tippingPoints.store.ts
```typescript
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { TIPPING_POINTS } from '@/data/tippingPoints'
import { STORAGE_KEYS } from '@/config/storageKeys'
import { SIM_LABELS } from '@/config/simulation.config'
import { useSimulationStore } from '@/store/simulation.store'
import { interpolateAtYear } from '@/utils/timeSeries'

type TriggerRecord = Record<string, { year: number }>
type OffsetKey = 'deltaTemp' | 'deltaCo2Ppm' | 'deltaForest' | 'deltaBiodiversityRatio' | 'deltaAcidificationRatio' | 'deltaWaterRatio'

function resolveVariable(variable: string, currentYear: number, simStore: ReturnType<typeof useSimulationStore>): number {
  if (variable === 'forest') return interpolateAtYear(currentYear, SIM_LABELS, simStore.cumulativeForest)
  return interpolateAtYear(currentYear, SIM_LABELS, simStore.cumulativeTemp)
}

const ZERO_SERIES = Object.freeze(SIM_LABELS.map(() => 0))

export const useTippingPointsStore = defineStore('tippingPoints', () => {

  // ── État persisté ──────────────────────────────────────────────────────────

  function loadTriggered(): TriggerRecord {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TIPPING_STATE)
      return raw ? (JSON.parse(raw) as TriggerRecord) : {}
    } catch {
      return {}
    }
  }

  const triggered       = ref<TriggerRecord>(loadTriggered())
  const pendingModalIds = ref<string[]>([])
  const enabled         = ref<boolean>(false)

  watch(triggered, val => {
    localStorage.setItem(STORAGE_KEYS.TIPPING_STATE, JSON.stringify(val))
  }, { deep: true })

  // ── Offsets injectés dans simulation.store ──────────────────────────────────

  function sumAtYear(year: number, key: OffsetKey): number {
    return Object.entries(triggered.value).reduce((sum, [id, { year: trigYear }]) => {
      if (year < trigYear) return sum
      const tp = TIPPING_POINTS.find(t => t.id === id)
      return sum + (tp?.[key] ?? 0)
    }, 0)
  }

  function buildOffset(key: OffsetKey): number[] {
    if (!enabled.value) return ZERO_SERIES as number[]
    return SIM_LABELS.map(year => sumAtYear(year, key))
  }

  const tempOffset                = computed<number[]>(() => buildOffset('deltaTemp'))
  const co2PpmOffset              = computed<number[]>(() => buildOffset('deltaCo2Ppm'))
  const forestOffset              = computed<number[]>(() => buildOffset('deltaForest'))
  const biodiversityRatioOffset   = computed<number[]>(() => buildOffset('deltaBiodiversityRatio'))
  const acidificationRatioOffset  = computed<number[]>(() => buildOffset('deltaAcidificationRatio'))
  const waterRatioOffset          = computed<number[]>(() => buildOffset('deltaWaterRatio'))

  // ── Déclenchement + cascade ─────────────────────────────────────────────────

  function checkAndTrigger(currentYear: number): string[] {
    if (!enabled.value) return []

    // useSimulationStore() appelé ici (lazy) — pattern Pinia pour dépendances circulaires.
    const simStore = useSimulationStore()

    const newlyTriggered: string[] = []
    let changed = true

    while (changed) {
      changed = false
      for (const tp of TIPPING_POINTS) {
        if (triggered.value[tp.id]) continue
        const value = resolveVariable(tp.trigger.variable, currentYear, simStore)
        const fires = tp.trigger.comparison === '>' ? value > tp.trigger.threshold : value < tp.trigger.threshold
        if (fires) {
          triggered.value = { ...triggered.value, [tp.id]: { year: currentYear } }
          newlyTriggered.push(tp.id)
          pendingModalIds.value = [...pendingModalIds.value, tp.id]
          changed = true
          break
        }
      }
    }

    return newlyTriggered
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  const triggeredList = computed(() =>
    TIPPING_POINTS
      .filter(tp => !!triggered.value[tp.id])
      .map(tp => ({ ...tp, year: triggered.value[tp.id].year }))
      .sort((a, b) => a.year - b.year),
  )

  const hasAny = computed(() => triggeredList.value.length > 0)

  // ── Modale ─────────────────────────────────────────────────────────────────

  function dismissModal(): void {
    pendingModalIds.value = pendingModalIds.value.slice(1)
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  function resetAll(): void {
    triggered.value       = {}
    pendingModalIds.value = []
  }

  function toggleEnabled(): void {
    enabled.value = !enabled.value
  }

  return {
    triggered,
    pendingModalIds,
    enabled,
    tempOffset,
    co2PpmOffset,
    forestOffset,
    biodiversityRatioOffset,
    acidificationRatioOffset,
    waterRatioOffset,
    triggeredList,
    hasAny,
    checkAndTrigger,
    dismissModal,
    resetAll,
    toggleEnabled,
  }
})

```


## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec cette structure markdown, sans introduction ni texte avant le titre :

## Rapport GIEC — Points de bascule — 2026-07-01

### ✅ Points validés
[Un paragraphe concis par page ou graphe. Indiquer ce qui est cohérent avec AR6 : scénario de référence utilisé, ordres de grandeur, horizons temporels, terminologie. Ne pas recopier les données numériques.]

### ⚠️ Points nécessitant attention
[Liste à puces. Chaque point : description du risque ou de la simplification + préconisation concrète pour corriger ou améliorer.]

### 🔴 Incohérences détectées
[Liste à puces. Chaque point : valeur observée vs. valeur AR6 attendue + référence WG précise + correction suggérée.
Si aucune incohérence critique : indiquer "Aucune incohérence critique détectée."]

### 📚 Sources GIEC citées
[Liste des passages AR6 effectivement utilisés pour cet audit, avec référence WG et section si disponible.]

Règles :
- Ne jamais inventer de problème. Si le contexte est insuffisant, utiliser ⚠️ [Connaissance générale] et l'indiquer explicitement.
- Toujours citer la source AR6 (WGI/WGII/WGIII, section) pour chaque point soulevé.
- Les données fictives ou pédagogiques peuvent s'écarter des valeurs réelles à condition d'être cohérentes avec les ordres de grandeur AR6.
