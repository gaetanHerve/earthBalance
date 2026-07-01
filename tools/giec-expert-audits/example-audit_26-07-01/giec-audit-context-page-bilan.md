Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Auditer la cohérence des données climatiques de l'application earthBalance avec les conclusions du GIEC AR6.

Scope analysé : Bilan 2100
Date : 2026-07-01

## Contexte GIEC — extraits de l'index RAG local

[AR6_WG1]:
n the top end of the range of climate sensitivities amongst the CMIP6 GCMs (Figure Atlas.13). Figure Atlas.12 demonstrates how temperature is projected to increase for all regions, and at a greater rate than the global average over many land regions, and with significant amplification in the Arctic. It also shows the higher mid-century warming and significantly higher end-of-century warming under 

---

[AR6_WG3]:
it considerably less likely that emissions could end up as high as RCP8.5. Still, emission trends in developing countries track RCP8.5 Pedersen et al. (2020), and high land-use emissions could imply that emissions would continue to do so in the future, even at the global scale (Schwalm et al. 2020). Other factors resulting in high emissions include higher population or economic growth as included 

---

[AR6_WG1]:
crease to the same level of warming in 2100. The sea level projections presented might include different pathways to the same warming level in 2100, which is reflected in the uncertainty ranges, and should therefore be interpreted as illustrative of sea level scenarios under a certain warming level. Projections of likely 21st-century GMSL rise along climate trajectories leading to different increa

---

[AR6_WG2]:
ve assessment (Lutz et al., 2019) of the impacts of 1.5°C versus 2°C global warming for a major global climate-change hotspot–the Indus, Ganges and Brahmaputra river basins (IGB) in South Asia–shows adverse impacts of climate change on agricultural production, hydropower production and human health. A global temperature increase of 1.5°C with respect to pre-industrial levels would imply a ≈ 2.1°C 

---

[AR6_WG1]:
SP1-2.6 Stays below 2.0°C warming relative to 1850–1900 (median) with implied net zero CO2 emissions in the second half of the century. RCP2.6, although RCP2.6 might be cooler for the same model settings. SSP4-3.4 A scenario between SSP1-2.6 and SSP2-4.5 in terms of end-of-century radiative forcing. It does not stay below 2.0°C in most CMIP6 runs (Chapter 4) relative to 1850–1900. No 3.4 level of 

## Fichiers source analysés

