# Orchestrateur — Audit GIEC AR6 complet earthBalance

Date : 2026-07-01

## Mission

Analyser la cohérence scientifique GIEC AR6 de l'application earthBalance scope par scope, puis produire une synthèse globale consolidée.

## Fichiers contextes générés (11 scopes)

Chaque fichier contient : les fichiers source TypeScript/Vue du scope + les extraits RAG pertinents de l'index GIEC AR6 local + les instructions d'audit structurées.

1. `tools/giec-expert-audits/giec-audit-context-page-simulateur.md` — Simulateur — projections CO₂/température/forêt
2. `tools/giec-expert-audits/giec-audit-context-page-limites.md` — Limites planétaires
3. `tools/giec-expert-audits/giec-audit-context-page-dashboard.md` — Dashboard — indicateurs écologiques et sociétaux
4. `tools/giec-expert-audits/giec-audit-context-page-basculement.md` — Points de bascule
5. `tools/giec-expert-audits/giec-audit-context-page-bilan.md` — Bilan 2100
6. `tools/giec-expert-audits/giec-audit-context-page-overview.md` — Vue d'ensemble
7. `tools/giec-expert-audits/giec-audit-context-chart-SimProjectionCharts.md` — Graphes de projection CO₂/température/forêt
8. `tools/giec-expert-audits/giec-audit-context-chart-RadarChart.md` — Radar des limites planétaires
9. `tools/giec-expert-audits/giec-audit-context-chart-HubNodeChart.md` — Hub indicateurs temporels
10. `tools/giec-expert-audits/giec-audit-context-chart-EcologicalIndicators.md` — Indicateurs écologiques
11. `tools/giec-expert-audits/giec-audit-context-chart-SocietalIndicators.md` — Indicateurs sociétaux

## Workflow recommandé

### Option A — Agents parallèles (recommandé, plus rapide)

Lancer simultanément un sous-agent `giec-expert` par fichier contexte.
Chaque sous-agent reçoit le contenu du fichier contexte comme prompt.
Collecter les 11 rapports, puis produire la synthèse ci-dessous.

Exemple d'instruction à l'agent IDE :
> "Lance 11 sous-agents giec-expert en parallèle, un par fichier dans tools/giec-expert-audits/giec-audit-context-*.md, puis consolide les résultats."

### Option B — Séquentiel (agent unique)

Pour chaque fichier contexte dans l'ordre ci-dessus :
1. Lire le fichier
2. Appeler le sous-agent `giec-expert` avec son contenu
3. Collecter le rapport
Puis produire la synthèse.

## Format de synthèse attendu

```markdown
# Synthèse GIEC AR6 — earthBalance — 2026-07-01

## Vue d'ensemble
[Paragraphe : état général de la cohérence AR6 de l'application]

## Points validés (consolidés)
[Liste des points confirmés cohérents sur l'ensemble des scopes]

## Points nécessitant attention (consolidés)
[Liste dédupliquée et priorisée des ⚠️ WARNING issus de tous les scopes]

## Incohérences critiques (consolidées)
[Liste dédupliquée des 🔴 CRITICAL — si aucune : "Aucune incohérence critique détectée."]

## Matrice par scope
| Scope | ✅ | ⚠️ | 🔴 |
|---|---|---|---|
[Une ligne par scope avec le nombre de points par catégorie]

## Sources GIEC AR6 citées
[Union des sources citées dans tous les rapports, dédupliquées]
```

