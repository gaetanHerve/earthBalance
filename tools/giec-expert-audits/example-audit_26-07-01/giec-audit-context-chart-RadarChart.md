Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Auditer la cohérence des données climatiques de l'application earthBalance avec les conclusions du GIEC AR6.

Scope analysé : Radar des limites planétaires
Date : 2026-07-01

## Contexte GIEC — extraits de l'index RAG local

[AR6_WG2]:
od security outcomes under a changing climate: impacts of mitigation and adaptation on vulnerability to food insecurity. Clim Change, 147(1), 327–341, doi:10.1007/s10584-018-2137-y. Riechers, M., Á. Balázsi, M. García-Llorente and J. Loos, 2021: Human-nature connectedness as leverage point. Ecosyst. People, 17(1), 215–221, doi:10.1 080/26395916.2021.1912830. Roberts, D., J. Douwes, C. Sutherland a

---

[AR6_WG2]:
ivers of current and future climate risk to specific sectors, regions and populations (Byers et al., 2018), as 18 2661 Climate Resilient Development Pathways  Chapter 18 well as the demand for both mitigation and adaptation as a means of preventing climate change from undermining development goals. The SDGs represent targets for supporting human and ecological well-being in a sustainable manner. 

---

[AR6_WG3]:
9–703, doi:10.1038/s41558-018-0230-x. Haut Conseil pour le Climat, 2019: Agir en cohérence avec les ambitions. Rapport annuel., Haut Conseil pour le Climat, Paris, France, 66 pp., https://www.hautconseilclimat.fr/wp-content/uploads/2019/09/hcc_ rapport_annuel_2019_v2.pdf (Accessed November 1, 2021). Häyhä, T., P.L. Lucas, D.P. van Vuuren, S.E. Cornell, and H. Hoff, 2016: From Planetary Boundaries 

---

[AR6_WG2]:
240227. Harvey, B., L. Cochrane and M.V. Epp, 2019: Charting knowledge co-production pathways in climate and development. Environ. Policy Gov., 29(2), 107–117, doi:10.1002/eet.1834. Hasegawa, T., et al., 2018: Risk of increased food insecurity under stringent global climate change mitigation policy. Nat. Clim. Change, 8(8), 699–703, doi:10.1038/s41558-018-0230-x. Hasegawa, T., S. Fujimori, K. Taka

---

[AR6_WG2]:
Raworth, 2017; Gerten et al., 2020). Food security is defined as “a situation that exists when all people, at all times, have physical, social and economic access to sufficient, safe and nutritious food that meets their dietary needs and food preferences for an active and healthy life” (FAO, 2020). Food insecurity is often experienced as chronic hunger reported in the annual UN Food Security and N

## Fichiers source analysés

### src/components/RadarChart.vue
[Fichier introuvable]