### src/views/GameEndView.vue
```typescript
<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <!-- Hero -->
    <div
      class="rounded-2xl border p-8 text-center"
      :class="{
        'border-eb-green/40 bg-eb-green/5':  score.overall === 'good',
        'border-amber-500/40 bg-amber-900/10': score.overall === 'warning',
        'border-red-600/40 bg-red-900/10':    score.overall === 'critical',
      }"
    >
      <h1 class="text-3xl font-black text-white mb-1">{{ t('bilan.title') }}</h1>
      <p class="text-slate-400 text-sm mb-8">{{ t('bilan.subtitle') }}</p>

      <!-- Overall verdict chip -->
      <div
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base mb-8"
        :class="{
          'bg-eb-green/15 text-eb-green border border-eb-green/40':      score.overall === 'good',
          'bg-amber-500/15 text-amber-400 border border-amber-500/40':   score.overall === 'warning',
          'bg-red-500/15 text-red-400 border border-red-500/40':         score.overall === 'critical',
        }"
        role="status"
        :aria-label="overallLabel"
      >
        <i
          class="fas"
          :class="{
            'fa-circle-check':       score.overall === 'good',
            'fa-triangle-exclamation': score.overall === 'warning',
            'fa-circle-xmark':       score.overall === 'critical',
          }"
          aria-hidden="true"
        ></i>
        {{ overallLabel }}
      </div>

      <!-- Key figures -->
      <div class="flex flex-wrap justify-center gap-10">
        <div class="text-center">
          <div
            class="text-5xl font-black tabular-nums"
            :class="{
              'text-eb-green':  score.overall === 'good',
              'text-amber-400': score.overall === 'warning',
              'text-red-400':   score.overall === 'critical',
            }"
          >
            +{{ score.tempAt2100 }}&nbsp;°C
          </div>
          <div class="text-xs text-slate-500 mt-1 uppercase tracking-widest">{{ t('bilan.indicator_temp') }}</div>
        </div>
        <div class="text-center">
          <div
            class="text-5xl font-black tabular-nums"
            :class="{
              'text-eb-green':  score.tippingCount === 0,
              'text-amber-400': score.tippingCount > 0 && score.tippingCount <= 2,
              'text-red-400':   score.tippingCount > 2,
            }"
          >
            {{ score.tippingCount }}<span class="text-2xl text-slate-500">/5</span>
          </div>
          <div class="text-xs text-slate-500 mt-1 uppercase tracking-widest">{{ t('bilan.indicator_tipping') }}</div>
        </div>
      </div>
    </div>

    <!-- Narrative -->
    <EbCard>
      <h2 class="text-lg font-bold text-white mb-3">{{ t(`bilan.narrative_${narrativeId}_title`) }}</h2>
      <p class="text-slate-300 leading-relaxed text-sm">{{ t(`bilan.narrative_${narrativeId}_body`) }}</p>
    </EbCard>

    <!-- Pillars -->
    <div class="grid gap-4 lg:grid-cols-3">
      <EbCard
        v-for="pillar in score.pillars"
        :key="pillar.id"
        :extra-class="pillar.category === 'critical' ? 'border-red-700/60' : pillar.category === 'warning' ? 'border-amber-600/40' : 'border-eb-green/30'"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-white text-sm">
            <i class="fas mr-2" :class="pillarIcon(pillar.id)" aria-hidden="true"></i>
            {{ t(`bilan.pillar_${pillar.id}`) }}
          </h2>
          <span
            class="text-xs px-2 py-0.5 rounded-full font-semibold"
            :class="categoryChip(pillar.category)"
          >
            {{ t(`score.${pillar.category}`) }}
          </span>
        </div>

        <ul class="space-y-3" role="list">
          <li
            v-for="ind in pillar.indicators"
            :key="ind.id"
            class="flex items-start justify-between gap-3"
          >
            <span class="text-slate-400 text-xs leading-snug flex-1">{{ t(`bilan.indicator_${ind.id}`) }}</span>
            <div class="text-right shrink-0">
              <div class="font-mono font-bold text-sm" :class="categoryText(ind.category)">
                {{ ind.value }}{{ ind.unit }}
              </div>
              <div class="text-slate-600 text-[10px] tabular-nums">
                {{ t('bilan.vs_baseline') }} {{ ind.baseline }}{{ ind.unit }}
              </div>
            </div>
            <i
              class="fas text-xs mt-0.5 shrink-0"
              :class="{
                'fa-arrow-up text-eb-green':  ind.higherIsBetter && ind.category === 'good',
                'fa-arrow-down text-eb-green': !ind.higherIsBetter && ind.category === 'good',
                'fa-arrow-up text-amber-400':  ind.higherIsBetter && ind.category === 'warning',
                'fa-arrow-down text-amber-400': !ind.higherIsBetter && ind.category === 'warning',
                'fa-arrow-down text-red-400':  ind.higherIsBetter && ind.category === 'critical',
                'fa-arrow-up text-red-400':    !ind.higherIsBetter && ind.category === 'critical',
              }"
              :aria-label="ind.category"
            ></i>
          </li>
        </ul>
      </EbCard>
    </div>

    <!-- Adopted policies -->
    <EbCard>
      <h2 class="text-lg font-bold text-white mb-4">{{ t('bilan.policies_adopted') }}</h2>
      <p v-if="!adoptedPolicies.length" class="text-slate-500 text-sm italic">{{ t('bilan.policies_none') }}</p>
      <ol v-else class="space-y-2 list-decimal list-inside" role="list">
        <li
          v-for="pol in adoptedPolicies"
          :key="pol.id"
          class="text-slate-300 text-sm flex items-baseline gap-2"
        >
          <router-link
            :to="`/mitigation-policies/${pol.id}`"
            class="hover:text-eb-cyan transit
// [... tronqué]
```

