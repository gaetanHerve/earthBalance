# Data files — src/data/

Static source-of-truth files (no API, all fictional/educational):

- `mitigationPolicies.ts` — 30 policies (`dec-01` to `dec-31`, `dec-06` absent). Each policy has `projections` with `{ labels, co2, temperature, forest? }` — `labels` is the 16-point uniform grid `[2025, …, 2100]` (same as `SIM_LABELS`). Each data key is `{ baseline: number[], decided: number[], pessimist: number[] }` (16 values). Values after 2074 are flat placeholders — to be replaced during SSP3-7.0 recalibration. Each policy has an optional `prerequisites` field (`policiesRequired`, `policiesExcluded`, `indicators`).
- `systemicGraph.ts` — 19 nodes + 61 edges + 5 feedback loops for the Cytoscape causal graph. **Edge type semantics**: `positive` = "aggravant" (worsens from humanity's perspective), `negative` = "bénéfique" (improves). This is **not** standard graph sign convention.
- `tippingPoints.ts` — 5 tipping point definitions with trigger variable (`temp` | `forest`) and threshold value. Evaluated reactively by `tippingPoints.store`.
- `planetaryLimits.ts`, `societalIndicators.ts`, `ballots.ts`, `ipccQuotes.ts`

## Évolutions des données

- **Ajouter un indicateur sociétal** : étendre `SocietalKey` dans `src/types/index.ts`, ajouter la baseline dans `baselines.config.ts` et l'alias dans `simulation.store.ts`, ajouter les deltas dans chaque politique de `mitigationPolicies.ts` (16 valeurs, alignées sur `SIM_LABELS`).
- **Ajouter une politique** : créer l'entrée dans `mitigationPolicies.ts` (id `dec-XX` unique), puis les traductions anglaises dans `src/i18n/policies/en.ts`.
- **Modifier le graphe systémique** : rappel — `positive` = aggravant, `negative` = bénéfique (point de vue humain). Ne pas inverser cette convention.
- **Ajouter un point de bascule** : créer une entrée dans `tippingPoints.ts` avec `trigger.variable` (`'temp'` ou `'forest'`) et `trigger.threshold`, puis ajouter les clés i18n dans `fr.ts` / `en.ts` sous le namespace `tipping.<id>.*`.
