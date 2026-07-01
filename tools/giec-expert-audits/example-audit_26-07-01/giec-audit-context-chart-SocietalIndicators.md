Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Auditer la cohérence des données climatiques de l'application earthBalance avec les conclusions du GIEC AR6.

Scope analysé : Indicateurs sociétaux
Date : 2026-07-01

## Contexte GIEC — extraits de l'index RAG local

[AR6_WG2]:
rage, and distribution that conserves nutrition; equitable access and consumption of available, affordable, appropriate, and healthy foods; and waste management that supports nutrient recovery (Harder et al., 2021; Boon and Anuga, 2020; FAO et al., 2021; Pozza and Field, 2020; Ritchie et al., 2018). Traditional, indigenous and small-scale agroecology and regional food systems provide context-speci

---

[AR6_WG2]:
nge in Central and South America? Poverty and inequality decrease human capacity to adapt to climate change. Limited access to resources may reduce the ability of individuals, households and societies to adapt to the impacts of climate change and variability because of the narrow response portfolio. Inequality limits responses available to vulnerable segments as most adaptation options are resourc

---

[AR6_WG2]:
confidence). Since AR5, the impacts of climate change and extreme weather events such as wildfires, extreme heat, cyclones, storms and floods have adversely affected or caused loss and damage to human health, shelter, displacement, incomes and livelihoods, security and inequality (high confidence). Over 20 million people have been internally displaced annually by weather-related extreme events sin

---

[AR6_WG2]:
t livelihoods, which will in turn affect food security (especially food availability; RKR-F), water security (especially access to adequate quantities of acceptable quality water; RKR-G) and the living standards of already vulnerable groups and aggregate economic outputs at the global level (RKR-D). CIDs (IPCC, 2021) will also directly affect infrastructure that are critical to ensure some basic c

---

[AR6_WG2]:
section reports on how worldwide climate change is increasingly affecting marine, freshwater and terrestrial ecosystems and ecosystem services, water and food security, settlements and infrastructure, health and well-being, and economies and culture, especially through compound stresses and events. It refers to the increasing confidence since AR5 that detected impacts are attributable to climate c

## Fichiers source analysés

### src/components/SocietalIndicators.vue
[Fichier introuvable]

