# Composants — src/components/

## Conventions composants

- `EbCard` est le wrapper de carte standard — ne pas recréer de variante one-off.
- Les composants de graphique (`LineChart`, `RadarChart`, etc.) sont des wrappers fins sur vue-chartjs ; la logique de calcul reste dans le store, pas dans le composant.
- Un composant ne doit pas appeler directement `localStorage` — passer par les stores.

## i18n (`src/i18n/`)

Two locales: `fr` (primary, source of truth) and `en`. **Policy content** follows a split pattern:
- French policy text lives in `src/data/mitigationPolicies.ts`
- English policy text lives in `src/i18n/policies/en.ts` (merged at runtime by `useLocalizedPolicies` composable)
- All other UI strings live in `src/i18n/locales/{fr,en}.ts`

Locale auto-detected from `navigator.language`, persisted in `localStorage` (`eb-locale`).

Conventions :
- Le français est la langue source. Ajouter d'abord dans `fr.ts`, puis dans `en.ts` en miroir.
- Exception : contenu narratif des politiques → français dans `mitigationPolicies.ts`, anglais dans `src/i18n/policies/en.ts`.
- Ne jamais mettre de chaîne UI en dur dans un template — toujours passer par `t('clé')`.

## Tailwind custom palette

```
eb-dark   #0a0f1e    eb-card   #111827    eb-border #1f2d3d
eb-deep   #060d18    eb-mid    #0d1b2a
eb-green  #00ff88    eb-cyan   #00e5ff    eb-red    #ff5050
```

Cytoscape graph uses: orange `#fb923c` (physical nodes), green `#00ff88` (ecosystem), cyan `#00e5ff` (societal).

## Voting system (`src/utils/condorcet.ts`)

3-candidate ranked-choice ballots. Pairwise vote counts stored as `PairwiseVotes { ab, ba, ac, ca, bc, cb }`. Winner determined by Condorcet method; cycles broken by Borda score.

## Unimplemented stub

`src/services/llm.service.ts` is a documented stub. It needs a backend proxy before the Anthropic API key can be wired in — never call the API directly from the client.

## Accessibilité — patterns déjà en place (à conserver)

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
