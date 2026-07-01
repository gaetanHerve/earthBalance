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
| Données simulation | OWID + CEDA AR6 — calibration du modèle uniquement (non chargées en production) |

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vue-tsc + vite build
npm run typecheck  # vue-tsc uniquement
npm run preview    # prévisualisation du build
npm run rag:build-index         # construit l'index BM25 dev-only depuis tools/rag/chunks/ipcc_chunks.jsonl
npm run rag:build-index:example # construit l'index depuis le fichier d'exemple
```

### Configuration initiale (une seule fois par clone)

Le script `prepare` (appelé automatiquement par `npm install`) configure `git core.hooksPath` pour pointer vers `.hooks/`. Les hooks pré-commit sont actifs dès ce moment.

L'index RAG RGAA est requis pour la vérification d'accessibilité automatique :

```bash
npm run rag:build-index:rgaa
```

Génère l'index BM25 à partir de `tools/rag/data_sources/RGAA-v4.1.2.txt` (fichier versionné).
L'index est écrit dans `tools/rag/index/` (ignoré par git, à reconstruire après chaque clone).

---

## RAG local IPCC (dev-only)

Le pipeline RAG local est volontairement séparé de l'application web — aucun composant n'est chargé dans le runtime frontend, ce qui évite toute exposition sur GitHub Pages.

### Structure

| Dossier | Statut git | Contenu |
|---|---|---|
| `tools/rag/` | Committé | Scripts (`build-ipcc-index.mjs`, `build-rgaa-index.mjs`, `search.mjs`), exemples |
| `tools/rag/data_sources/` | Committé | Données CSV AR6 (CEDA), séries OWID, référentiel RGAA |
| `tools/rag/chunks/` | Ignoré | Chunks IPCC privés (source du pipeline de build) |
| `tools/rag/index/` | Ignoré | Artefacts générés (index BM25 + chunks de travail) |

Les données de `data_sources/` servent uniquement à **calibrer et vérifier le modèle de simulation** (agents IA, scripts de génération). Elles ne sont jamais chargées en production.

### Usage rapide

1. Placer les chunks locaux dans `tools/rag/chunks/ipcc_chunks.jsonl`.
2. Lancer `npm run rag:build-index`.
3. Les artefacts de recherche sont écrits dans `tools/rag/index/`.

L'index RGAA se construit directement depuis le fichier source versionné :

```bash
npm run rag:build-index:rgaa   # à relancer après chaque clone
```

Pour chercher dans les deux index :

```bash
npm run rag:search -- "carbon tax emissions reduction" --top 5  # index GIEC
npm run rag:search:rgaa -- "canvas role img aria-label" --top 3  # index RGAA
```

Pour régénérer les résumés CSV : `node scripts/generate-dataset-summaries.mjs`

Un exemple de format IPCC est disponible dans `tools/rag/examples/ipcc_chunks.example.jsonl`.

---

## Pipeline pré-commit

À chaque `git commit`, le hook vérifie si la validation IA est activée.

**Par défaut (sans flag)**, les checks IA sont ignorés — pas de consommation de crédits :

```
🔒 Pré-commit — validation IA désactivée  (AI_VALIDATION=1 pour activer)
```

**Pour activer la validation IA** sur un commit spécifique (modifications de données climatiques ou composants UI) :

```bash
AI_VALIDATION=1 git commit -m "..."
```

Les deux checks s'exécutent alors sur le diff stagé :

| Check | Condition de déclenchement | Bloquant |
|---|---|---|
| **GIEC** | Diff contient des données climatiques (CO₂, température, projections…) | Oui, si `🔴 CRITICAL` |
| **A11Y** | Diff modifie des fichiers `.vue` ou composants UI | Oui, si `🔴 CRITICAL` |

Les checks appellent `claude -p` avec le diff + contexte RAG. Si Claude Code est indisponible ou en timeout, le commit n'est **pas bloqué**.

```bash
git commit --no-verify   # contourner en cas d'urgence
```

Voir `tools/pre-commit/` pour le code des vérifications.

---

Certains noms de fichiers dans `tools/rag/data_sources/` dépassent 260 caractères (limite Windows). Avant de faire `git add`, exécuter une fois par clone :

```bash
git config core.longpaths true
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
│   ├── mitigationPolicies.ts  # Politiques climatiques, projections, prérequis
│   ├── ballots.ts             # Scrutin initial pré-seedé
│   ├── policyDetails.ts       # Descriptions étendues et références GIEC
│   ├── systemicGraph.ts       # 19 nœuds, 61 arêtes, 5 boucles (Cytoscape)
│   ├── tippingPoints.ts       # 5 points de bascule avec seuils de déclenchement
│   ├── ipccQuotes.ts          # Citations GIEC AR6
│   └── models/                # Modèles d'impact JSON (SSP2-4.5)
├── i18n/
│   ├── index.ts               # Configuration vue-i18n (détection locale navigateur)
│   ├── locales/
│   │   ├── fr.ts              # Traductions françaises (source de vérité)
│   │   └── en.ts              # Traductions anglaises
│   └── policies/
│       └── en.ts              # Titres et descriptions des politiques en anglais
├── services/
│   ├── data.service.ts        # Façade données (local → APIs futures)
│   ├── blockchain.service.ts  # Abstraction Web3 (stub ethers.js)
│   └── llm.service.ts         # Abstraction LLM prospectif (stub Claude)
├── store/
│   ├── game.store.ts          # Année de jeu, phases de tour, intro/règles, reset
│   ├── planets.store.ts       # Limites planétaires + horizon temporel
│   ├── mitigationPolicies.store.ts  # Vote Condorcet, propositions de bulletin, rôle admin
│   ├── simulation.store.ts    # Moteur de projection (CO₂, température, forêt, énergie, sociétal)
│   ├── tippingPoints.store.ts # Détection et persistance des bascules déclenchées
│   └── dashboard.store.ts     # Widgets personnalisables
├── composables/
│   ├── useContrastMode.ts     # Mode fort contraste (localStorage)
│   ├── useLocalizedPolicies.ts  # Titres/descriptions localisés des politiques
│   └── usePrerequisites.ts    # Vérification des prérequis de politiques
├── utils/
│   ├── condorcet.ts           # Algorithme Condorcet + départage Borda
│   └── timeSeries.ts          # interpolateAtYear, blendedAtYear, shiftedDeltas
├── components/
│   ├── charts/
│   │   ├── LineChart.vue      # Courbes multi-datasets — légende cliquable, marqueurs d'événements
│   │   ├── BarChart.vue
│   │   ├── RadarChart.vue     # Radar 9 limites (formes par statut)
│   │   ├── GaugeChart.vue
│   │   ├── VotePieChart.vue
│   │   └── ChartSkeleton.vue
│   ├── layout/
│   │   ├── AppHeader.vue      # Nav, phase de tour, bouton Voter, zone Admin conditionnelle
│   │   ├── AppFooter.vue
│   │   ├── AppTicker.vue
│   │   ├── AppLoadingBar.vue
│   │   ├── AppSearch.vue
│   │   ├── AppLangToggle.vue
│   │   ├── AppContrastToggle.vue
│   │   ├── AppTooltip.vue
│   │   ├── CollapsibleSection.vue
│   │   ├── EbCard.vue
│   │   ├── GameIntroOverlay.vue   # Écran d'introduction (dialog plein écran)
│   │   ├── GameRulesOverlay.vue   # Règles du jeu après intro (même format)
│   │   └── SectionTitle.vue
│   ├── dashboard/
│   │   ├── EcologicalIndicators.vue
│   │   ├── SocietalIndicators.vue
│   │   ├── WidgetCustomizer.vue
│   │   └── widgets/
│   ├── simulator/
│   │   └── SimProjectionCharts.vue  # Graphiques de projection (CO₂, T°, forêt, énergie)
│   ├── limits/
│   │   └── PlanetaryLimitCard.vue
│   ├── TippingPointModal.vue
│   └── mitigationPolicies/
│       ├── PolicyNetworkGraph.vue  # Réseau de politiques (prérequis, propositions de bulletin)
│       ├── VoteCard.vue
│       ├── BlockchainPanel.vue
│       └── ProspectivePanel.vue
├── views/
│   ├── DashboardView.vue      # Vue synthétique (indicateurs + scrutin)
│   ├── LimitsView.vue         # Radar global + 9 fiches détaillées
│   ├── PolitiquesView.vue     # Bulletin en formation, vote Condorcet, historique
│   ├── PolicyDetailView.vue   # Fiche détaillée d'une politique
│   ├── RulesView.vue          # Règles du jeu
│   ├── SimulateurView.vue     # Simulateur de politiques climatiques
│   ├── TippingPointsView.vue  # Cartes des 5 points de bascule
│   ├── SystemicMapView.vue    # Carte systémique (Cytoscape.js)
│   ├── GameEndView.vue        # Bilan multidimensionnel 2100
│   └── CorrelationsView.vue   # Placeholder
└── router/index.ts
```

---

## Mécanique de jeu

### Phases de tour

Chaque tour représente **5 ans** et suit une machine à états à trois phases :

```
discussion → vote → résultats → (nouveau tour)
```

| Phase | Qui peut agir | Ce qui se passe |
|---|---|---|
| `discussion` | Admin | Sélection des 3 politiques candidates, délibération libre |
| `vote` | Tous | Classement par préférence (1er / 2e / 3e) soumis anonymement |
| `résultats` | Admin | Clôture du vote, adoption du gagnant, avancement de l'année |

### Propositions de bulletin (Option C + fallback B)

En phase de discussion, le facilitateur (rôle Admin) choisit jusqu'à 3 politiques dans le réseau de politiques via un bouton **Proposer/Retirer**. Un plateau "Bulletin en formation" dans la page Politiques affiche les 3 slots en temps réel.

Au lancement du vote, `startVote()` crée le bulletin :
- Si 3 politiques ont été proposées → **Option C** : ces 3 politiques sont soumises au vote
- Sinon → **Option B fallback** : 3 politiques éligibles sélectionnées aléatoirement

### Vote Condorcet

Le gagnant est la politique qui bat toutes les autres en **duels directs** (comparaisons pairwise). En cas de cycle (paradoxe de Condorcet), un **score de Borda** départage. Le résultat est intégré au modèle de projection climatique.

### Rôle Admin

Le rôle Admin conditionne l'affichage de la zone Admin dans le header **et** la capacité à proposer des politiques au bulletin. Pour le POC, le rôle est attribué systématiquement (pas d'identity provider). Le champ `isAdmin` dans `mitigationPolicies.store.ts` suffit à basculer le comportement.

### Points de bascule

Cinq seuils climatiques critiques (température ou couverture forestière) sont surveillés à chaque tour. Une fois franchis, ils sont irréversibles et apparaissent comme marqueurs rouges sur les graphiques de projection. L'admin peut les activer/désactiver.

### Fin de partie

La partie se termine en 2100. Le bilan (`/bilan-2100`) évalue trois piliers : **Climat & Écosystèmes** (40 %), **Sociétal** (40 %), **Énergie & Ressources** (20 %).

---

## Sections de l'application

### Dashboard (`/`)

Vue synthétique : indicateurs écologiques (CO₂, température, forêt, énergie, ressources) et sociétaux (sécurité alimentaire, eau, santé, inégalités). Widgets personnalisables persistés en localStorage.

### Limites Planétaires (`/limites-planetaires`)

Graphique radar des 9 limites + fiches individuelles avec évolution 1950–2024. Trois formes distinctes par statut : triangle (dépassé), carré (zone de risque), cercle (sûr).

### Politiques (`/mitigation-policies`)

- **Bulletin en formation** : 3 slots de proposition visibles en phase discussion (admin uniquement)
- **Scrutin actif** : classement Condorcet visible en phase vote et résultats
- **Réseau de politiques** : toutes les politiques avec leurs prérequis, bouton Proposer/Retirer en phase discussion
- **Historique** : scrutins clôturés avec matrices pairwise

### Règles du jeu (`/regles`)

Présentation des mécaniques de jeu (objectif, phases de tour, Condorcet, prérequis, bascules, rôle facilitateur, fin de partie). Affichée également sous forme d'overlay animé après l'écran d'introduction lors d'une nouvelle partie.

### Simulateur (`/simulateur`)

Simulateur de politiques climatiques basé sur les **modèles d'impact GIEC AR6** (baseline SSP2-4.5 — sans action : +4°C en 2100).

- **Catalogue / réseau** : politiques sélectionnables avec prérequis visualisés
- **Projections cumulées** : 4 graphiques (CO₂, T°, forêt, renouvelables) avec chips de visibilité
- **Points de bascule** : marqueurs rouges sur les graphiques à l'année de franchissement
- **Légende cliquable** : clic sur un dataset pour l'afficher/masquer
- **Deux modes** : Game (politiques validées verrouillées) et Libre

### Points de bascule (`/bascules`)

Cartes descriptives des 5 points de bascule (Pergélisol, Coraux, Amazonie, Banquise arctique, AMOC) avec seuil, description, effets permanents et citation GIEC. Triés : déclenchés en premier (ordre chronologique).

### Carte systémique (`/carte-systemique`)

Graphe causal interactif (Cytoscape.js) — 19 nœuds, 61 relations, 5 boucles de rétroaction surlignables. Convention : `positive` = aggravant, `negative` = bénéfique (point de vue humain).

### Bilan 2100 (`/bilan-2100`)

Portrait multidimensionnel de fin de partie sur trois piliers. Accessible à partir du menu une fois la partie terminée.

### Corrélations (`/correlations`)

Placeholder — superposition multi-indicateurs à venir.

---

## Accessibilité (RGAA 4.1.2)

- Skip link "Aller au contenu principal" + `#main-content tabindex="-1"` sur chaque vue
- `role="img"` + `aria-label` sur tous les canvas (Chart.js, Cytoscape)
- Formes distinctes par dataset (cercle, triangle, carré) — l'information ne repose pas uniquement sur la couleur
- `aria-pressed` sur les boutons bascule, `aria-live="polite"` sur les mises à jour dynamiques
- Navigation clavier complète des composants interactifs (graphe de politiques, simulateur)
- Mode fort contraste activable (`AppContrastToggle`)
- `@media (prefers-reduced-motion)` : animations désactivées
- `document.documentElement.lang` mis à jour au changement de langue
- Titres de page (`document.title`) mis à jour via `router.afterEach`
- Compatible à partir de **340 px** de largeur d'écran

