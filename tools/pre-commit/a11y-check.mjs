#!/usr/bin/env node
/**
 * Vérification d'accessibilité RGAA 4.1.2.
 * Analyse le diff stagé pour détecter des régressions d'accessibilité.
 *
 * Sortie :
 *   exit 0  — aucun problème critique
 *   exit 1  — régression critique détectée (🔴 CRITICAL dans le rapport)
 */
import { execSync, spawnSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { findClaudeBin } from './find-claude.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const RGAA_INDEX = join(ROOT, 'tools/rag/index/rgaa_index.json')

// ── Vérification de disponibilité de l'index ─────────────────────────────────

if (!existsSync(RGAA_INDEX)) {
  const stagedVue = (() => {
    try {
      return execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf-8' })
        .trim().split('\n').filter(f => f.endsWith('.vue'))
    } catch { return [] }
  })()
  if (stagedVue.length > 0) {
    console.log(`\n⚠️  [A11Y] ${stagedVue.length} composant(s) Vue modifié(s) — index RGAA absent.`)
    console.log('   Lancer "npm run rag:build-index:rgaa" pour activer la vérification.\n')
  }
  process.exit(0)
}

// ── Diff stagé ────────────────────────────────────────────────────────────────

let diff = ''
let stagedFiles = []

try {
  diff = execSync('git diff --cached', { cwd: ROOT, encoding: 'utf-8' })
  stagedFiles = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf-8' })
    .trim().split('\n').filter(Boolean)
} catch {
  process.exit(0)
}

if (!diff.trim()) process.exit(0)

// ── Filtrage sur les fichiers UI ──────────────────────────────────────────────

const uiFiles = stagedFiles.filter(f =>
  f.endsWith('.vue') || f.endsWith('.html') ||
  (f.endsWith('.ts') && !f.includes('.store.') && !f.includes('config') && !f.includes('data/'))
)

if (uiFiles.length === 0) {
  process.exit(0)
}

console.log(`\n🔍 [A11Y] ${uiFiles.length} fichier(s) UI modifié(s), analyse RGAA en cours...\n`)

// ── Détection des patterns d'accessibilité dans le diff ───────────────────────

const PATTERNS = {
  canvas:   { re: /<canvas|role="img"/, query: 'canvas image bitmap alternative textuelle role img aria-label' },
  button:   { re: /<button|role="button"|aria-pressed|aria-expanded/, query: 'composants interface bouton clavier navigation état' },
  form:     { re: /<input|<form|<label|<select|<textarea/, query: 'formulaires étiquettes champs accessibilité' },
  aria:     { re: /aria-(?:hidden|live|label|labelledby|describedby|controls)/, query: 'WAI-ARIA attributs accessibilité technologie assistance' },
  color:    { re: /text-slate-[34]00|color:|#[0-9a-f]{3,6}|rgb\(|contrast/, query: 'contraste couleur texte arrière-plan ratio' },
  dynamic:  { re: /v-show|v-if|aria-live|role="status"|role="alert"/, query: 'contenu dynamique mise à jour alerte statut' },
  keyboard: { re: /tabindex|@keydown|@keyup|keyCode|addEventListener.*key/, query: 'navigation clavier tabindex focus ordre' },
  lang:     { re: /documentElement\.lang|lang=|locale/, query: 'langue changement html lang attribut' },
}

const matchedPatterns = Object.entries(PATTERNS)
  .filter(([, { re }]) => re.test(diff))

if (matchedPatterns.length === 0) {
  console.log('✅ [A11Y] Aucun pattern d\'accessibilité détecté dans le diff.')
  process.exit(0)
}

// ── Recherche RAG RGAA ────────────────────────────────────────────────────────

const queries = [...new Set(matchedPatterns.map(([, { query }]) => query))].slice(0, 2)
const ragResults = []

for (const query of queries) {
  const res = spawnSync(
    process.execPath,
    [
      'tools/rag/search.mjs', query,
      '--top', '3',
      '--format', 'json',
      '--index', 'tools/rag/index/rgaa_index.json',
      '--chunks', 'tools/rag/index/rgaa_chunks.jsonl',
    ],
    { cwd: ROOT, encoding: 'utf-8', timeout: 15000 }
  )
  if (res.status === 0 && res.stdout) {
    try {
      const data = JSON.parse(res.stdout)
      ragResults.push(...data.results.map(r => ({
        ref: `[RGAA 4.1.2 — ${r.section ?? r.chapter}]`,
        text: r.text.slice(0, 400),
      })))
    } catch { /* ignore */ }
  }
}

const ragContext = ragResults.length > 0
  ? ragResults.map(r => `${r.ref}\n${r.text}`).join('\n\n---\n\n')
  : '⚠️ Aucun résultat RAG — analyse sans contexte RGAA sourcé.'

// ── Construction du prompt ────────────────────────────────────────────────────

const detectedPatterns = matchedPatterns.map(([name]) => name).join(', ')

const diffTruncated = diff.length > 8000
  ? diff.slice(0, 8000) + '\n\n[... diff tronqué à 8000 caractères ...]'
  : diff

const prompt = `Tu es un expert en accessibilité numérique, spécialisé dans le référentiel RGAA 4.1.2 et les standards WCAG 2.1 AA.

MISSION : Analyser le diff git ci-dessous et détecter toute régression d'accessibilité.

Fichiers UI modifiés : ${uiFiles.join(', ')}
Patterns détectés : ${detectedPatterns}

Stack du projet : Vue 3 (Composition API), TypeScript, Tailwind CSS, Chart.js (canvas), Cytoscape.js (canvas)

Patterns d'accessibilité déjà en place (à ne pas rompre) :
- role="img" + aria-label sur tous les canvas (Chart.js, Cytoscape)
- aria-hidden="true" sur icônes décoratives (FontAwesome, SVG)
- role="status" + aria-live="polite" sur mises à jour dynamiques
- aria-pressed sur boutons bascule
- skip link sr-only dans App.vue (critère RGAA 12.7)

## Critères RGAA 4.1.2 pertinents — extraits de l'index RAG local

${ragContext}

## Diff à analyser

\`\`\`diff
${diffTruncated}
\`\`\`

## Format de réponse OBLIGATOIRE

Réponds UNIQUEMENT avec ce bloc structuré :

## Rapport A11Y — Vérification pré-commit

🔴 CRITICAL: [régression bloquante : canvas sans role="img", bouton sans label accessible, contraste < 4.5:1 sur texte normal, focus management cassé]
🟡 WARNING: [vigilance : aria-live manquant sur contenu dynamique, tabindex inhabituel, couleur porteuse d'information sans alternative visuelle]
✅ OK: [aspect vérifié conforme RGAA 4.1.2]

Si aucun problème d'accessibilité n'est détecté : "✅ OK: Aucune régression d'accessibilité détectée."

Règle : ne signale que ce que tu vois dans le diff. Cite le critère RGAA concerné quand c'est possible.`

// ── Appel à claude CLI ────────────────────────────────────────────────────────

const claudeBin = findClaudeBin()
if (!claudeBin) {
  console.warn('[A11Y] ⚠️  claude CLI introuvable — vérification ignorée.')
  process.exit(0)
}

const claudeResult = spawnSync(claudeBin, ['-p'], {
  cwd: ROOT,
  input: prompt,
  encoding: 'utf-8',
  timeout: 120000,
  maxBuffer: 1024 * 1024 * 5,
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, HOME: process.env.USERPROFILE ?? process.env.HOME },
})

if (claudeResult.error || claudeResult.status === null) {
  console.warn('[A11Y] ⚠️  claude CLI indisponible ou timeout — vérification ignorée.')
  if (claudeResult.error?.message) console.warn('       ', claudeResult.error.message)
  process.exit(0)
}

const report = (claudeResult.stdout || '').trim()

if (!report) {
  console.warn('[A11Y] ⚠️  Réponse vide — vérification ignorée.')
  process.exit(0)
}

// ── Affichage du rapport ──────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════╗')
console.log('║       RAPPORT A11Y — Pré-commit          ║')
console.log('╚══════════════════════════════════════════╝\n')
console.log(report)

if (report.includes('🔴 CRITICAL')) {
  console.log('\n❌ [A11Y] Régression critique détectée. Commit bloqué.')
  console.log('   Corrige les points 🔴 ou utilise git commit --no-verify pour forcer.\n')
  process.exit(1)
}

console.log('\n✅ [A11Y] Vérification passée.\n')
process.exit(0)
