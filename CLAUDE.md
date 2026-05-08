# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server (Vite)
npm run typecheck  # vue-tsc --noEmit (run after every change)
npm run build      # typecheck + production build
npm run preview    # Preview production build
```

No test suite exists. `npm run typecheck` is the only automated correctness check — always run it before considering a task done.

## Architecture

**Stack**: Vue 3 (Composition API) · TypeScript · Pinia · vue-i18n · Vue Router (hash history) · Tailwind CSS · Chart.js/vue-chartjs · Cytoscape.js

**Entry point**: `src/main.ts` → mounts App, registers Pinia, Router, i18n.

### Config layer (`src/config/`)

Three small config files that are imported by multiple stores and components:

| File | Content |
|---|---|
| `game.config.ts` | `GAME_CONFIG { grain: 5 }` — years per turn |
| `simulation.config.ts` | `SIM_LABELS` (10 output points) and `PROJ_LABELS` (9 input points) — **import from here, not from `simulation.store`** |
| `storageKeys.ts` | `STORAGE_KEYS` enum — all `localStorage` key strings in one place |

### Store layer (`src/store/`)

Five Pinia stores with clear responsibilities:

| Store | Role |
|---|---|
| `game.store.ts` | Game year, `endRound()`, `resetGame()` — orchestrates the other stores |
| `mitigationPolicies.store.ts` | Ballot lifecycle, Condorcet/Borda voting, validated policy list. Persists to `localStorage` (`eb_policies_state`) |
| `simulation.store.ts` | Projection engine — computes cumulative CO₂/temperature/societal curves from validated + user-selected policies. Persists to `localStorage` (`eb_simulation_selected`, `eb_simulation_baseline_mode`) |
| `tippingPoints.store.ts` | Watches `simulation.store` projections; triggers and persists tipping point crossings. Persists to `localStorage` (`eb_tipping_state`) |
| `dashboard.store.ts` / `planets.store.ts` | Read-only wrappers over static data files |

### Projection engine (`simulation.store.ts`)

**Critical constants** — defined in `src/config/simulation.config.ts`, imported everywhere:
- `SIM_LABELS = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074, 2100]` — 10 points, all computed outputs
- `PROJ_LABELS = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]` — 9 points, policy delta inputs (no 2100)

**Delta model**: all projections are additive. Each policy contributes `delta[i] = decided[i] − baseline[i]`. No inter-policy interactions are modelled (documented limitation).

**Key helper functions**:
- `shiftedDeltas(projLabels, projValues, projBaseline, effectiveStart)` — temporally aligns a policy's effect curve to its real adoption year
- `shiftedDeltasDirect(projDeltas, effectiveStart)` — same but when deltas are pre-computed (used for societal/energy/resource indicators)
- `blendedAtYear(year, decided, pessimist)` — linear blend of decided/pessimist at `BLEND = 0.5`
- `interpolateAtYear(year, labels, values)` — linear interpolation within a time series
- `effectiveStartOf(decId)` — `validatedPolicyMeta[id].year + implementationLag`

**Two simulator modes**:
- **Game mode** (`includeGameBaseline = true`): locked validated policies prepended in adoption order, user can append more
- **Free mode** (`includeGameBaseline = false`): all policies freely orderable, no locked positions

### Data files (`src/data/`)

Static source-of-truth files (no API, all fictional/educational):
- `mitigationPolicies.ts` — 8 policies (`dec-01` to `dec-17`, non-contiguous IDs). Each policy has `projections` with `{ co2, temperature, forest?, energyMix?, resources?, societal? }` — each sub-key is `{ baseline: number[], decided: number[], pessimist: number[] }` on `PROJ_LABELS` (9 points), except `societal` which stores pre-computed deltas as `{ decided: number[], pessimist: number[] }`.
- `systemicGraph.ts` — 19 nodes + 61 edges + 5 feedback loops for the Cytoscape causal graph. **Edge type semantics**: `positive` = "aggravant" (worsens from humanity's perspective), `negative` = "bénéfique" (improves). This is **not** standard graph sign convention.
- `tippingPoints.ts` — 5 tipping point definitions with trigger variable (`temp` | `forest`) and threshold value. Evaluated reactively by `tippingPoints.store`.
- `planetaryLimits.ts`, `societalIndicators.ts`, `ballots.ts`, `ipccQuotes.ts`

### Voting system (`src/utils/condorcet.ts`)

3-candidate ranked-choice ballots. Pairwise vote counts stored as `PairwiseVotes { ab, ba, ac, ca, bc, cb }`. Winner determined by Condorcet method; cycles broken by Borda score.

### i18n (`src/i18n/`)

Two locales: `fr` (primary, source of truth) and `en`. **Policy content** follows a split pattern:
- French policy text lives in `src/data/mitigationPolicies.ts`
- English policy text lives in `src/i18n/policies/en.ts` (merged at runtime by `useLocalizedPolicies` composable)
- All other UI strings live in `src/i18n/locales/{fr,en}.ts`

Locale auto-detected from `navigator.language`, persisted in `localStorage` (`eb-locale`).

### Tailwind custom palette

```
eb-dark   #0a0f1e    eb-card   #111827    eb-border #1f2d3d
eb-deep   #060d18    eb-mid    #0d1b2a
eb-green  #00ff88    eb-cyan   #00e5ff    eb-red    #ff5050
```

Cytoscape graph uses: orange `#fb923c` (physical nodes), green `#00ff88` (ecosystem), cyan `#00e5ff` (societal).

