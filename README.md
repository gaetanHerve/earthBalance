# EarthBalance — Jeu Participatif Écologique

> 🇬🇧 [English version below](#earthbalance--participatory-ecological-game)

Application web collaborative permettant à une communauté de prendre des décisions collectives pour maintenir les **9 limites planétaires** en-dessous de leurs seuils critiques d'ici 2075, sans compromettre les indicateurs sociétaux (sécurité alimentaire, accès à l'eau, santé, inégalités, etc.).

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework UI | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Typage | TypeScript 5 (strict mode) |
| État global | Pinia |
| Routing | Vue Router 4 |
| Graphiques | Chart.js 4 (line, bar, radar, doughnut) |
| Styles | Tailwind CSS 3 |
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
│   └── index.ts               # Interfaces TypeScript centralisées
├── data/                      # Données de démonstration (à remplacer par APIs)
│   ├── planetaryLimits.ts     # 9 limites planétaires — séries 1950–2024
│   ├── societalIndicators.ts  # Indicateurs FAO, OMS, PNUD
│   └── decisions.ts           # Décisions collectives, votes, projections
├── services/
│   ├── data.service.ts        # Façade données (local → APIs futures)
│   ├── blockchain.service.ts  # Abstraction Web3 (stub ethers.js)
│   └── llm.service.ts         # Abstraction LLM prospectif (stub Claude)
├── store/
│   ├── planets.store.ts       # Limites planétaires + horizon temporel
│   ├── decisions.store.ts     # Vote, consensus, validation, prospective
│   └── dashboard.store.ts     # Graphiques éco/soc, widgets personnalisables
├── components/
│   ├── charts/                # Graphiques réutilisables (Line, Gauge, Bar, Radar)
│   ├── layout/                # AppHeader, AppTicker, AppFooter, EbCard
│   ├── dashboard/             # Indicateurs écologiques et sociétaux, widget picker
│   ├── decisions/             # VoteCard, BlockchainPanel, ProspectivePanel
│   └── limits/                # PlanetaryLimitCard (fiche + graphique individuel)
├── views/
│   ├── DashboardView.vue      # Vue synthétique (indicateurs + décision en cours)
│   ├── LimitsView.vue         # Radar global + 9 fiches détaillées
│   ├── DecisionsView.vue      # Interface de vote + historique
│   └── CorrelationsView.vue   # Placeholder (fonctionnalité à venir)
└── router/index.ts
```

---

## Sections de l'application

### Dashboard

Vue synthétique : indicateurs écologiques (CO₂, température, forêt, énergie, ressources) et sociétaux (sécurité alimentaire, eau, conflits, santé, inégalités). Widgets personnalisables persistés en localStorage. Décision collective en cours et prospective post-validation.

### Limites Planétaires

Graphique radar des 9 limites (toile d'araignée, style Stockholm Resilience Centre) + fiches individuelles avec évolution temporelle 1950–2024.

### Décisions Collectives

Interface de vote (Pour / Contre / Abstention), barre de consensus, registre blockchain simulé, et après validation : projections CO₂ + température sur 3 scénarios (+10/+20/+50 ans) générées par le service LLM.

### Corrélations

Placeholder — sélection et superposition multi-indicateurs à venir.

---

## Accessibilité (RGAA)

- Attributs `aria-*` et `role` sur tous les éléments interactifs et graphiques
- Contrastes conformes AA (fond `#0a0f1e` / texte `#e2e8f0`)
- Navigation clavier complète avec `:focus-visible` personnalisé
- Skip link "Aller au contenu principal" sur chaque vue
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
- Ozone stratosphérique : 284 UD (en zone d'incertitude — récupération en cours)
- Acidification océans : Ω 2.82 (zone d'incertitude)

Chaque jeu de données inclut une série temporelle de 1950 à 2024 et une référence vers la source à brancher.

---

## EarthBalance — Participatory Ecological Game

> 🇫🇷 [Version française ci-dessus](#earthbalance--jeu-participatif-écologique)

A collaborative web application enabling a community to make collective decisions to keep the **9 planetary boundaries** below their critical thresholds by 2075, without compromising societal indicators (food security, water access, health, inequality, etc.).

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Typing | TypeScript 5 (strict mode) |
| Global state | Pinia |
| Routing | Vue Router 4 |
| Charts | Chart.js 4 (line, bar, radar, doughnut) |
| Styles | Tailwind CSS 3 |
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
│   └── index.ts               # Centralised TypeScript interfaces
├── data/                      # Demo data (to be replaced by live APIs)
│   ├── planetaryLimits.ts     # 9 planetary limits — time series 1950–2024
│   ├── societalIndicators.ts  # FAO, WHO, UNDP indicators
│   └── decisions.ts           # Collective decisions, votes, projections
├── services/
│   ├── data.service.ts        # Data facade (local → future APIs)
│   ├── blockchain.service.ts  # Web3 abstraction (ethers.js stub)
│   └── llm.service.ts         # Prospective LLM abstraction (Claude stub)
├── store/
│   ├── planets.store.ts       # Planetary limits + time horizon
│   ├── decisions.store.ts     # Voting, consensus, validation, prospective
│   └── dashboard.store.ts     # Eco/societal charts, customisable widgets
├── components/
│   ├── charts/                # Reusable charts (Line, Gauge, Bar, Radar)
│   ├── layout/                # AppHeader, AppTicker, AppFooter, EbCard
│   ├── dashboard/             # Ecological & societal indicators, widget picker
│   ├── decisions/             # VoteCard, BlockchainPanel, ProspectivePanel
│   └── limits/                # PlanetaryLimitCard (fact sheet + individual chart)
├── views/
│   ├── DashboardView.vue      # Overview (indicators + active decision)
│   ├── LimitsView.vue         # Global radar + 9 detailed fact sheets
│   ├── DecisionsView.vue      # Voting interface + history
│   └── CorrelationsView.vue   # Placeholder (upcoming feature)
└── router/index.ts
```

---

## Application Sections

### Overview (Dashboard)

Overview of ecological indicators (CO₂, temperature, forest, energy, resources) and societal indicators (food security, water, conflicts, health, inequality). Customisable widgets persisted in localStorage. Active collective decision and post-validation prospective analysis.

### Planetary Limits

Radar chart of all 9 limits (spider web, Stockholm Resilience Centre style) + individual fact sheets with time series from 1950 to 2024.

### Collective Decisions

Voting interface (For / Against / Abstain), consensus progress bar, simulated blockchain ledger, and after validation: CO₂ + temperature projections across 3 scenarios (+10/+20/+50 years) generated by the LLM service.

### Correlations (upcoming)

Placeholder — multi-indicator selection and overlay feature coming soon.

---

## Accessibility (RGAA / WCAG AA)

- `aria-*` and `role` attributes on all interactive elements and charts
- AA-compliant contrasts (background `#0a0f1e` / text `#e2e8f0`)
- Full keyboard navigation with custom `:focus-visible`
- "Skip to main content" link on every view
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
- Stratospheric ozone: 284 DU (uncertainty zone — recovering)
- Ocean acidification: Ω 2.82 (uncertainty zone)

Each dataset includes a time series from 1950 to 2024 and a reference to its future live source.
