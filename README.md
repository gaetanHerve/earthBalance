# EarthBalance — Jeu Participatif Écologique

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

> 🇬🇧 [English version below](#earthbalance--participatory-ecological-game)

Serious Game web collaboratif permettant à une communauté de prendre des décisions collectives pour maintenir les **9 limites planétaires** en-dessous de leurs seuils critiques, sans compromettre les indicateurs sociétaux (sécurité alimentaire, accès à l'eau, santé, inégalités, etc.).

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework UI | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Typage | TypeScript 5 (strict mode) |
| État global | Pinia |
| Routing | Vue Router 4 (hash history) |
| Graphiques | Chart.js 4 (line, bar, radar, doughnut) |
| Graphe systémique | Cytoscape.js (nœuds / arêtes / boucles de rétroaction) |
| Styles | Tailwind CSS 3 |
| Internationalisation | vue-i18n 9 (FR / EN) |
| Build | Vite 5 |
| Blockchain *(stub)* | À intégrer — ethers.js v6 + Polygon PoS |
| LLM *(stub)* | À intégrer — Claude API via proxy backend |
| Données *(stub)* | À brancher — Our World In Data, FAO, NOAA |

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vue-tsc + vite build
npm run typecheck  # vue-tsc uniquement
npm run preview    # prévisualisation du build
```

---

## Structure du projet

```
src/
├── types/
│   ├── index.ts               # Interfaces TypeScript centralisées
│   └── impactModel.ts         # Types pour les modèles d'impact GIEC
├── config/
│   ├── game.config.ts         # GAME_CONFIG (grain = 5 ans/tour)
│   ├── simulation.config.ts   # SIM_LABELS, PROJ_LABELS — partagés entre stores
│   └── storageKeys.ts         # Clés localStorage centralisées
├── data/                      # Données de démonstration (à remplacer par APIs)
│   ├── planetaryLimits.ts     # 9 limites planétaires — séries 1950–2024
│   ├── societalIndicators.ts  # Indicateurs FAO, OMS, PNUD
│   ├── mitigationPolicies.ts  # Politiques climatiques, votes, projections
│   ├── ballots.ts             # Scrutins et résultats de vote
│   ├── policyDetails.ts       # Descriptions étendues et références GIEC
│   ├── systemicGraph.ts       # 19 nœuds, 61 arêtes, 5 boucles (Cytoscape)
│   ├── tippingPoints.ts       # 5 points de bascule avec seuils de déclenchement
│   ├── ipccQuotes.ts          # Citations GIEC AR6
│   └── models/                # Modèles d'impact JSON (SSP2-4.5)
│       ├── POL_COAL_EXIT_2030_DEV.json
│       ├── POL_DEFORESTATION_HALT_2030.json
│       ├── POL_DIET_SHIFT_PLANTBASED.json
│       ├── POL_METHANE_REDUCTION_2030.json
│       └── POL_TRANSPORT_ELECTRIFICATION.json
├── i18n/
│   ├── index.ts               # Configuration vue-i18n (détection locale navigateur)
│   ├── locales/
│   │   ├── fr.ts              # Traductions françaises
│   │   └── en.ts              # Traductions anglaises
│   └── policies/
│       └── en.ts              # Titres et descriptions des politiques en anglais
├── services/
│   ├── data.service.ts        # Façade données (local → APIs futures)
│   ├── blockchain.service.ts  # Abstraction Web3 (stub ethers.js)
│   └── llm.service.ts         # Abstraction LLM prospectif (stub Claude)
├── store/
│   ├── planets.store.ts       # Limites planétaires + horizon temporel
│   ├── mitigationPolicies.store.ts  # Vote, consensus, validation
│   ├── simulation.store.ts    # Moteur de simulation (projections CO₂ + T°)
│   ├── tippingPoints.store.ts # Détection et persistance des bascules déclenchées
│   └── dashboard.store.ts     # Graphiques éco/soc, widgets personnalisables
├── composables/
│   ├── useContrastMode.ts     # Mode fort contraste (localStorage)
│   └── useLocalizedPolicies.ts  # Titres/descriptions localisés des politiques
├── utils/
│   ├── condorcet.ts           # Algorithme Condorcet + départage Borda
│   └── timeSeries.ts          # interpolateAtYear, blendedAtYear, shiftedDeltas
├── components/
│   ├── charts/                # Graphiques réutilisables
│   │   ├── LineChart.vue      # Courbes multi-datasets (légende SVG ligne+forme)
│   │   ├── BarChart.vue
│   │   ├── RadarChart.vue     # Radar 9 limites (formes par statut, globe terrestre)
│   │   ├── GaugeChart.vue
│   │   ├── VotePieChart.vue
│   │   └── ChartSkeleton.vue
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── AppTicker.vue
│   │   ├── AppLoadingBar.vue  # Barre de progression de navigation
│   │   ├── AppSearch.vue      # Recherche in-app
│   │   ├── AppLangToggle.vue  # Sélecteur de langue FR/EN
│   │   ├── AppContrastToggle.vue  # Mode fort contraste
│   │   ├── CollapsibleSection.vue
│   │   ├── EbCard.vue
│   │   └── SectionTitle.vue
│   ├── dashboard/
│   │   ├── EcologicalIndicators.vue
│   │   ├── SocietalIndicators.vue
│   │   ├── WidgetCustomizer.vue
│   │   └── widgets/           # Widgets individuels (Co2, Temperature, SeaLevel…)
│   ├── limits/
│   │   └── PlanetaryLimitCard.vue
│   ├── TippingPointModal.vue  # Modal de détail d'un point de bascule
│   └── mitigationPolicies/
│       ├── VoteCard.vue
│       ├── BlockchainPanel.vue
│       └── ProspectivePanel.vue
├── views/
│   ├── DashboardView.vue      # Vue synthétique (indicateurs + scrutin en cours)
│   ├── LimitsView.vue         # Radar global + 9 fiches détaillées
│   ├── PolitiquesView.vue     # Vote Condorcet + historique des scrutins
│   ├── PolicyDetailView.vue   # Fiche détaillée d'une politique (références GIEC)
│   ├── SimulateurView.vue     # Simulateur de politiques climatiques GIEC AR6
│   ├── TippingPointsView.vue  # 5 points de bascule climatiques et leurs seuils
│   ├── SystemicMapView.vue    # Carte systémique interactive (Cytoscape.js)
│   └── CorrelationsView.vue   # Placeholder (fonctionnalité à venir)
└── router/index.ts
```

---

## Sections de l'application

### Dashboard (`/`)

Vue synthétique : indicateurs écologiques (CO₂, température, forêt, énergie, ressources) et sociétaux (sécurité alimentaire, eau, conflits, santé, inégalités). Widgets personnalisables persistés en localStorage. Scrutin collectif en cours avec résultats en temps réel.

### Limites Planétaires (`/limites-planetaires`)

Graphique radar des 9 limites (toile d'araignée) + fiches individuelles avec évolution temporelle 1950–2024. Les points du radar utilisent **trois formes distinctes** selon le statut : triangle (dépassé), carré (zone de risque), cercle (sûr) — conformément aux règles RGAA (l'information ne repose pas uniquement sur la couleur).

### Politiques (`/mitigation-policies`)

Chaque scrutin soumet trois politiques climatiques au vote de la communauté via un **classement par préférence**. Le gagnant est déterminé par la méthode de **Condorcet** (la politique qui bat toutes les autres en duels directs). En cas de cycle, un score de **Borda** départage. Historique des scrutins clos consultable.

### Détail politique (`/mitigation-policies/:id`)

Fiche complète d'une politique : description, impact projeté (réduction CO₂, température 2100), référence GIEC AR6, analyse prospective sur 3 scénarios.

### Simulateur (`/simulateur`)

Simulateur de politiques climatiques basé sur les **modèles d'impact GIEC AR6** (baseline SSP2-4.5 — trajectoire sans action : +4°C en 2100).

- **Catalogue** : politiques sélectionnables et ordonnables par priorité
- **Séquence choisie** : politiques sélectionnées avec boutons monter/descendre
- **Projections cumulées** : courbes CO₂ et température (scénarios décidé / baseline / pessimiste)
- **Seuils Paris** : +1,5°C (pointillés) et +2°C (tirets) sur le graphique température
- **Horizon temporel** : Aujourd'hui / 2040 / 2050 / 2100 — met à jour les 4 indicateurs clés :
  - *Baseline {année}* : température SSP2-4.5 à l'horizon
  - *Scénario décidé {année}* : température projetée à l'horizon (label trajectoire évalué sur 2100)
  - *CO₂ évité 2024→{année}* : cumul par intégrale trapèze (GtCO₂)
  - *Réduction annuelle en {année}* : delta annuel vs. baseline à l'horizon (GtCO₂/an)

### Points de bascule (`/bascules`)

Cinq points de bascule climatiques critiques (fonte du pergélisol, blanchiment des coraux, dégradation de l'Amazonie, fonte de la banquise arctique, affaiblissement de l'AMOC). Chaque point de bascule possède un **seuil de déclenchement** basé sur la température ou la couverture forestière projetée. Le `tippingPoints.store` observe les projections du simulateur en temps réel et enregistre l'année de franchissement.

### Carte systémique (`/carte-systemique`)

Graphe causal interactif (Cytoscape.js) représentant **19 nœuds** (physiques, écosystémiques, sociétaux) et **61 relations** de cause à effet. Chaque arête indique si l'influence est aggravante (`positive`) ou bénéfique (`negative`) du point de vue humain — convention propre à l'application. **5 boucles de rétroaction** nommées sont surlignables (pergélisol-carbone, forêt-carbone, extrêmes-forêts, santé-inégalités, géopolitique-migration). Les références GIEC AR6 associées aux nœuds et aux arêtes sont cliquables et ouvrent le PDF correspondant à la bonne page.

### Corrélations (`/correlations`)

Placeholder — sélection et superposition multi-indicateurs à venir.

---

## Accessibilité (RGAA)

- **Formes distinctes par dataset** sur tous les graphiques multi-courbes (cercle, triangle, carré, etc.) — l'information ne repose pas uniquement sur la couleur
- **Légende HTML SVG** : chaque entrée de légende affiche la ligne colorée avec la forme correspondante centrée dessus
- **Radar chart** : 3 formes par statut de limite planétaire (triangle/carré/cercle)
- Attributs `aria-*` et `role` sur tous les éléments interactifs et graphiques
- Contrastes conformes AA (fond `#0a0f1e` / texte `#e2e8f0`) + **mode fort contraste** activable
- Navigation clavier complète avec `:focus-visible` personnalisé
- Skip link "Aller au contenu principal" sur chaque vue
- Barre de progression de navigation (`AppLoadingBar`)
- `@media (prefers-reduced-motion)` : animations désactivées
- Compatible à partir de **340 px** de largeur d'écran

---

## Intégrations futures

### Blockchain — EarthChain (Polygon PoS)

Voir [`src/services/blockchain.service.ts`](src/services/blockchain.service.ts).

```bash
npm install ethers@^6
```

Interface cible :

- `castVote(decisionId, optionId)` — vote on-chain
- `getVoteTally(decisionId)` — lecture du décompte
- `validateDecision(decisionId)` — inscription du résultat
- Connexion wallet MetaMask / WalletConnect

### LLM prospectif — Claude API

Voir [`src/services/llm.service.ts`](src/services/llm.service.ts).

Le service appelle un **endpoint backend proxy** (ne jamais exposer la clé API côté client) :

```
POST /api/llm/prospective
Body: { decision, currentIndicators }
→ { optimistic, moderate, pessimistic }
```

```bash
npm install @anthropic-ai/sdk  # côté backend uniquement
```

### Sources de données

| Indicateur | Source future |
|---|---|
| CO₂ atmosphérique | NOAA Global Monitoring Laboratory |
| Température globale | NASA GISS Surface Temperature Analysis |
| Biodiversité | IUCN Red List API |
| Forêts | Global Forest Watch API |
| Eau | FAO AQUASTAT |
| Mix énergétique | IEA World Energy Outlook |
| Indicateurs sociétaux | Our World In Data API |

---

## Données de démonstration

Les données actuelles sont fictives mais cohérentes avec l'état scientifique 2024 :

- Changement climatique : 421 ppm CO₂ (seuil : 350 ppm — dépassé ×1.20)
- Érosion biodiversité : 100 E/MSY (seuil : 10 — dépassé ×10)
- Perturbation azote : 150 Tg N/an (seuil : 62 — dépassé ×2.42)
- Ozone stratosphérique : 284 UD (zone de risque — récupération en cours)
- Acidification des océans : Ω 2.82 (zone de risque)
- Utilisation eau douce : 2 600 km³/an (zone de risque — seuil : 4 000 km³/an)

Chaque jeu de données inclut une série temporelle de 1950 à 2024 et une référence vers la source à brancher.

---

## EarthBalance — Participatory Ecological Game

> 🇫🇷 [Version française ci-dessus](#earthbalance--jeu-participatif-écologique)

A collaborative web Serious Game enabling a community to make collective decisions to keep the **9 planetary boundaries** below their critical thresholds, without compromising societal indicators (food security, water access, health, inequality, etc.).

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Typing | TypeScript 5 (strict mode) |
| Global state | Pinia |
| Routing | Vue Router 4 (hash history) |
| Charts | Chart.js 4 (line, bar, radar, doughnut) |
| Systemic graph | Cytoscape.js (nodes / edges / feedback loops) |
| Styles | Tailwind CSS 3 |
| Internationalisation | vue-i18n 9 (FR / EN) |
| Build | Vite 5 |
| Blockchain *(stub)* | To integrate — ethers.js v6 + Polygon PoS |
| LLM *(stub)* | To integrate — Claude API via backend proxy |
| Data *(stub)* | To connect — Our World In Data, FAO, NOAA |

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vue-tsc + vite build
npm run typecheck  # vue-tsc only
npm run preview    # preview the production build
```

---

## Project Structure

```
src/
├── types/
│   ├── index.ts               # Centralised TypeScript interfaces
│   └── impactModel.ts         # Types for IPCC impact models
├── config/
│   ├── game.config.ts         # GAME_CONFIG (grain = 5 years/turn)
│   ├── simulation.config.ts   # SIM_LABELS, PROJ_LABELS — shared across stores
│   └── storageKeys.ts         # Centralised localStorage keys
├── data/                      # Demo data (to be replaced by live APIs)
│   ├── planetaryLimits.ts     # 9 planetary limits — time series 1950–2024
│   ├── societalIndicators.ts  # FAO, WHO, UNDP indicators
│   ├── mitigationPolicies.ts  # Climate policies, votes, projections
│   ├── ballots.ts             # Ballots and voting results
│   ├── policyDetails.ts       # Extended descriptions and IPCC references
│   ├── systemicGraph.ts       # 19 nodes, 61 edges, 5 feedback loops (Cytoscape)
│   ├── tippingPoints.ts       # 5 climate tipping points with trigger thresholds
│   ├── ipccQuotes.ts          # IPCC AR6 quotes
│   └── models/                # JSON impact models (SSP2-4.5)
│       ├── POL_COAL_EXIT_2030_DEV.json
│       ├── POL_DEFORESTATION_HALT_2030.json
│       ├── POL_DIET_SHIFT_PLANTBASED.json
│       ├── POL_METHANE_REDUCTION_2030.json
│       └── POL_TRANSPORT_ELECTRIFICATION.json
├── i18n/
│   ├── index.ts               # vue-i18n config (browser locale detection)
│   ├── locales/
│   │   ├── fr.ts              # French translations
│   │   └── en.ts              # English translations
│   └── policies/
│       └── en.ts              # Policy titles and descriptions in English
├── services/
│   ├── data.service.ts        # Data facade (local → future APIs)
│   ├── blockchain.service.ts  # Web3 abstraction (ethers.js stub)
│   └── llm.service.ts         # Prospective LLM abstraction (Claude stub)
├── store/
│   ├── planets.store.ts       # Planetary limits + time horizon
│   ├── mitigationPolicies.store.ts  # Voting, consensus, validation
│   ├── simulation.store.ts    # Simulation engine (CO₂ + temp projections)
│   ├── tippingPoints.store.ts # Tipping point detection and persistence
│   └── dashboard.store.ts     # Eco/societal charts, customisable widgets
├── composables/
│   ├── useContrastMode.ts     # High contrast mode (localStorage)
│   └── useLocalizedPolicies.ts  # Localised policy titles/descriptions
├── utils/
│   ├── condorcet.ts           # Condorcet algorithm + Borda tiebreaker
│   └── timeSeries.ts          # interpolateAtYear, blendedAtYear, shiftedDeltas
├── components/
│   ├── charts/                # Reusable chart components
│   │   ├── LineChart.vue      # Multi-dataset lines (SVG line+shape legend)
│   │   ├── BarChart.vue
│   │   ├── RadarChart.vue     # 9-limit radar (shapes per status, Earth globe)
│   │   ├── GaugeChart.vue
│   │   ├── VotePieChart.vue
│   │   └── ChartSkeleton.vue
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── AppTicker.vue
│   │   ├── AppLoadingBar.vue  # Navigation progress bar
│   │   ├── AppSearch.vue      # In-app search
│   │   ├── AppLangToggle.vue  # FR/EN language switcher
│   │   ├── AppContrastToggle.vue  # High contrast toggle
│   │   ├── CollapsibleSection.vue
│   │   ├── EbCard.vue
│   │   └── SectionTitle.vue
│   ├── dashboard/
│   │   ├── EcologicalIndicators.vue
│   │   ├── SocietalIndicators.vue
│   │   ├── WidgetCustomizer.vue
│   │   └── widgets/           # Individual widgets (Co2, Temperature, SeaLevel…)
│   ├── limits/
│   │   └── PlanetaryLimitCard.vue
│   ├── TippingPointModal.vue  # Tipping point detail modal
│   └── mitigationPolicies/
│       ├── VoteCard.vue
│       ├── BlockchainPanel.vue
│       └── ProspectivePanel.vue
├── views/
│   ├── DashboardView.vue      # Overview (indicators + active ballot)
│   ├── LimitsView.vue         # Global radar + 9 detailed fact sheets
│   ├── PolitiquesView.vue     # Condorcet voting + ballot history
│   ├── PolicyDetailView.vue   # Individual policy detail (IPCC references)
│   ├── SimulateurView.vue     # IPCC AR6 climate policy simulator
│   ├── TippingPointsView.vue  # 5 climate tipping points and their thresholds
│   ├── SystemicMapView.vue    # Interactive systemic map (Cytoscape.js)
│   └── CorrelationsView.vue   # Placeholder (upcoming feature)
└── router/index.ts
```

---

## Application Sections

### Dashboard (`/`)

Overview of ecological indicators (CO₂, temperature, forest, energy, resources) and societal indicators (food security, water, conflicts, health, inequality). Customisable widgets persisted in localStorage. Active community ballot with live results.

### Planetary Limits (`/limites-planetaires`)

Radar chart of all 9 limits (spider web) + individual fact sheets with time series from 1950 to 2024. Radar points use **three distinct shapes** per status: triangle (exceeded), square (risk zone), circle (safe) — RGAA compliant (information is not conveyed by colour alone).

### Policies (`/mitigation-policies`)

Each ballot submits three climate policies to a community **ranked-choice vote**. The winner is determined by the **Condorcet method** (the policy that beats all others in head-to-head comparisons). In the event of a cycle, a **Borda score** breaks the tie. Closed ballot history is browsable.

### Policy detail (`/mitigation-policies/:id`)

Full policy fact sheet: description, projected impact (CO₂ reduction, temperature 2100), IPCC AR6 reference, prospective analysis across 3 scenarios.

### Simulator (`/simulateur`)

Climate policy simulator based on **IPCC AR6 impact models** (SSP2-4.5 baseline — no-action trajectory: +4°C by 2100).

- **Catalogue**: selectable policies, orderable by priority
- **Chosen sequence**: selected policies with move-up/move-down controls
- **Cumulative projections**: CO₂ and temperature curves (decided / baseline / pessimistic)
- **Paris thresholds**: +1.5°C (dotted) and +2°C (dashed) on the temperature chart
- **Time horizon**: Today / 2040 / 2050 / 2100 — updates all four KPI cards:
  - *Baseline {year}*: SSP2-4.5 temperature at the horizon
  - *Decided scenario {year}*: projected temperature at the horizon (trajectory label always assessed against 2100)
  - *CO₂ saved 2024→{year}*: cumulative via trapezoidal integration (GtCO₂)
  - *Annual reduction in {year}*: annual delta vs. baseline at the horizon (GtCO₂/yr)

### Tipping Points (`/bascules`)

Five critical climate tipping points (permafrost thaw, coral bleaching, Amazon dieback, Arctic sea-ice loss, AMOC weakening). Each tipping point has a **trigger threshold** based on projected temperature or forest cover. The `tippingPoints.store` watches simulator projections in real time and records the year each threshold is crossed.

### Systemic Map (`/carte-systemique`)

Interactive causal graph (Cytoscape.js) with **19 nodes** (physical, ecosystem, societal) and **61 cause-and-effect relationships**. Each edge indicates whether the influence is aggravating (`positive`) or beneficial (`negative`) from a human perspective — an app-specific convention, not standard graph notation. **5 named feedback loops** are highlightable (permafrost-carbon, forest-carbon, extremes-forests, health-inequality, geopolitics-migration). IPCC AR6 references attached to nodes and edges are clickable and open the corresponding PDF at the correct page.

### Correlations (`/correlations`)

Placeholder — multi-indicator selection and overlay feature coming soon.

---

## Accessibility (RGAA / WCAG AA)

- **Distinct shapes per dataset** on all multi-line charts (circle, triangle, square, diamond, etc.) — information is not conveyed by colour alone
- **HTML SVG legend**: each legend entry shows the coloured line with the corresponding shape centred on it
- **Radar chart**: 3 shapes per planetary limit status (triangle / square / circle)
- `aria-*` and `role` attributes on all interactive elements and charts
- AA-compliant contrasts (background `#0a0f1e` / text `#e2e8f0`) + activatable **high contrast mode**
- Full keyboard navigation with custom `:focus-visible`
- "Skip to main content" link on every view
- Navigation progress bar (`AppLoadingBar`)
- `@media (prefers-reduced-motion)`: animations disabled
- Responsive down to **340 px** screen width

---

## Planned Integrations

### EarthChain Blockchain (Polygon PoS)

See [`src/services/blockchain.service.ts`](src/services/blockchain.service.ts).

```bash
npm install ethers@^6
```

Target interface:

- `castVote(decisionId, optionId)` — on-chain vote submission
- `getVoteTally(decisionId)` — read vote counts from chain
- `validateDecision(decisionId)` — record the outcome
- Wallet connection: MetaMask / WalletConnect

### Prospective LLM — Claude API

See [`src/services/llm.service.ts`](src/services/llm.service.ts).

The service calls a **backend proxy endpoint** (never expose the API key client-side):

```
POST /api/llm/prospective
Body: { decision, currentIndicators }
→ { optimistic, moderate, pessimistic }
```

```bash
npm install @anthropic-ai/sdk  # server-side only
```

### Data Sources

| Indicator | Future source |
|---|---|
| Atmospheric CO₂ | NOAA Global Monitoring Laboratory |
| Global temperature | NASA GISS Surface Temperature Analysis |
| Biodiversity | IUCN Red List API |
| Forests | Global Forest Watch API |
| Water | FAO AQUASTAT |
| Energy mix | IEA World Energy Outlook |
| Societal indicators | Our World In Data API |

---

## Demo Data

Current data is fictional but consistent with the 2024 scientific consensus:

- Climate change: 421 ppm CO₂ (threshold: 350 ppm — exceeded ×1.20)
- Biodiversity loss: 100 E/MSY (threshold: 10 — exceeded ×10)
- Nitrogen cycle: 150 Tg N/yr (threshold: 62 — exceeded ×2.42)
- Stratospheric ozone: 284 DU (risk zone — recovering)
- Ocean acidification: Ω 2.82 (risk zone)
- Freshwater use: 2,600 km³/yr (risk zone — threshold: 4,000 km³/yr)

Each dataset includes a time series from 1950 to 2024 and a reference to its future live source.
