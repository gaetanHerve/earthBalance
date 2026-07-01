#!/usr/bin/env node
/**
 * Vérification de cohérence scientifique GIEC AR6.
 * Analyse le diff stagé à la recherche d'incohérences avec les données IPCC.
 *
 * Sortie :
 *   exit 0  — aucun problème critique
 *   exit 1  — incohérence critique détectée (🔴 CRITICAL dans le rapport)
 */
import { execSync, spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { findClaudeBin } from './find-claude.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')

// ── Diff stagé ────────────────────────────────────────────────────────────────

let diff = ''
let stagedFiles = []

try {
  diff = execSync('git diff --cached', { cwd: ROOT, encoding: 'utf-8' })
  stagedFiles = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf-8' })
    .trim().split('\n').filter(Boolean)
} catch {
  console.warn('[GIEC] Impossible de lire le diff — vérification ignorée.')
  process.exit(0)
}

if (!diff.trim()) process.exit(0)

// ── Pertinence climatique ─────────────────────────────────────────────────────

const CLIMATE_RE = [
  /\bco2\b/i, /co₂/, /\btemperature\b/i, /\btempérature\b/i,
  /\bemission/i, /\bforest\b/i, /\bforêt\b/i, /\btipping\b/i,
  /\bbaseline\b/i, /\bprojection\b/i, /\bscenario\b/i, /\bssp\b/i,
  /\bmitigation\b/i, /dec-\d+/i, /\brenewable/i, /\bcarbon\b/i,
  /\bclimate\b/i, /\bclimatique\b/i,
]

const climateFiles = stagedFiles.filter(f =>
  ['mitigationPolicies', 'simulation.store', 'tippingPoints', 'planetaryLimits', 'simulation.config']
    .some(n => f.includes(n))
)

const hasDiffClimateContent = CLIMATE_RE.some(re => re.test(diff))

if (!hasDiffClimateContent && climateFiles.length === 0) {
  console.log('✅ [GIEC] Aucune donnée climatique détectée — vérification ignorée.')
  process.exit(0)
}

console.log('🔍 [GIEC] Données climatiques détectées, analyse en cours...\n')

// ── Contexte RAG ──────────────────────────────────────────────────────────────

let ragContext = ''

const ragResult = spawnSync(
  process.execPath,
  ['tools/rag/search.mjs', 'CO2 emissions temperature projection SSP mitigation policy tipping point', '--top', '4', '--format', 'json'],
  { cwd: ROOT, encoding: 'utf-8', timeout: 30000 }
)

if (ragResult.status === 0 && ragResult.stdout) {
  try {
    const data = JSON.parse(ragResult.stdout)
    ragContext = data.results
      .map(r => {
        const breadcrumb = [r.report, r.chapter, r.section].filter(Boolean).join(' › ')
        return `[${breadcrumb}]: ${r.text.slice(0, 350)}`
      })
      .join('\n\n---\n\n')
  } catch { /* ignore parse errors */ }
}

if (!ragContext) {
  ragContext = '⚠️ Index RAG non disponible — analyse sans contexte GIEC sourcé.\nLancer "npm run rag:build-index" si l\'index n\'est pas encore construit.'
}

// ── Construction du prompt ────────────────────────────────────────────────────

const diffTruncated = diff.length > 8000
  ? diff.slice(0, 8000) + '\n\n[... diff tronqué à 8000 caractères ...]'
  : diff

const prompt = `Tu es un expert scientifique GIEC AR6 (WGI, WGII, WGIII, SYR).

MISSION : Analyser le diff git ci-dessous et vérifier la cohérence des données climatiques modifiées avec les conclusions du GIEC AR6.

Fichiers modifiés pertinents : ${climateFiles.length > 0 ? climateFiles.join(', ') : 'non identifiés'}

## Contexte GIEC — extraits de l'index RAG local

${ragContext}

## Diff à analyser

\`\`\`diff
${diffTruncated}
\`\`\`

## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec ce bloc, sans introduction ni explication supplémentaire :

## Rapport GIEC — Vérification pré-commit

🔴 CRITICAL: [incohérence scientifique grave : valeur numérique incompatible avec AR6, projection hors plage SSP2-4.5/SSP3-7.0, seuil de bascule non documenté]
🟡 WARNING: [vigilance : simplification excessive, nuance absente, source non citée dans le code]
✅ OK: [aspect vérifié et cohérent avec AR6]

Si aucune donnée scientifique climatique précise n'est présente dans le diff :
Réponds uniquement : "✅ OK: Aucune donnée climatique précise à vérifier dans ce diff."

Règle : ne jamais inventer de problème. Si tu n'as pas assez de contexte, utilise ⚠️ [Connaissance générale] et sois explicite sur l'incertitude.`

// ── Appel à claude CLI ────────────────────────────────────────────────────────

const claudeBin = findClaudeBin()
if (!claudeBin) {
  console.warn('[GIEC] ⚠️  claude CLI introuvable — vérification ignorée.')
  console.warn('   Assurez-vous que Claude Code est installé et que claude est dans PATH.')
  process.exit(0)
}

const claudeResult = spawnSync(claudeBin, ['-p', prompt], {
  cwd: ROOT,
  encoding: 'utf-8',
  timeout: 120000,
  maxBuffer: 1024 * 1024 * 5,
  stdio: ['ignore', 'pipe', 'pipe'],
})

if (claudeResult.error || claudeResult.status === null) {
  console.warn('[GIEC] ⚠️  claude CLI indisponible ou timeout — vérification ignorée.')
  if (claudeResult.error?.message) console.warn('       ', claudeResult.error.message)
  process.exit(0)
}

const report = (claudeResult.stdout || '').trim()

if (!report) {
  console.warn('[GIEC] ⚠️  Réponse vide de claude — vérification ignorée.')
  process.exit(0)
}

// ── Affichage du rapport ──────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════╗')
console.log('║       RAPPORT GIEC — Pré-commit          ║')
console.log('╚══════════════════════════════════════════╝\n')
console.log(report)

// ── Code de sortie ────────────────────────────────────────────────────────────

if (report.includes('🔴 CRITICAL')) {
  console.log('\n❌ [GIEC] Incohérences critiques détectées. Commit bloqué.')
  console.log('   Corrige les points 🔴 ou utilise git commit --no-verify pour forcer.\n')
  process.exit(1)
}

console.log('\n✅ [GIEC] Vérification passée.\n')
process.exit(0)
