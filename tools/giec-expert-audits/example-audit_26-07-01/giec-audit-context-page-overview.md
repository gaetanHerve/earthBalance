Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Auditer la cohérence des données climatiques de l'application earthBalance avec les conclusions du GIEC AR6.

Scope analysé : Vue d'ensemble
Date : 2026-07-01

## Contexte GIEC — extraits de l'index RAG local

[AR6_WG1]:
crease to the same level of warming in 2100. The sea level projections presented might include different pathways to the same warming level in 2100, which is reflected in the uncertainty ranges, and should therefore be interpreted as illustrative of sea level scenarios under a certain warming level. Projections of likely 21st-century GMSL rise along climate trajectories leading to different increa

---

[AR6_WG1]:
climate change information at different global warming levels (GWLs, see Cross-Chapter Box 11.1). In particular, to provide policy-relevant climate information and represent the range of outcomes from the emissions scenario and time periods considered, GWLs of 1.5°C, 2°C, 3°C and 4°C are considered. The information is computed from all available scenarios (e.g., only 1.5°C and 2°C GWL information 

---

[AR6_WG3]:
ach (Cross-Chapter Box 6, Figure 1e). Similarly, the remaining carbon (or GHG) budgets in Chapter 3 (this report), as well as the net zero carbon (or GHG) targets, could only be used in combination with the definition of anthropogenic emissions as used by the IAMs (Cross-Chapter Box 3 in Chapter 3). In the absence of these adjustments, collective progress would appear better than it is. 763 Agricu

---

[AR6_WG1]:
P5-8.5 Year by which a rise of 2.0 m above 1995–2014 is expected 1.5 m 1.0 m 0.5 m (c) Projected timing of sea level rise milestones 2150 medium & low confidence projections (see caption) Box TS.4, Figure 1 | Global mean sea level (GMSL) change on different time scales and under different scenarios. The intent of this figure is to (i) show the century-scale GMSL projections in the context of the 2

---

[AR6_WG1]:
ario uncertainty, climate change projections are also subject to climate response uncertainty (i.e., the uncertainty related to our understanding of the key physical processes and structural uncertainties in climate models) and irreducible and intrinsic uncertainties related to internal variability. Depending on the spatial and temporal scales of the projection, and on the variable of interest, th

## Fichiers source analysés

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

### src/data/mitigationPolicies.ts
```typescript
﻿import type { MitigationPolicy, GlobalStats, BlockchainState } from '@/types/index'

// ─── Baseline SSP2-4.5 (référence partagée pour toutes les projections) ────────
// Validée contre AR6_WG1_00174 (page 80) — Near-term 1.5°C, Mid-term 2.0°C, Long-term 2.7°C
// labels : [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]
// co2    : [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0] GtCO2/an (stabilisation post-2050)
// temp   : [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32] °C (GIEC-aligned progression)
//
// Les courbes "decided" et "pessimist" sont calculées en ajoutant les deltas
// issus des modèles d'impact JSON (src/data/models/) à la baseline SSP2-4.5.

export const mitigationPolicies: MitigationPolicy[] = [
  // ─── Décision existante 42-07 ─────────────────────────────────────────────
  {
    id: 'dec-07',
    sessionId: 1,
    number: '07',
    status: 'active',
    implementationLag: 2,
    title: 'Taxe carbone mondiale à 150 $/tonne d\'ici 6 ans ?',
    description: `Cette proposition vise à instaurer une taxe carbone universelle de **150 $/tonne de CO₂** applicable à toutes les nations signataires de l'Accord de Paris d'ici 6 ans. Les revenus seraient redistribués à 60% vers les pays en développement pour financer la transition énergétique, et à 40% vers un fonds mondial d'adaptation climatique. Enjeux : compétitivité industrielle, justice climatique, efficacité de réduction des émissions.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 673, contre: 386, abst: 188 },
    consensusThreshold: 67,
    deadline: '2024-03-15T18:00:00Z',
    resources: [
      {
        title: 'Rapport GIEC AR6 — Atténuation du changement climatique',
        excerpt: 'Les taxes carbone entre 135 et 5500 $/tCO₂ sont nécessaires pour limiter le réchauffement à 1,5°C.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'FMI — Tarification du carbone : pourquoi, comment et combien ?',
        excerpt: 'Une taxe universelle de 75 $ la tonne permettrait de réduire les émissions de 35% d\'ici 2030.',
        url: 'https://www.imf.org/en/Publications/staff-climate-notes/Issues/2021/06/15/',
      },
      {
        title: 'Carbon Pricing Dashboard — Banque Mondiale',
        excerpt: 'Panorama mondial des mécanismes de tarification du carbone en vigueur en 2024.',
        url: 'https://carbonpricingdashboard.worldbank.org/',
      },
    ],
    // Source : src/data/models/POL_CARBON_TAX_150.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 6,
      tempReductionC2100: 0.22,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, la taxe carbone mondiale aura réduit les émissions globales de **22%**. Les énergies renouvelables représentent désormais **51%** du mix énergétique mondial. Les pays en développement ont reçu 2 400 Mds$ pour financer leur transition. La déforestation a ralenti de **35%**. Les conflits liés aux ressources énergétiques ont diminué significativement.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, malgré des résistances industrielles, les émissions auront baissé de **38%** par rapport à 2024. La température globale se stabilise à **+1.7°C**. Des tensio
// [... tronqué]
```


## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec cette structure markdown, sans introduction ni texte avant le titre :

## Rapport GIEC — Vue d'ensemble — 2026-07-01

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
