#!/usr/bin/env node
/**
 * tools/rag/build-rgaa-index.mjs
 *
 * Chunke le référentiel RGAA 4.1.2 (fichier .txt) par critère,
 * puis construit un index BM25 prêt pour search.mjs.
 *
 * Usage :
 *   npm run rag:build-index:rgaa
 *   node tools/rag/build-rgaa-index.mjs [--input <path>] [--outDir <path>]
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_INPUT = 'tools/rag/data_sources/RGAA-v4.1.2.txt'
const DEFAULT_OUTPUT_DIR = 'tools/rag/index'
const OUTPUT_INDEX = 'rgaa_index.json'
const OUTPUT_CHUNKS = 'rgaa_chunks.jsonl'

// ── Thèmes RGAA 4.1.2 ─────────────────────────────────────────────────────────

const THEMES = {
  1: 'Images',
  2: 'Cadres',
  3: 'Couleurs',
  4: 'Multimédia',
  5: 'Tableaux',
  6: 'Liens',
  7: 'Scripts',
  8: 'Éléments obligatoires',
  9: 'Structuration de l\'information',
  10: 'Présentation de l\'information',
  11: 'Formulaires',
  12: 'Navigation',
  13: 'Consultation',
}

// ── BM25 — même implémentation que build-ipcc-index.mjs ─────────────────────

const STOPWORDS = new Set([
  'a', 'au', 'aux', 'avec', 'ce', 'ces', 'dans', 'de', 'des', 'du', 'elle', 'en', 'et', 'eux', 'il', 'je', 'la',
  'le', 'les', 'leur', 'lui', 'ma', 'mais', 'me', 'meme', 'mes', 'moi', 'mon', 'ne', 'nos', 'notre', 'nous', 'on',
  'ou', 'par', 'pas', 'pour', 'qu', 'que', 'qui', 'sa', 'se', 'ses', 'son', 'sur', 'ta', 'te', 'tes', 'toi', 'ton',
  'tu', 'un', 'une', 'vos', 'votre', 'vous',
  'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'in', 'is', 'it', 'its', 'of', 'on', 'or',
  'that', 'the', 'to', 'was', 'were', 'with',
])

function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function tokenize(text) {
  const cleaned = normalizeText(text).replace(/[^a-z0-9\s]/g, ' ')
  return cleaned.split(/\s+/).filter(t => t.length >= 2 && !STOPWORDS.has(t))
}

function buildIndex(chunks) {
  const docStore = []
  const inverted = new Map()
  let totalLength = 0

  for (const chunk of chunks) {
    const terms = tokenize(chunk.chunkText)
    totalLength += terms.length

    const tfMap = new Map()
    for (const term of terms) tfMap.set(term, (tfMap.get(term) ?? 0) + 1)

    const doc = {
      id: chunk.id,
      report: chunk.report,
      chapter: chunk.chapter ?? '',
      section: chunk.section ?? '',
      pageStart: chunk.pageStart ?? null,
      pageEnd: null,
      wordCount: terms.length,
      termsCount: tfMap.size,
    }
    docStore.push(doc)

    for (const [term, tf] of tfMap) {
      if (!inverted.has(term)) inverted.set(term, [])
      inverted.get(term).push({ docId: doc.id, tf })
    }
  }

  const documentsCount = docStore.length
  const avgDocLength = documentsCount > 0 ? totalLength / documentsCount : 0
  const postings = Object.fromEntries(inverted)

  return {
    version: 1,
    builtAt: new Date().toISOString(),
    algorithm: 'bm25',
    bm25: { k1: 1.2, b: 0.75 },
    stats: { documentsCount, avgDocLength, vocabularySize: Object.keys(postings).length },
    documents: docStore,
    postings,
  }
}

// ── Chunker RGAA ──────────────────────────────────────────────────────────────

const CRITERION_RE = /^Critère (\d+)\.(\d+)\s/
const PAGE_RE = /^RGAA 4\.1\.2 – (\d+)\/131/
const GLOSSARY_RE = /^(Glossaire|Annexe|4\s+Glossaire)/i

function chunkRgaa(text) {
  const lines = text.split(/\r?\n/)
  const chunks = []

  let currentCritId = null
  let currentLines = []
  let currentPage = 1
  let currentTheme = null
  let chunkStartPage = 1
  let inGlossary = false
  let glossaryLines = []

  function flushCriterion() {
    if (!currentCritId || currentLines.length === 0) return
    const chunkText = currentLines
      .filter(l => !PAGE_RE.test(l))
      .join('\n')
      .trim()
    if (chunkText.length < 50) return

    chunks.push({
      id: `rgaa_${currentCritId.replace('.', '_')}`,
      chunkText,
      report: 'RGAA 4.1.2',
      chapter: `Thématique ${currentTheme} — ${THEMES[currentTheme] ?? 'Inconnue'}`,
      section: `Critère ${currentCritId}`,
      pageStart: chunkStartPage,
    })
  }

  for (const line of lines) {
    const pageMatch = PAGE_RE.exec(line)
    if (pageMatch) {
      currentPage = parseInt(pageMatch[1], 10)
      if (currentLines.length > 0) currentLines.push(line)
      continue
    }

    if (GLOSSARY_RE.test(line)) {
      flushCriterion()
      currentCritId = null
      inGlossary = true
      glossaryLines.push(line)
      continue
    }

    if (inGlossary) {
      glossaryLines.push(line)
      continue
    }

    const critMatch = CRITERION_RE.exec(line)
    if (critMatch) {
      flushCriterion()
      const theme = parseInt(critMatch[1], 10)
      const num = critMatch[2]
      currentCritId = `${theme}.${num}`
      currentTheme = theme
      chunkStartPage = currentPage
      currentLines = [line]
      continue
    }

    if (currentCritId) {
      currentLines.push(line)
    }
  }

  flushCriterion()

  // Glossary as a single chunk (split into ~600-line sub-chunks to stay manageable)
  if (glossaryLines.length > 0) {
    const GLOSS_CHUNK_SIZE = 80
    for (let i = 0; i < glossaryLines.length; i += GLOSS_CHUNK_SIZE) {
      const slice = glossaryLines.slice(i, i + GLOSS_CHUNK_SIZE)
      const text = slice.filter(l => !PAGE_RE.test(l)).join('\n').trim()
      if (text.length > 50) {
        chunks.push({
          id: `rgaa_glossary_${Math.floor(i / GLOSS_CHUNK_SIZE) + 1}`,
          chunkText: text,
          report: 'RGAA 4.1.2',
          chapter: 'Glossaire',
          section: `Glossaire (partie ${Math.floor(i / GLOSS_CHUNK_SIZE) + 1})`,
          pageStart: null,
        })
      }
    }
  }

  return chunks
}

// ── Main ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { input: DEFAULT_INPUT, outDir: DEFAULT_OUTPUT_DIR }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--input' && argv[i + 1]) { args.input = argv[++i] }
    if (argv[i] === '--outDir' && argv[i + 1]) { args.outDir = argv[++i] }
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const root = process.cwd()
  const inputPath = path.resolve(root, args.input)
  const outDir = path.resolve(root, args.outDir)

  console.log(`[RGAA] Lecture de ${path.relative(root, inputPath)}...`)
  const text = await fs.readFile(inputPath, 'utf-8')

  console.log('[RGAA] Chunking par critère...')
  const chunks = chunkRgaa(text)
  console.log(`[RGAA] ${chunks.length} chunks générés`)

  console.log('[RGAA] Construction de l\'index BM25...')
  const index = buildIndex(chunks)

  await fs.mkdir(outDir, { recursive: true })

  const indexPath = path.join(outDir, OUTPUT_INDEX)
  const chunksPath = path.join(outDir, OUTPUT_CHUNKS)

  await fs.writeFile(indexPath, JSON.stringify(index), 'utf-8')
  await fs.writeFile(chunksPath, chunks.map(c => JSON.stringify(c)).join('\n') + '\n', 'utf-8')

  console.log(`[RGAA] Index : ${path.relative(root, indexPath)}`)
  console.log(`[RGAA] Chunks : ${path.relative(root, chunksPath)}`)
  console.log(`[RGAA] Vocabulaire : ${index.stats.vocabularySize} termes`)
  console.log('[RGAA] ✅ Index construit avec succès')
}

main().catch(err => {
  console.error('[RGAA] Échec :', err.message)
  process.exitCode = 1
})
