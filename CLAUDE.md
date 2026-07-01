# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Detailed conventions live in subdirectory CLAUDE.md files: `src/store/`, `src/data/`, `src/components/`.

## Commands

```bash
npm run dev        # Dev server (Vite)
npm run typecheck  # vue-tsc --noEmit (run after every change)
npm run build      # typecheck + production build
npm run preview    # Preview production build
npm run giec:audit # GIEC AR6 consistency report (full app or --page / --chart scope)
```

No test suite exists. `npm run typecheck` is the only automated correctness check — always run it before considering a task done.

## Architecture

**Stack**: Vue 3 (Composition API) · TypeScript · Pinia · vue-i18n · Vue Router (hash history) · Tailwind CSS · Chart.js/vue-chartjs · Cytoscape.js

**Entry point**: `src/main.ts` → mounts App, registers Pinia, Router, i18n.

## Key conventions

- **Always run `npm run typecheck`** after changes. The build will fail otherwise.
- **No `as any`.** Prefer explicit union types or type guards. Shared types live in `src/types/index.ts`.
- **No `setTimeout` as a DOM timing approximation.** Use `ResizeObserver` for dimensions, `nextTick` + `requestAnimationFrame` for Vue renders.
- **Add new societal indicators** by extending `SocietalKey` in `src/types/index.ts`, adding a baseline array in `simulation.store.ts`, and adding delta arrays to each policy in `mitigationPolicies.ts` (9 values, matching `PROJ_LABELS`).
- **Add a new policy** by creating a new entry in `mitigationPolicies.ts` with a unique `dec-XX` id, then adding English translations in `src/i18n/policies/en.ts`.
- `EbCard` is the standard card wrapper. Use `role="img"` + `:aria-label` on Cytoscape containers.
- The game clock advances in 5-year increments (`GAME_CONFIG.grain = 5`). Simulation adoption years are computed as `SIM_BASE_YEAR + index * grain`.

## Accessibilité (RGAA 4.1.2)

Le référentiel complet : `tools/rag/data_sources/RGAA-v4.1.2.txt`.
Les patterns déjà en place sont documentés dans `src/components/CLAUDE.md`.

### Zones à risque — vérifier à chaque modification

- **Graphe Cytoscape** : non navigable au clavier. `role="img"` + `aria-label` requis. Interaction clavier → `cytoscape.on('keydown')` + `tabindex` sur le conteneur.
- **Changement de langue** : mettre à jour `document.documentElement.lang` (critère 8.3).
- **Contrastes** : ratio ≥ 4.5:1 sur fond `#111827`. `text-slate-400` (`#94a3b8`) → ~3.7:1 — **en dessous du seuil**.
- **Panneaux dynamiques** : déplacer le focus vers le bouton de fermeture à l'ouverture (critère 7.3).
- **Boutons icône seule** : `aria-label` ou `<span class="sr-only">` obligatoire.

### Règles pour les nouvelles features

- Canvas (Chart.js, Cytoscape) → `role="img"` + `aria-label` ou `aria-labelledby`.
- État dynamique → `role="status"` ou `aria-live="polite"`.
- Couleur porteuse d'information → doubler avec pictogramme, motif ou texte (critère 3.1).
- Composant interactif → navigable au clavier (`Tab`, `Enter`/`Space`, flèches si ARIA composite).

## Outils de validation (dev)

### Pipeline pré-commit

Les checks IA (GIEC + A11Y) sont **opt-in** — inactifs par défaut pour ne pas consommer de crédits sur chaque commit.

```bash
AI_VALIDATION=1 git commit -m "..."   # active les checks GIEC + A11Y
git commit -m "..."                   # commit sans validation IA
```

Bloquant uniquement si `🔴 CRITICAL` dans le rapport. Timeout ou CLI indisponible → non-bloquant.
Voir `tools/pre-commit/` pour l'implémentation.

### Audit GIEC à la demande

```bash
npm run giec:audit                          # audit complet (scope unique)
npm run giec:audit -- --per-scope           # audit approfondi — 11 scopes + synthèse
npm run giec:audit -- --page simulateur     # page spécifique
npm run giec:audit -- --chart RadarChart    # graphe spécifique
npm run giec:audit -- --output rapport.md   # + sauvegarde fichier
```

Pages : `simulateur`, `limites`, `dashboard`, `basculement`, `bilan`, `overview`
Graphes : `SimProjectionCharts`, `RadarChart`, `HubNodeChart`, `EcologicalIndicators`, `SocietalIndicators`

Backends LLM : `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY`. Sans clé, le prompt est exporté dans `giec-audit-prompt.md`.

#### Workflow dans l'IDE (sans clé API)

Depuis l'agent IDE, l'audit peut se faire sans clé API externe :

```bash
# Scope unique
npm run giec:audit -- --context-only --page simulateur
# → exporte giec-audit-context.md

# Audit approfondi — un fichier contexte par scope + orchestrateur
npm run giec:audit -- --context-only --per-scope
# → exporte 11 fichiers giec-audit-context-{type}-{name}.md
# → exporte giec-audit-orchestrator.md
```

Pour le scope unique : demander à l'agent *"Analyse giec-audit-context.md avec le sous-agent giec-expert."*

Pour l'audit complet : demander à l'agent *"Lis giec-audit-orchestrator.md et exécute le workflow qu'il décrit."*
L'orchestrateur instrumente l'agent pour lancer 11 sous-agents `giec-expert` en parallèle et produire la synthèse consolidée.

## Gamification — Feuille de route

**Philosophie** : pas de victoire/défaite binaire — portrait multidimensionnel du monde en 2100 par piliers (Climat, Écosystèmes, Énergie, Sociétal).

### Roadmap POC — toutes terminées

| # | Feature | Fichiers clés |
|---|---|---|
| 1 | Bilan 2100 | `GameEndView.vue`, `gameScore.ts`, route `/bilan-2100` |
| 2 | Arbre de politiques | `mitigationPolicies.ts` (champ `prerequisites`), `PolicyNetworkGraph.vue` |
| 3 | Phases de tour | `game.store.ts`, `game.config.ts` |
| 4 | Résultats de scrutin | `PolitiquesView.vue` |

### Prochaines étapes (au-delà du POC)

- **2b** — Arêtes politique → indicateurs dans le graphe systémique
- **2c** — Boucles de rétroaction entre politiques
- **3b** — Visualisation temporelle des phases de tour

### Bilan 2100 — piliers et pondération

- **Climat & Écosystèmes** (40 %) : température atteinte, points de bascule déclenchés, couverture forestière, limites planétaires franchies
- **Sociétal** (40 %) : sécurité alimentaire, accès à l'eau, santé, inégalités (Gini), migrations climatiques
- **Énergie & Ressources** (20 %) : part des renouvelables, ressources fossiles restantes

Catégorisation par indicateur : `'critical'` / `'warning'` / `'good'` (couleurs eb-red / orange / eb-green).
