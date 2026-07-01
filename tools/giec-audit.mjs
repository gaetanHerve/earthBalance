#!/usr/bin/env node
/**
 * tools/giec-audit.mjs
 *
 * Rapport détaillé de cohérence GIEC AR6 pour earthBalance.
 * Analyse les données climatiques de l'application et produit un rapport structuré.
 *
 * Usage :
 *   npm run giec:audit                          # audit complet
 *   npm run giec:audit -- --page simulateur     # page spécifique
 *   npm run giec:audit -- --chart RadarChart    # graphe spécifique
 *   npm run giec:audit -- --output rapport.md   # sortie fichier
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { findClaudeBin } from './pre-commit/find-claude.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Scopes ────────────────────────────────────────────────────────────────────

const PAGE_SCOPES = {
  simulateur: {
    label: 'Simulateur — projections CO₂/température/forêt',
    files: [
      'src/config/simulation.config.ts',
      'src/store/simulation.store.ts',
      'src/data/mitigationPolicies.ts',
    ],
    ragQueries: ['CO2 emissions projection SSP2-4.5 baseline temperature warming mitigation'],
  },
  limites: {
    label: 'Limites planétaires',
    files: ['src/data/planetaryLimits.ts', 'src/store/planets.store.ts'],
    ragQueries: ['planetary boundaries safe operating space overshoot thresholds'],
  },
  dashboard: {
    label: 'Dashboard — indicateurs écologiques et sociétaux',
    files: ['src/data/societalIndicators.ts', 'src/store/dashboard.store.ts'],
    ragQueries: ['food security water access health climate impact societal indicators'],
  },
  basculement: {
    label: 'Points de bascule',
    files: ['src/data/tippingPoints.ts', 'src/store/tippingPoints.store.ts'],
    ragQueries: ['tipping points thresholds temperature 1.5 2 degrees permafrost ice sheet'],
  },
  bilan: {
    label: 'Bilan 2100',
    files: ['src/views/GameEndView.vue', 'src/store/simulation.store.ts'],
    ragQueries: ['2100 temperature projection warming scenario end century outcomes'],
  },
  overview: {
    label: "Vue d'ensemble",
    files: ['src/store/simulation.store.ts', 'src/data/mitigationPolicies.ts'],
    ragQueries: ['CO2 emissions projection SSP2-4.5 baseline temperature warming mitigation'],
  },
}

const CHART_SCOPES = {
  SimProjectionCharts: {
    label: 'Graphes de projection CO₂/température/forêt',
    files: ['src/components/SimProjectionCharts.vue', 'src/store/simulation.store.ts'],
    ragQueries: ['CO2 emissions GtCO2 temperature projection SSP scenarios 2050 2100'],
  },
  RadarChart: {
    label: 'Radar des limites planétaires',
    files: ['src/components/RadarChart.vue', 'src/data/planetaryLimits.ts'],
    ragQueries: ['planetary boundaries safe operating space overshoot thresholds'],
  },
  HubNodeChart: {
    label: 'Hub indicateurs temporels',
    files: ['src/components/HubNodeChart.vue', 'src/store/simulation.store.ts'],
    ragQueries: ['climate indicators time series temperature emissions societal'],
  },
  EcologicalIndicators: {
    label: 'Indicateurs écologiques',
    files: ['src/components/EcologicalIndicators.vue', 'src/data/societalIndicators.ts'],
    ragQueries: ['ecological indicators forest cover biodiversity climate risk'],
  },
  SocietalIndicators: {
    label: 'Indicateurs sociétaux',
    files: ['src/components/SocietalIndicators.vue', 'src/data/societalIndicators.ts'],
    ragQueries: ['food security water access health inequality climate change impacts'],
  },
}

// ── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { page: null, chart: null, output: null }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--page' && argv[i + 1]) args.page = argv[++i]
    if (argv[i] === '--chart' && argv[i + 1]) args.chart = argv[++i]
    if (argv[i] === '--output' && argv[i + 1]) args.output = argv[++i]
  }
  return args
}

function resolveScope(args) {
  if (args.page) {
    const scope = PAGE_SCOPES[args.page]
    if (!scope) {
      console.error(`[GIEC-AUDIT] Page inconnue : "${args.page}"`)
      console.error(`Pages disponibles : ${Object.keys(PAGE_SCOPES).join(', ')}`)
      process.exit(1)
    }
    return { type: 'page', name: args.page, ...scope }
  }
  if (args.chart) {
    const scope = CHART_SCOPES[args.chart]
    if (!scope) {
      console.error(`[GIEC-AUDIT] Graphe inconnu : "${args.chart}"`)
      console.error(`Graphes disponibles : ${Object.keys(CHART_SCOPES).join(', ')}`)
      process.exit(1)
    }
    return { type: 'chart', name: args.chart, ...scope }
  }
  // Full audit
  const allFiles = [
    ...new Set([
      ...Object.values(PAGE_SCOPES).flatMap(s => s.files),
      ...Object.values(CHART_SCOPES).flatMap(s => s.files),
    ]),
  ]
  return {
    type: 'full',
    name: 'Application complète',
    label: 'Application complète — toutes les pages et graphes',
    files: allFiles,
    ragQueries: [
      'CO2 emissions projection SSP2-4.5 baseline temperature warming mitigation',
      'planetary boundaries tipping points thresholds permafrost ice sheet',
      'food security water access health inequality climate impacts 2100',
    ],
  }
}

// ── Lecture des fichiers source ───────────────────────────────────────────────

const FILE_CHAR_LIMITS = {
  'src/data/mitigationPolicies.ts': 4000,
}
const DEFAULT_FILE_LIMIT = 6000
const TOTAL_CHAR_LIMIT = 25000

function readSourceFiles(files) {
  const sections = []
  let totalChars = 0

  for (const relPath of files) {
    if (totalChars >= TOTAL_CHAR_LIMIT) {
      sections.push(`### ${relPath}\n[Fichier omis — limite totale atteinte]\n`)
      continue
    }

    const absPath = join(ROOT, relPath)
    if (!existsSync(absPath)) {
      sections.push(`### ${relPath}\n[Fichier introuvable]\n`)
      continue
    }

    const limit = FILE_CHAR_LIMITS[relPath] ?? DEFAULT_FILE_LIMIT
    const remaining = TOTAL_CHAR_LIMIT - totalChars
    const effectiveLimit = Math.min(limit, remaining)

    let content = readFileSync(absPath, 'utf-8')
    let truncated = false
    if (content.length > effectiveLimit) {
      content = content.slice(0, effectiveLimit)
      truncated = true
    }

    totalChars += content.length
    sections.push(
      `### ${relPath}\n\`\`\`typescript\n${content}${truncated ? '\n// [... tronqué]' : ''}\n\`\`\`\n`,
    )
  }

  return sections.join('\n')
}

// ── Contexte RAG ──────────────────────────────────────────────────────────────

function runRagQuery(query, top = 5) {
  const result = spawnSync(
    process.execPath,
    ['tools/rag/search.mjs', query, '--top', String(top), '--format', 'json'],
    { cwd: ROOT, encoding: 'utf-8', timeout: 30000 },
  )
  if (result.status !== 0 || !result.stdout) return []
  try {
    const data = JSON.parse(result.stdout)
    return data.results ?? []
  } catch {
    return []
  }
}

function buildRagContext(ragQueries) {
  const seen = new Set()
  const allResults = []

  for (const query of ragQueries) {
    const results = runRagQuery(query, 5)
    for (const r of results) {
      if (!seen.has(r.id)) {
        seen.add(r.id)
        allResults.push(r)
      }
    }
  }

  if (allResults.length === 0) {
    return '⚠️ Index RAG non disponible — lancer "npm run rag:build-index" si nécessaire.'
  }

  return allResults
    .map(r => {
      const breadcrumb = [r.report, r.chapter, r.section].filter(Boolean).join(' › ')
      return `[${breadcrumb}]:\n${r.text.slice(0, 400)}`
    })
    .join('\n\n---\n\n')
}

// ── Prompt ────────────────────────────────────────────────────────────────────

function buildPrompt(scope, ragContext, sourceFiles) {
  const dateISO = new Date().toISOString().slice(0, 10)

  return `Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Auditer la cohérence des données climatiques de l'application earthBalance avec les conclusions du GIEC AR6.

Scope analysé : ${scope.label}
Date : ${dateISO}

## Contexte GIEC — extraits de l'index RAG local

${ragContext}

## Fichiers source analysés

${sourceFiles}

## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec cette structure markdown, sans introduction ni texte avant le titre :

## Rapport GIEC — ${scope.label} — ${dateISO}

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
- Les données fictives ou pédagogiques peuvent s'écarter des valeurs réelles à condition d'être cohérentes avec les ordres de grandeur AR6.`
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2))
  const scope = resolveScope(args)

  console.log(`\n🔍 [GIEC-AUDIT] Scope : ${scope.label}`)
  console.log(`   Fichiers : ${scope.files.length}`)
  console.log(`   Requêtes RAG : ${scope.ragQueries.length}\n`)

  console.log('[GIEC-AUDIT] Lecture des fichiers source...')
  const sourceFiles = readSourceFiles(scope.files)

  console.log('[GIEC-AUDIT] Requêtes RAG...')
  const ragContext = buildRagContext(scope.ragQueries)

  const prompt = buildPrompt(scope, ragContext, sourceFiles)

  const claudeBin = findClaudeBin()
  if (!claudeBin) {
    console.error('[GIEC-AUDIT] ❌ claude CLI introuvable.')
    console.error('   Assurez-vous que Claude Code est installé.')
    process.exit(1)
  }

  console.log('[GIEC-AUDIT] Analyse en cours (peut prendre 1-3 min)...\n')

  const claudeResult = spawnSync(claudeBin, ['-p', prompt], {
    cwd: ROOT,
    encoding: 'utf-8',
    timeout: 180000,
    maxBuffer: 1024 * 1024 * 10,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (claudeResult.error || claudeResult.status === null) {
    console.error('[GIEC-AUDIT] ❌ Échec de l\'appel claude CLI.')
    if (claudeResult.error?.message) console.error('  ', claudeResult.error.message)
    process.exit(1)
  }

  const report = (claudeResult.stdout || '').trim()

  if (!report) {
    console.error('[GIEC-AUDIT] ❌ Réponse vide.')
    process.exit(1)
  }

  const outputHeader = [
    '╔══════════════════════════════════════════════════════════╗',
    '║          RAPPORT GIEC — earthBalance                     ║',
    '╚══════════════════════════════════════════════════════════╝',
    '',
  ].join('\n')

  if (args.output) {
    const outputPath = resolve(ROOT, args.output)
    writeFileSync(outputPath, report + '\n', 'utf-8')
    console.log(outputHeader)
    console.log(report)
    console.log(`\n[GIEC-AUDIT] ✅ Rapport écrit dans : ${args.output}\n`)
  } else {
    console.log(outputHeader)
    console.log(report)
    console.log()
  }
}

main()