### Unimplemented stub

`src/services/llm.service.ts` is a documented stub. It needs a backend proxy before the Anthropic API key can be wired in — never call the API directly from the client.

## Key conventions

- **Always run `npm run typecheck`** after changes. The build will fail otherwise.
- **Add new societal indicators** by extending `SocietalKey` in `src/types/index.ts`, adding a baseline array in `simulation.store.ts`, and adding delta arrays to each policy in `mitigationPolicies.ts` (9 values, matching `PROJ_LABELS`).
- **Add a new policy** by creating a new entry in `mitigationPolicies.ts` with a unique `dec-XX` id, then adding English translations in `src/i18n/policies/en.ts`.
- `EbCard` is the standard card wrapper. Use `role="img"` + `:aria-label` on Cytoscape containers.
- The game clock advances in 5-year increments (`GAME_CONFIG.grain = 5`). Simulation adoption years are computed as `SIM_BASE_YEAR + index * grain`.

## Accessibilité (RGAA 4.1.2)

L'application doit être conforme au RGAA 4.1.2. Le référentiel complet est disponible dans `data_sources/RGAA-v4.1.2.txt`.

### Patterns déjà en place (à conserver)

| Pattern | Où | Critère RGAA |
|---|---|---|
| Skip link `sr-only focus:not-sr-only` | `App.vue` | 12.7 |
| `#main-content` avec `tabindex="-1"` | `App.vue` | 12.7 |
| `role="img"` + `:aria-label` sur le canvas Cytoscape | `SystemicMapView.vue` | 1.1 |
| `aria-hidden="true"` sur les icônes FA et SVGs décoratifs | partout | 1.2 |
| `:aria-label` sur les canvas Chart.js | `LineChart.vue` | 1.1 |
| `role="progressbar"` + `aria-valuenow/min/max` | `VoteCard.vue` | 4.1 |
| `role="status"` + `aria-live="polite"` sur les mises à jour dynamiques | `VoteCard.vue` | 7.4 |
| `aria-pressed` sur les boutons bascule | `SystemicMapView.vue` | 11.4 |
| `role="complementary"` sur les panneaux latéraux | `SystemicMapView.vue` | 12.1 |
| `<html lang="fr">` | `index.html` | 8.3 |

### Zones à risque — vérifier à chaque modification

