Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Auditer la cohérence des données climatiques de l'application earthBalance avec les conclusions du GIEC AR6.

Scope analysé : Hub indicateurs temporels
Date : 2026-07-01

## Contexte GIEC — extraits de l'index RAG local

[AR6_WG1]:
ctivity in food chain, 1243–1244 sea surface temperature trends, 1223 Eastern Europe (EEU) climatic features of, 1998 winter temperature trends in, 1999 Eastern North America (ENA) climatic features of, 2004 precipitation projections for, 2007 East Siberia (ESB) aridification trend (1976–2016), 1976 2355 Index Index climate features of, 1975 warming trends in, 1976, 1978 wildfire risk in, 1976 Eas

---

[AR6_WG1]:
atmosphere.copernicus.eu Data of CARIACO ocean time-series program in the Cariaco Basin In situ Point-based 5.3.2 1996–2017 Bates et al. (2014) http://imars.marine.usf.edu/cariaco CCU ‘IKI-Monitoring’ satellite data archive Remote sensing Daily Resolution varies Atlas 1984–2020 Loupian et al. (2015) 2064 Annex I Observational Products AI Name Version Type Resolution (Time and Space) Section(s) Ti

---

[AR6_WG1]:
st two decades (Section 3.4.3.2.1). It is extremely likely that human influence was the main driver of the ocean heat content increase observed since the 1970s (Section 3.5.1.3), and very likely that human influence was the main driver of the observed GMSL rise since at least 1970 (Section 3.5.3.2). Combining the evidence from across the climate system (Sections 3.3–3.7) increases the level of con

---

[AR6_WG1]:
(AR6 WGIII Chapter 3) and in Cross-Chapter Box 1.4, Table 1 in this chapter. This Report uses a core set of five illustrative SSP scenarios to assist cross-Chapter integration and cross-Working Group applications: SSP1-1.9, SSP1-2.6, SSP2-4.5, SSP3-7.0 and SSP5-8.5 (Cross-Chapter Box 1.4, Table 1). These scenarios span a wide range of plausible societal and climatic futures from potentially below 

---

[AR6_WG3]:
in the literature, and these definitions invariably refer to the evolution over time of a society’s defining features. A society’s development pathway can be described, analysed, and explained from a variety of perspectives, capturing a range of possible features, trends, processes, and mechanisms. It can be examined in terms of specific quantitative indicators, such as population, urbanisation le

## Fichiers source analysés

### src/components/HubNodeChart.vue
[Fichier introuvable]

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

## Rapport GIEC — Hub indicateurs temporels — 2026-07-01

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
