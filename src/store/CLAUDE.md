# Store layer — src/store/

## Config layer (`src/config/`)

| File | Content |
|---|---|
| `game.config.ts` | `GAME_CONFIG { grain: 5 }` — years per turn |
| `simulation.config.ts` | `SIM_LABELS` (16 points, grille uniforme 5 ans 2025→2100) — **import from here, not from `simulation.store`** |
| `storageKeys.ts` | `STORAGE_KEYS` enum — all `localStorage` key strings in one place |

## Stores

| Store | Role |
|---|---|
| `game.store.ts` | Game year, turn phases (`startVote()`, `closeVote()`, `endRound()`, `resetGame()`), phase state machine `discussion → vote → résultats` |
| `mitigationPolicies.store.ts` | Ballot lifecycle, Condorcet/Borda voting, validated policy list. Persists to `localStorage` (`eb_policies_state`) |
| `simulation.store.ts` | Projection engine — computes cumulative CO₂/temperature/societal curves from validated + user-selected policies. Persists to `localStorage` (`eb_simulation_selected`, `eb_simulation_baseline_mode`) |
| `tippingPoints.store.ts` | Watches `simulation.store` projections; triggers and persists tipping point crossings. Persists to `localStorage` (`eb_tipping_state`) |
| `dashboard.store.ts` / `planets.store.ts` | Read-only wrappers over static data files |

## Projection engine (`simulation.store.ts`)

**Critical constants** — defined in `src/config/simulation.config.ts`, imported everywhere:
- `SIM_LABELS = [2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100]` — 16 points, grille uniforme 5 ans, tous les outputs calculés (y compris `projections.labels` dans `mitigationPolicies.ts`)

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