- **Graphe Cytoscape** : le canvas n'est pas navigable au clavier. Le `role="img"` avec `aria-label` est le minimum requis. Si on ajoute une interaction clavier, utiliser `cytoscape.on('keydown')` et gérer `tabindex` sur l'élément conteneur.
- **Changement de langue** : quand la locale bascule en anglais, l'attribut `lang` de `<html>` reste `fr`. Mettre à jour `document.documentElement.lang` dans le composable de changement de langue (critère 8.3).
- **Titres de page** : `document.title` est mis à jour via un `router.afterEach` dans `router/index.ts` (résolu).
- **Contrastes** : les textes sur fond `#111827` doivent avoir un ratio ≥ 4.5:1 (critère 3.2). `#00ff88` sur `#111827` passe (8.5:1), `#00e5ff` passe (8.1:1), mais les textes gris pâle (`text-slate-400` = `#94a3b8`) donnent ~3.7:1 — **en dessous du seuil** pour du texte de taille normale.
- **Panneaux dynamiques** : quand un panneau s'ouvre (ex. panneau nœud dans `SystemicMapView.vue`), déplacer le focus vers le bouton de fermeture ou le titre du panneau (critère 7.3).
- **Éléments interactifs** : tout `<button>` doit avoir un intitulé accessible — vérifier que les icônes seules ont un `aria-label` ou un `<span class="sr-only">`.

### Règles à respecter lors de l'ajout de nouvelles features

- Tout canvas (Chart.js, Cytoscape) → `role="img"` + `aria-label` explicite ou `aria-labelledby`.
- Tout état dynamique (chargement, résultats, erreurs) → `role="status"` ou `aria-live="polite"` sur la zone de mise à jour.
- Toute couleur porteuse d'information → doubler avec un pictogramme, un motif ou un texte (jamais couleur seule — critère 3.1). Exemple : types d'arêtes du graphe systémique = couleur + style de ligne + forme de flèche.
- Tout nouveau composant interactif → navigable au clavier (`Tab` / `Shift+Tab`, `Enter` / `Space`, flèches si widget ARIA composite).

## Maintenabilité

### Conventions TypeScript

- `npm run typecheck` est l'unique filet de sécurité automatisé — toujours l'exécuter avant de déclarer une tâche terminée.
- Pas de `as any`. Préférer des types union explicites ou des guards plutôt que des casts.
- Les types partagés entre composants et stores vivent dans `src/types/index.ts`.

### Bonnes pratiques impératives

- **Pas de `setTimeout` comme approximation de timing DOM.** Si du code doit attendre qu'un élément ait ses dimensions finales, utiliser `ResizeObserver`. Si du code doit attendre un rendu Vue, utiliser `nextTick` + `requestAnimationFrame`. Les valeurs de délai arbitraires sont fragiles et non portables.
- Préférer systématiquement les événements réels aux approximations temporelles : `ResizeObserver` pour les dimensions, `MutationObserver` pour les mutations DOM, callbacks explicites pour les états asynchrones.

### Conventions i18n

- Le français est la langue source. Ajouter d'abord dans `src/i18n/locales/fr.ts`, puis dans `en.ts` en miroir.
- Exception : le contenu narratif des politiques (description, effets) → français dans `src/data/mitigationPolicies.ts`, anglais dans `src/i18n/policies/en.ts`.
- Ne jamais mettre de chaîne UI en dur dans un template — toujours passer par `t('clé')`.

### Conventions composants

- `EbCard` est le wrapper de carte standard — ne pas recréer de variante one-off.
- Les composants de graphique (`LineChart`, `RadarChart`, etc.) sont des wrappers fins sur vue-chartjs ; la logique de calcul reste dans le store, pas dans le composant.
- Un composant ne doit pas appeler directement `localStorage` — passer par les stores.

### Évolutions des données

- **Ajouter un indicateur sociétal** : étendre `SocietalKey` dans `src/types/index.ts`, ajouter la baseline dans `simulation.store.ts`, ajouter les deltas dans chaque politique de `mitigationPolicies.ts` (9 valeurs, alignées sur `PROJ_LABELS`).
- **Ajouter une politique** : créer l'entrée dans `mitigationPolicies.ts` (id `dec-XX` unique), puis les traductions anglaises dans `src/i18n/policies/en.ts`.
- **Modifier le graphe systémique** : rappel — `positive` = aggravant (empire du point de vue humain), `negative` = bénéfique (améliore). Ne pas inverser cette convention.
- **Ajouter un point de bascule** : créer une entrée dans `tippingPoints.ts` avec `trigger.variable` (`'temp'` ou `'forest'`) et `trigger.threshold`, puis ajouter les clés i18n correspondantes dans `fr.ts` / `en.ts` sous le namespace `tipping.<id>.*`.