---

## Intégrations futures

### Blockchain — EarthChain (Polygon PoS)

Voir [`src/services/blockchain.service.ts`](src/services/blockchain.service.ts).

Interface cible : `castVote`, `getVoteTally`, `validateDecision` + connexion MetaMask / WalletConnect.

### LLM prospectif — Claude API

Voir [`src/services/llm.service.ts`](src/services/llm.service.ts).

Le service appelle un **endpoint backend proxy** (ne jamais exposer la clé API côté client) :

```
POST /api/llm/prospective
Body: { decision, currentIndicators }
→ { optimistic, moderate, pessimistic }
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

- Changement climatique : 421 ppm CO₂ (seuil : 350 ppm — dépassé ×1,20)
- Érosion biodiversité : 100 E/MSY (seuil : 10 — dépassé ×10)
- Perturbation azote : 150 Tg N/an (seuil : 62 — dépassé ×2,42)
- Ozone stratosphérique : 284 UD (zone de risque — récupération en cours)
- Acidification des océans : Ω 2,82 (zone de risque)
- Utilisation eau douce : 2 600 km³/an (zone de risque — seuil : 4 000 km³/an)

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

### First-time setup (once per clone)

`npm install` automatically runs the `prepare` script, which configures `git core.hooksPath` to point to `.hooks/`. Pre-commit hooks are active immediately.

Build the RGAA accessibility index — required for automated accessibility checks:

```bash
npm run rag:build-index:rgaa
```

Generates a BM25 index from `tools/rag/data_sources/RGAA-v4.1.2.txt` (versioned file).
Index is written to `tools/rag/index/` (git-ignored; rebuild after each clone).

---

## Pre-commit Pipeline

At each `git commit`, the hook checks whether AI validation is enabled.

**By default (no flag)**, AI checks are skipped — no credits consumed:

```
🔒 Pré-commit — validation IA désactivée  (AI_VALIDATION=1 pour activer)
```

**To enable AI validation** on a specific commit (climate data or UI component changes):

```bash
AI_VALIDATION=1 git commit -m "..."
```

Both checks then run on the staged diff:

| Check | Trigger condition | Blocking |
|---|---|---|
| **GIEC** | Diff contains climate data (CO₂, temperature, projections…) | Yes, if `🔴 CRITICAL` |
| **A11Y** | Diff modifies `.vue` files or UI components | Yes, if `🔴 CRITICAL` |

Both checks call `claude -p` with the diff + RAG context. If Claude Code is unavailable or times out, the commit is **not blocked**.

```bash
git commit --no-verify   # bypass in emergencies
```

See `tools/pre-commit/` for the check implementation.

---

## Game Mechanics

### Turn phases

Each turn represents **5 years** and follows a three-phase state machine:

```
discussion → vote → results → (next turn)
```

| Phase | Who acts | What happens |
|---|---|---|
| `discussion` | Admin | Select 3 candidate policies, open deliberation |
| `vote` | Everyone | Submit ranked preferences (1st / 2nd / 3rd) anonymously |
| `results` | Admin | Close vote, adopt the winner, advance the year |

### Ballot proposals (Option C + fallback B)

During discussion, the facilitator (Admin role) selects up to 3 policies from the policy network via a **Propose/Remove** button. A "Ballot in formation" tray in the Policies page shows the 3 slots in real time.

When the vote starts, `startVote()` builds the ballot:
- If 3 policies have been proposed → **Option C**: those 3 policies go to the vote
- Otherwise → **Option B fallback**: 3 eligible policies are chosen at random

### Condorcet voting

The winner is the policy that beats all others in **head-to-head matchups** (pairwise comparisons). In the event of a cycle (Condorcet paradox), a **Borda score** breaks the tie. The adopted policy is fed into the climate projection model.

### Admin role

The Admin role gates both the Admin zone display in the header **and** the ability to propose policies for the ballot. For the POC, the role is granted systematically (no identity provider). The `isAdmin` ref in `mitigationPolicies.store.ts` controls this behaviour.

### Tipping points

Five critical climate thresholds (temperature or forest cover) are checked each turn. Once crossed they are irreversible and appear as red markers on projection charts. The admin can toggle them on or off.

### End of game

The game ends in 2100. The report (`/bilan-2100`) evaluates three pillars: **Climate & Ecosystems** (40%), **Societal** (40%), **Energy & Resources** (20%).

---

## Application Sections

### Dashboard (`/`)

Overview of ecological and societal indicators. Customisable widgets persisted in localStorage.

### Planetary Limits (`/limites-planetaires`)

Radar chart of all 9 limits + individual fact sheets (1950–2024). Three distinct shapes per status: triangle (exceeded), square (risk zone), circle (safe).

### Policies (`/mitigation-policies`)

- **Ballot in formation**: 3 proposal slots visible during discussion phase (admin only)
- **Active ballot**: Condorcet ranked-choice voting during vote and results phases
- **Policy network**: all policies with prerequisites, Propose/Remove button during discussion
- **History**: closed ballots with pairwise matrices

### Game Rules (`/regles`)

Full breakdown of game mechanics (objective, turn phases, Condorcet method, prerequisites, tipping points, facilitator role, end of game). Also shown as an animated overlay after the intro screen on a new game.

### Simulator (`/simulateur`)

Climate policy simulator based on **IPCC AR6 impact models** (SSP2-4.5 baseline — no action: +4°C by 2100).

- **Catalogue / network**: selectable policies with visualised prerequisites
- **Cumulative projections**: 4 charts (CO₂, temperature, forest, renewables) with visibility chips
- **Tipping points**: red markers on charts at the year each threshold is crossed
- **Clickable legend**: click any dataset entry to show/hide it
- **Two modes**: Game (validated policies locked) and Free

### Tipping Points (`/bascules`)

Descriptive cards for all 5 tipping points (Permafrost, Coral, Amazon, Arctic sea ice, AMOC) with trigger threshold, description, permanent effects and IPCC quote. Triggered points listed first (chronologically).

### Systemic Map (`/carte-systemique`)

Interactive causal graph (Cytoscape.js) — 19 nodes, 61 relationships, 5 highlightable feedback loops. Convention: `positive` = aggravating, `negative` = beneficial (human perspective).

### Report 2100 (`/bilan-2100`)

Multidimensional end-of-game portrait across three pillars. Accessible from the menu once the game is over.

### Correlations (`/correlations`)

Placeholder — multi-indicator overlay feature coming soon.

---

## Accessibility (RGAA 4.1.2 / WCAG AA)

- Skip link + `#main-content tabindex="-1"` on every view
- `role="img"` + `aria-label` on all canvas elements (Chart.js, Cytoscape)
- Distinct shapes per dataset — information is not conveyed by colour alone
- `aria-pressed` on toggle buttons, `aria-live="polite"` on dynamic updates
- Full keyboard navigation of all interactive components
- Activatable high contrast mode (`AppContrastToggle`)
- `@media (prefers-reduced-motion)`: animations disabled
- `document.documentElement.lang` updated on locale change
- Page titles (`document.title`) updated via `router.afterEach`
- Responsive down to **340 px** screen width

---

## Planned Integrations

### EarthChain Blockchain (Polygon PoS)

See [`src/services/blockchain.service.ts`](src/services/blockchain.service.ts).

Target interface: `castVote`, `getVoteTally`, `validateDecision` + MetaMask / WalletConnect.

### Prospective LLM — Claude API

See [`src/services/llm.service.ts`](src/services/llm.service.ts).

The service calls a **backend proxy endpoint** (never expose the API key client-side):

```
POST /api/llm/prospective
Body: { decision, currentIndicators }
→ { optimistic, moderate, pessimistic }
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
