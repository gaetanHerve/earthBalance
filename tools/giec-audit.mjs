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
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const AUDIT_DIR = join(ROOT, 'tools/giec-expert-audits')

// ── Scopes ────────────────────────────────────────────────────────────────────

const PAGE_SCOPES = {
  simulateur: {
    label: 'Simulateur — projections CO₂/température/forêt',
    files: [
      'src/config/simulation.config.ts',
      'src/store/simulation.store.ts',
      'src/data/mitigationPolicies.ts',
    ],
    ragQueries: ['CO2 emissions projection SSP3-7.0 baseline temperature warming mitigation high emissions'],
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
    ragQueries: ['CO2 emissions projection SSP3-7.0 baseline temperature warming mitigation high emissions'],
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
  const args = { page: null, chart: null, output: null, contextOnly: false, perScope: false }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--page' && argv[i + 1]) args.page = argv[++i]
    if (argv[i] === '--chart' && argv[i + 1]) args.chart = argv[++i]
    if (argv[i] === '--output' && argv[i + 1]) args.output = argv[++i]
    if (argv[i] === '--context-only') args.contextOnly = true
    if (argv[i] === '--per-scope') args.perScope = true
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
      'CO2 emissions projection SSP3-7.0 baseline temperature warming mitigation high emissions',
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

// ── LLM backends ─────────────────────────────────────────────────────────────

async function callLLM(prompt) {
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('[GIEC-AUDIT] Backend : Anthropic API')
    const model = process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-7'
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Anthropic API ${res.status}: ${body}`)
    }
    const data = await res.json()
    return data.content[0].text
  }

  if (process.env.OPENAI_API_KEY) {
    console.log('[GIEC-AUDIT] Backend : OpenAI API')
    const model = process.env.OPENAI_MODEL ?? 'gpt-4o'
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`OpenAI API ${res.status}: ${body}`)
    }
    const data = await res.json()
    return data.choices[0].message.content
  }

  return null
}

// ── Mode --per-scope ──────────────────────────────────────────────────────────

async function runPerScopeAudit(args) {
  const dateISO = new Date().toISOString().slice(0, 10)
  const allScopes = [
    ...Object.entries(PAGE_SCOPES).map(([name, s]) => ({ type: 'page', name, ...s })),
    ...Object.entries(CHART_SCOPES).map(([name, s]) => ({ type: 'chart', name, ...s })),
  ]

  const RUN_DIR = join(AUDIT_DIR, `audit_${dateISO}`)
  mkdirSync(RUN_DIR, { recursive: true })
  const reports = []

  for (let i = 0; i < allScopes.length; i++) {
    const scope = allScopes[i]
    console.log(`\n🔍 [GIEC-AUDIT] (${i + 1}/${allScopes.length}) ${scope.label}`)

    const sourceFiles = readSourceFiles(scope.files)
    const ragContext = buildRagContext(scope.ragQueries)
    const prompt = buildPrompt(scope, ragContext, sourceFiles)

    if (args.contextOnly) {
      const contextPath = join(RUN_DIR, `giec-audit-context-${scope.type}-${scope.name}.md`)
      writeFileSync(contextPath, prompt + '\n', 'utf-8')
      console.log(`   ✅ Contexte → ${contextPath}`)
      continue
    }

    let report
    try {
      report = await callLLM(prompt)
    } catch (err) {
      console.error(`   ❌ Erreur API : ${err.message}`)
      continue
    }

    if (report === null) {
      const promptPath = join(RUN_DIR, `giec-audit-prompt-${scope.type}-${scope.name}.md`)
      writeFileSync(promptPath, prompt + '\n', 'utf-8')
      console.log(`   ⚠️  Aucun backend LLM — prompt exporté → ${promptPath}`)
      continue
    }

    const reportPath = join(RUN_DIR, `${scope.type}-${scope.name}-${dateISO}.md`)
    writeFileSync(reportPath, report + '\n', 'utf-8')
    console.log(`   ✅ Rapport → ${reportPath}`)
    reports.push(report)
  }

  if (args.contextOnly) {
    const fileList = allScopes
      .map((s, i) => `${i + 1}. \`tools/giec-expert-audits/audit_${dateISO}/giec-audit-context-${s.type}-${s.name}.md\` — ${s.label}`)
      .join('\n')

    const orchestratorPrompt = `# Orchestrateur — Audit GIEC AR6 complet earthBalance

Date : ${dateISO}

## Mission

Analyser la cohérence scientifique GIEC AR6 de l'application earthBalance scope par scope, puis produire une synthèse globale consolidée.

## Fichiers contextes générés (${allScopes.length} scopes)

Chaque fichier contient : les fichiers source TypeScript/Vue du scope + les extraits RAG pertinents de l'index GIEC AR6 local + les instructions d'audit structurées.

${fileList}

## Workflow recommandé

### Option A — Agents parallèles (recommandé, plus rapide)

Lancer simultanément un sous-agent \`giec-expert\` par fichier contexte.
Chaque sous-agent reçoit le contenu du fichier contexte comme prompt.
Collecter les 11 rapports, puis produire la synthèse ci-dessous.

Exemple d'instruction à l'agent IDE :
> "Lance 11 sous-agents giec-expert en parallèle, un par fichier dans tools/giec-expert-audits/audit_${dateISO}/giec-audit-context-*.md, puis consolide les résultats."

### Option B — Séquentiel (agent unique)

Pour chaque fichier contexte dans l'ordre ci-dessus :
1. Lire le fichier
2. Appeler le sous-agent \`giec-expert\` avec son contenu
3. Collecter le rapport
Puis produire la synthèse.

## Format de synthèse attendu

\`\`\`markdown
# Synthèse GIEC AR6 — earthBalance — ${dateISO}

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
\`\`\`
`

    const orchestratorPath = join(RUN_DIR, 'giec-audit-orchestrator.md')
    writeFileSync(orchestratorPath, orchestratorPrompt + '\n', 'utf-8')

    console.log(`\n[GIEC-AUDIT] ✅ ${allScopes.length} contextes exportés dans ${RUN_DIR}`)
    console.log(`   📋 Orchestrateur → ${orchestratorPath}`)
    console.log('   Passez giec-audit-orchestrator.md à votre agent IDE pour lancer l\'audit.\n')
    process.exit(0)
  }

  if (reports.length === 0) process.exit(0)

  const summary = [
    '# Rapport GIEC complet — earthBalance',
    '',
    `Date : ${dateISO} — ${reports.length}/${allScopes.length} scopes analysés`,
    '',
    ...reports.flatMap(r => ['---', '', r, '']),
  ].join('\n')

  const summaryPath = join(RUN_DIR, `giec-audit-full-${dateISO}.md`)
  writeFileSync(summaryPath, summary + '\n', 'utf-8')
  console.log(`\n[GIEC-AUDIT] ✅ Rapport complet (${reports.length} scopes) → ${summaryPath}\n`)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.perScope) {
    await runPerScopeAudit(args)
    return
  }

  const scope = resolveScope(args)

  console.log(`\n🔍 [GIEC-AUDIT] Scope : ${scope.label}`)
  console.log(`   Fichiers : ${scope.files.length}`)
  console.log(`   Requêtes RAG : ${scope.ragQueries.length}\n`)

  console.log('[GIEC-AUDIT] Lecture des fichiers source...')
  const sourceFiles = readSourceFiles(scope.files)

  console.log('[GIEC-AUDIT] Requêtes RAG...')
  const ragContext = buildRagContext(scope.ragQueries)

  const prompt = buildPrompt(scope, ragContext, sourceFiles)

  if (args.contextOnly) {
    const contextPath = args.output
      ? resolve(ROOT, args.output)
      : join(AUDIT_DIR, 'giec-audit-context.md')
    mkdirSync(dirname(contextPath), { recursive: true })
    writeFileSync(contextPath, prompt + '\n', 'utf-8')
    console.log(`[GIEC-AUDIT] ✅ Contexte exporté → ${contextPath}`)
    console.log('   Passez ce fichier à votre agent IDE (sous-agent giec-expert) pour l\'analyse.\n')
    process.exit(0)
  }

  console.log('[GIEC-AUDIT] Analyse en cours (peut prendre 1-3 min)...\n')

  let report
  try {
    report = await callLLM(prompt)
  } catch (err) {
    console.error(`[GIEC-AUDIT] ❌ Erreur API : ${err.message}`)
    process.exit(1)
  }

  if (report === null) {
    const exportPath = args.output
      ? resolve(ROOT, args.output.replace(/\.md$/, '-prompt.md'))
      : join(AUDIT_DIR, 'giec-audit-prompt.md')
    mkdirSync(dirname(exportPath), { recursive: true })
    writeFileSync(exportPath, prompt + '\n', 'utf-8')
    console.log('[GIEC-AUDIT] ⚠️  Aucun backend LLM configuré.')
    console.log(`   Prompt exporté → ${exportPath}`)
    console.log('   Collez ce fichier dans Claude.ai, ChatGPT ou tout autre LLM.')
    console.log('   Pour activer un backend : définir ANTHROPIC_API_KEY ou OPENAI_API_KEY\n')
    process.exit(0)
  }

  const outputHeader = [
    '╔══════════════════════════════════════════════════════════╗',
    '║          RAPPORT GIEC — earthBalance                     ║',
    '╚══════════════════════════════════════════════════════════╝',
    '',
  ].join('\n')

  if (args.output) {
    const outputPath = resolve(ROOT, args.output)
    mkdirSync(dirname(outputPath), { recursive: true })
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

main().catch(err => {
  console.error('[GIEC-AUDIT] ❌', err.message)
  process.exitCode = 1
})