### src/store/simulation.store.ts
```typescript
// â”€â”€â”€ Simulation Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// Moteur de calcul dÃ©terministe pour la dÃ©mo de simulation de politiques.
// Charge les dÃ©cisions disponibles, maintient la sÃ©quence choisie par le joueur,
// et calcule les projections COâ‚‚ et tempÃ©rature cumulÃ©es.
//
// Approche : delta additif (sans interactions inter-politiques pour le POC).
// Chaque dÃ©cision contribue : delta_i[j] = decided[j] - baseline[j]
// Cumul : baseline[j] + Î£ delta_i[j]
//
// Seules les dÃ©cisions avec modÃ¨le d'impact complet (emissionsReductionGtCO2yr)
// sont incluses dans le catalogue de simulation.

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { mitigationPolicies as allMitigationPolicies } from '@/data/mitigationPolicies'
import type { MitigationPolicy, MitigationPolicyProjections, EnergyMixKey, ResourceKey, SocietalKey } from '@/types/index'
import { useMitigationPoliciesStore } from './mitigationPolicies.store'
import { useTippingPointsStore } from './tippingPoints.store'
import { GAME_CONFIG } from '@/config/game.config'
import { STORAGE_KEYS } from '@/config/storageKeys'
import { SIM_LABELS } from '@/config/simulation.config'
import { interpolateAtYear } from '@/utils/timeSeries'
import {
  BASELINE_CO2_10PT,
  BASELINE_TEMP_10PT,
  BASELINE_FOREST_10PT,
  BASELINE_ENERGY_MIX_10PT,
  BASELINE_RESOURCES_10PT,
  BASELINE_FOOD_SECURITY_10PT,
  BASELINE_WATER_ACCESS_10PT,
  BASELINE_WATER_TENSIONS_10PT,
  BASELINE_RESOURCE_CONFLICTS_10PT,
  BASELINE_CLIMATE_MIGRATIONS_10PT,
  BASELINE_LIFE_EXPECTANCY_10PT,
  BASELINE_RESPIRATORY_DISEASES_10PT,
  BASELINE_WHO_HEALTH_INDEX_10PT,
  BASELINE_GINI_COEFFICIENT_10PT,
  BASELINE_WEALTH_CONCENTRATION_10PT,
  BASELINE_EDUCATION_ACCESS_10PT,
} from '@/config/baselines.config'

// â”€â”€â”€ Baseline SSP2-4.5 (Single Source of Truth) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Imported from src/config/baselines.config.ts â€” see that file for detailed documentation
// ValidÃ©e contre AR6_WG1_00174 (page 80) â€” Near-term 1.5Â°C, Mid-term 2.0Â°C, Long-term 2.7Â°C
// SIM_LABELS = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074, 2100]
export { SIM_LABELS } from '@/config/simulation.config'
export const BASELINE_CO2  = BASELINE_CO2_10PT
export const BASELINE_TEMP = BASELINE_TEMP_10PT

// Labels des projections dans les donnÃ©es de politique (9 points, hors 2100)
const PROJ_LABELS = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]

// Concentration atmosphÃ©rique de COâ‚‚ (ppm) â€” SSP2-4.5 (source : CMIP6 / Meinshausen et al.)
export const BASELINE_CO2_PPM = [421, 425, 429, 433, 443, 460, 487, 510, 527, 549]

// ForÃªts primaires mondiales restantes (% de la couverture originelle) â€” SSP2-4.5
// Source : Mackey et al. 2015 / Steffen et al. 2015 (limite planÃ©taire usage des terres) : 58 % en 2024
export const BASELINE_FOREST = BASELINE_FOREST_10PT

// Total Ã©nergie primaire mondiale (TWh, hors biomasse traditionnelle) â€” IEA STEPS / SSP2-4.5
// UtilisÃ© pour convertir les parts % du mix en valeurs absolues TWh
// 2024 : donnÃ©es rÃ©elles Energy Institute ; 2026-2100 : projection tendancielle
const BASELINE_ENERGY_TOTAL_TWH = [175272, 180000, 184000, 188000, 197000, 213000, 236000, 256000, 278000, 305000]

// Mix Ã©nergÃ©tique mondial (% du total Ã©nergie primaire) â€” IEA STEPS
const ENERGY_MIX_KEYS: EnergyMixKey[] = ['coal', 'oil', 'gas', 'nuclear', 'solar', 'wind', 'hydro', 'autres']
export const BASELINE_ENERGY_MIX: Record<EnergyMixKey, number[]> = BASELINE_ENERGY_MIX_10PT

// Extraction de ressources naturelles (Gt/an) â€” UNEP Global Resources Outlook
const RESOURCE_KEYS: ResourceKey[] = ['minerals', 'biomass', 'fossilFuels']
export const BASELINE_RESOURCES: Record<ResourceKey, number[]> = BASELINE_RESOURCES_10PT

// SÃ©curitÃ© alimentaire (indice FAO /100) â€” SSP2-4.5 : dÃ©gradation aprÃ¨s 2030 sous pression climatique
// Source : AR6 WGII Ch.5 (agricultural systems) ; FAO SOFI 2023
export const BASELINE_FOOD_SECURITY = BASELINE_FOOD_SECURITY_10PT

// AccÃ¨s Ã  l'eau potable (% population mondiale) â€” SSP2-4.5 : progression continue mais ralentissante
// Source : WHO/UNICEF JMP ; AR6 WGII Ch.4 (water resources)
export const BASELINE_WATER_ACCESS = BASELINE_WATER_ACCESS_10PT

// Tensions gÃ©opolitiques â€” scores de tension (0-100, plus haut = pire) â€” SSP2-4.5 sans action
// Source : AR6 WGII Ch.7 (conflits, migrations) ; ACLED ; UNHCR
export const BASELINE_WATER_TENSIONS      = BASELINE_WATER_TENSIONS_10PT
export const BASELINE_RESOURCE_CONFLICTS  = BASELINE_RESOURCE_CONFLICTS_10PT
export const BASELINE_CLIMATE_MIGRATIONS  = BASELINE_CLIMATE_MIGRATIONS_10PT

// SantÃ© globale â€” SSP2-4.5 sans action
// Source : AR6 WGII Ch.7 (santÃ©) ; OMS GHO ; Lancet Countdown on Health & Climate Change
export const BASELINE_LIFE_EXPECTANCY      = BASELINE_LIFE_EXPECTANCY_10PT  // annÃ©es
export const BASELINE_RESPIRATORY_DISEASES = BASELINE_RESPIRATORY_DISEASES_10PT  // % d'augmentation vs 2000
export const BASELINE_WHO_HEALTH_INDEX     = BASELINE_WHO_HEALTH_INDEX_10PT  // /100

// InÃ©galitÃ©s â€” SSP2-4.5 sans action : les impacts climatiques creusent les inÃ©galitÃ©s
// Source : AR6 WGII Ch.16 (pauvretÃ© & inÃ©galitÃ©) ; World Inequality Report 2022 ; WID.world
export const BASELINE_GINI_COEFFICIENT     = BASELINE_GINI_COEFFICIENT_10PT
export const BASELINE_WEALTH_CONCENTRATION = BASELINE_WEALTH_CONCENTRATION_10PT    // % richesse du top 1%
export const BASELINE_EDUCATION_ACCESS     = BASELINE_EDUCATION_ACCESS_10PT    // % population avec accÃ¨s Ã©ducation secondaire+

const SELECTED_KEY  = STORAGE_KEYS.SIMULATION_SELECTED
const BASELINE_KEY  = STORAGE_KEYS.SIMULATION_BASELINE
const SIM_BASE_
// [... tronqué]
```


## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec cette structure markdown, sans introduction ni texte avant le titre :

## Rapport GIEC — Bilan 2100 — 2026-07-01

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