### src/data/planetaryLimits.ts
```typescript
import type { PlanetaryLimit, RadarData } from '@/types/index'


const years: number[] = [
  1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985,
  1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024,
]

export const planetaryLimits: PlanetaryLimit[] = [
  {
    id: 'changement-climatique',
    name: 'Changement climatique',
    nameEn: 'Climate Change',
    icon: 'fa-temperature-high',
    color: '#ff5050',
    definition: "Concentration de CO₂ atmosphérique, proxy du forçage radiatif additionnel d'origine humaine.",
    definitionEn: 'Atmospheric CO₂ concentration, a proxy for anthropogenic additional radiative forcing.',
    unit: 'ppm CO₂',
    threshold: 350,
    currentValue: 421,
    ratio: 1.2,
    status: 'depasse',
    sources: 'TODO: NOAA Global Monitoring Laboratory API — https://gml.noaa.gov/aftp/data/',
    timeSeries: {
      years,
      values: [310, 315, 317, 320, 325, 331, 339, 346, 354, 361, 370, 381, 390, 401, 414, 421],
    },
  },
  {
    id: 'biodiversite',
    name: 'Érosion de la biodiversité',
    nameEn: 'Biosphere Integrity',
    icon: 'fa-paw',
    color: '#c084fc',
    definition: "Taux d'extinction des espèces (E/MSY : extinctions par million d'espèces-années).",
    definitionEn: 'Species extinction rate (E/MSY: extinctions per million species-years).',
    unit: 'E/MSY',
    threshold: 10,
    currentValue: 100,
    ratio: 10.0,
    status: 'depasse',
    sources: 'TODO: IUCN Red List API — https://apiv3.iucnredlist.org/',
    timeSeries: {
      years,
      values: [1, 2, 3, 5, 8, 12, 18, 27, 38, 48, 58, 68, 78, 85, 93, 100],
    },
  },
  {
    id: 'cycle-azote',
    name: 'Perturbation du cycle de l\'azote',
    nameEn: 'Biogeochemical Flows (N)',
    icon: 'fa-flask',
    color: '#fb923c',
    definition: "Flux d'azote réactif d'origine anthropique vers la biosphère (Tg N/an).",
    definitionEn: 'Reactive nitrogen flux of anthropogenic origin into the biosphere (Tg N/yr).',
    unit: 'Tg N/an',
    threshold: 62,
    currentValue: 150,
    ratio: 2.42,
    status: 'depasse',
    sources: 'TODO: Our World In Data — Nitrogen flows dataset',
    timeSeries: {
      years,
      values: [30, 38, 47, 58, 72, 85, 95, 105, 115, 122, 130, 138, 143, 147, 149, 150],
    },
  },
  {
    id: 'cycle-phosphore',
    name: 'Perturbation du cycle du phosphore',
    nameEn: 'Biogeochemical Flows (P)',
    icon: 'fa-atom',
    color: '#facc15',
    definition: "Flux de phosphore des engrais vers les océans (Tg P/an).",
    definitionEn: 'Phosphorus flux from fertilisers to the oceans (Tg P/yr).',
    unit: 'Tg P/an',
    threshold: 11,
    currentValue: 22,
    ratio: 2,
    status: 'depasse',
    sources: 'TODO: FAO STAT — Fertilizers by Nutrient',
    timeSeries: {
      years,
      values: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 19, 20, 21, 22],
    },
  },
  {
    id: 'ozone-stratospherique',
    name: 'Appauvrissement de l\'ozone stratosphérique',
    nameEn: 'Stratospheric Ozone Depletion',
    icon: 'fa-sun',
    color: '#00e5ff',
    definition: "Concentration d'ozone stratosphérique global (Unités Dobson).",
    definitionEn: 'Global stratospheric ozone concentration (Dobson Units).',
    unit: 'UD (Dobson)',
    threshold: 276,
    currentValue: 284,
    ratio: 0.97,
    status: 'zone_incertitude',
    sources: 'TODO: NASA Ozone Watch — https://ozonewatch.gsfc.nasa.gov/data/',
    timeSeries: {
      years,
      values: [300, 299, 298, 296, 293, 288, 282, 275, 270, 273, 278, 281, 283, 284, 284, 284],
    },
  },
  {
    id: 'acidification-oceans',
    name: 'Acidification des océans',
    nameEn: 'Ocean Acidification',
    icon: 'fa-water',
    color: '#60a5fa',
    definition: "Saturation en aragonite de l'eau de surface des océans (Ω aragonite).",
    definitionEn: 'Aragonite saturation state of surface ocean water (Ω aragonite).',
    unit: 'Ω aragonite',
    threshold: 2.75,
    currentValue: 2.82,
    ratio: 1.02,
    status: 'zone_incertitude',
    sources: 'TODO: SOCAT — Surface Ocean CO2 Atlas API',
    timeSeries: {
      years,
      values: [3.44, 3.4, 3.36, 3.3, 3.23, 3.16, 3.1, 3.04, 2.99, 2.96, 2.93, 2.91, 2.88, 2.86, 2.84, 2.82],
    },
  },
  {
    id: 'eau-douce',
    name: 'Utilisation de l\'eau douce',
    nameEn: 'Freshwater Use',
    icon: 'fa-droplet',
    color: '#38bdf8',
    definition: "Prélèvements d'eau douce par l'agriculture, l'industrie et les ménages (km³/an).",
    definitionEn: 'Freshwater withdrawals by agriculture, industry and households (km³/yr).',
    unit: 'km³/an',
    threshold: 4000,
    currentValue: 2600,
    ratio: 0.65,
    status: 'zone_incertitude',
    sources: 'TODO: FAO AQUASTAT API — https://www.fao.org/aquastat/',
    timeSeries: {
      years,
      values: [1100, 1250, 1400, 1580, 1760, 1900, 2050, 2150, 2250, 2350, 2420, 2480, 2530, 2560, 2580, 2600],
    },
  },
  {
    id: 'usage-terres',
    name: 'Changement d\'utilisation des terres',
    nameEn: 'Land-system Change',
    icon: 'fa-tree',
    color: '#00ff88',
    definition: "Part des forêts originelles encore intactes (% des forêts primaires mondiales).",
    definitionEn: 'Share of original forests still intact (% of global primary forests).',
    unit: '% forêts primaires',
    threshold: 75,
    currentValue: 58,
    ratio: 1.29,
    status: 'depasse',
    // ratio calculé en termes de dépassement vers le bas : threshold / currentValue
    sources: 'TODO: Global Forest Watch API — https://www.globalforestwatch.org/help/developers/',
    timeSeries: {
      years,
      values: [92, 90, 88, 86, 83, 80, 77, 74, 71, 68, 66, 64, 62, 60, 59, 58],
    },
  },
  {
    id: 'aerosols-atmospheriques',
    name: 'Charge en aérosols atmosphériques',
    nameEn: 'Atmospheric Aerosol Loading',
    icon: 'fa-smog',
    color: '#94a3b8',
    definition: "Profondeur optique des aérosols (AOD) — in
// [... tronqué]
```


## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec cette structure markdown, sans introduction ni texte avant le titre :

## Rapport GIEC — Radar des limites planétaires — 2026-07-01

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