### src/data/societalIndicators.ts
```typescript
import type { SocietalIndicators, TickerItem, EcologicalCharts } from '@/types/index'

const years: number[] = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024]

export const societalIndicators: SocietalIndicators = {
  foodSecurity: {
    label: 'Sécurité alimentaire',
    icon: 'fa-wheat-awn',
    color: '#facc15',
    unit: '/100 (indice FAO)',
    criticalThreshold: 50,
    current: 63,
    source: 'TODO: FAO STAT — Suite des indicateurs ODD 2.1',
    timeSeries: {
      years,
      values: [55, 57, 59, 60, 61, 62, 62, 63],
    },
  },

  waterAccess: {
    label: 'Accès eau potable',
    icon: 'fa-droplet',
    color: '#38bdf8',
    unit: '% population mondiale',
    criticalThreshold: 60,
    current: 71,
    source: 'TODO: WHO/UNICEF JMP — https://washdata.org/',
    timeSeries: {
      years,
      values: [52, 56, 60, 63, 66, 68, 70, 71],
    },
  },

  geopoliticalConflicts: {
    label: 'Tensions géopolitiques',
    icon: 'fa-shield-halved',
    color: '#ff5050',
    subIndicators: [
      { label: 'Conflits ressources', value: 74, color: '#ef4444' },
      { label: 'Tensions eau',       value: 61, color: '#fb923c' },
      { label: 'Migrations climatiques', value: 55, color: '#facc15' },
    ],
    source: 'TODO: ACLED API — Armed Conflict Location & Event Data',
  },

  globalHealth: {
    label: 'Santé globale',
    icon: 'fa-heart-pulse',
    color: '#f472b6',
    stats: [
      { label: 'Espérance de vie',       value: '73.4 ans', trend: 'up',   color: '#00ff88' },
      { label: 'Maladies respiratoires', value: '↑ 18%',    trend: 'down', color: '#fb923c' },
      { label: 'Indice santé OMS',       value: '67/100',   trend: 'flat', color: '#00e5ff' },
    ],
    source: 'TODO: OMS Global Health Observatory API — https://www.who.int/data/gho/',
  },

  inequality: {
    label: 'Inégalités (Gini)',
    icon: 'fa-scale-balanced',
    color: '#c084fc',
    stats: [
      { label: 'Gini mondial',       value: '0.67',       color: '#ff5050' },
      { label: '1% les plus riches', value: '45% richesse', color: '#ff5050' },
      { label: 'Accès éducation',    value: '61%',          color: '#facc15' },
    ],
    source: 'TODO: World Inequality Database API — https://wid.world/api/',
  },
}

// Trajectoire SSP2-4.5 (UN WPP 2022, compatible AR6) — milliards de personnes
export const populationTimeSeries = {
  years:  [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024, 2030, 2040, 2050, 2060, 2074, 2100],
  values: [ 5.3,  5.7,  6.1,  6.5,  6.9,  7.4,  7.8,  8.1,  8.5,  9.2,  9.7, 10.1, 10.4, 10.4],
}

export const tickerItems: TickerItem[] = [
  { emoji: '🌡️', label: 'Temp. globale',    value: '+1.4°C', colorClass: 'text-orange-400' },
  { emoji: '💨', label: 'CO₂ atm.',          value: '421 ppm', colorClass: 'text-red-400'    },
  { emoji: '🌊', label: 'Niveau mer',         value: '+22 cm',  colorClass: 'text-eb-cyan'     },
  { emoji: '🌲', label: 'Forêt restante',     value: '58%',     colorClass: 'text-eb-green'    },
  { emoji: '⚡', label: 'Renouvelable',        value: '34%',     colorClass: 'text-yellow-400'  },
  { emoji: '💧', label: 'Accès eau',          value: '71%',     colorClass: 'text-blue-400'    },
  { emoji: '🍽️', label: 'Sécurité alim.',     value: '63/100',  colorClass: 'text-eb-green'    },
  { emoji: '👥', label: 'Pop. mondiale',      value: '8.1 Mds', colorClass: 'text-slate-300'   },
]

export const ecologicalCharts: EcologicalCharts = {
  co2: {
    label: 'Émissions CO₂ mondiales',
    unit: 'GtCO₂/an',
    color: '#ff5050',
    source: 'TODO: Global Carbon Project — https://www.globalcarbonproject.org/',
    timeSeries: {
      years: [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
      values: [22.7, 23.5, 25, 28.1, 31.6, 35, 34.8, 37.4],
    },
  },

  temperature: {
    label: 'Anomalie de température globale',
    unit: '°C vs. pré-industriel',
    color: '#fb923c',
    source: 'TODO: NASA GISS Surface Temperature Analysis — https://data.giss.nasa.gov/gistemp/',
    timeSeries: {
      years: [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
      values: [0.45, 0.52, 0.62, 0.72, 0.82, 0.95, 1.1, 1.4],
    },
  },

  forest: {
    label: 'Forêts primaires mondiales restantes',
    unit: '% de la couverture originelle',
    color: '#00ff88',
    criticalThreshold: 75,
    current: 58,
    source: 'Mackey et al. (2015) — Intact Forest Landscapes ; Steffen et al. (2015) — Planetary Boundaries ; Curtis et al. (2018), Science',
    timeSeries: {
      years:  [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
      values: [  71,   68,   66,   64,   62,   60,   59,   58],
    },
  },

  seaLevel: {
    label: 'Élévation du niveau des mers',
    unit: 'mm (Δ 1995-2014)',
    color: '#60a5fa',
    source: 'IPCC AR6 WGI Ch.9 — Church & White (2011) ; altimétrie satellite NASA/CNES ; projection médiane SSP2-4.5',
    timeSeries: {
      // Observé 1990-2024, puis projection médiane SSP2-4.5 (AR6 Table 9.9, données éducatives)
      // Référence : moyenne 1995-2014 ≈ 0 mm (convention AR6 WGI Ch.9)
      years:  [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024, 2030, 2040, 2050, 2060, 2074, 2100],
      values: [ -40,  -26,  -12,    2,   20,   38,   58,   78,   98,  138,  184,  241,  338,  415],
    },
  },

  extremes: {
    label: 'Indice de fréquence des extrêmes climatiques',
    unit: 'indice (pré-industriel = 1)',
    color: '#fb923c',
    source: 'IPCC AR6 WGI Ch.11 — données observées et projection médiane SSP2-4.5',
    timeSeries: {
      // Indice composite observé 1950-2024, calibré à ×2,8 en 2024 (vagues de chaleur)
      // puis projection médiane SSP2-4.5 (données éducatives)
      years:  [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024, 2030, 2040, 2050, 2060, 2074, 2100],
      values: [1.2, 1.3, 1.42, 1.58, 1.78, 2.05, 2.35, 2.6, 2.8, 3.15, 3.9, 4.9, 6.1, 7.8, 10],
    },
  },

  energyMix: {
// [... tronqué]
```


## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec cette structure markdown, sans introduction ni texte avant le titre :

## Rapport GIEC — Indicateurs sociétaux — 2026-07-01

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
