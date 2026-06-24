#!/usr/bin/env node
/**
 * tools/rag/search.mjs — BM25 search over the local IPCC index
 *
 * Usage:
 *   npm run rag:search -- "your query" [--top 5] [--format text|json]
 *   npm run rag:search -- "carbon tax" --top 10 --format json
 *
 * Requires the index to be built first:
 *   npm run rag:build-index
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_INDEX = 'tools/rag/index/ipcc_index.json'
const DEFAULT_CHUNKS = 'tools/rag/index/ipcc_chunks.jsonl'
const DEFAULT_TOP = 5
const TEXT_PREVIEW_LENGTH = 600

// Must match the stopword list in build-ipcc-index.mjs exactly
const STOPWORDS = new Set([
  'a', 'au', 'aux', 'avec', 'ce', 'ces', 'dans', 'de', 'des', 'du', 'elle', 'en', 'et', 'eux', 'il', 'je', 'la',
  'le', 'les', 'leur', 'lui', 'ma', 'mais', 'me', 'meme', 'mes', 'moi', 'mon', 'ne', 'nos', 'notre', 'nous', 'on',
  'ou', 'par', 'pas', 'pour', 'qu', 'que', 'qui', 'sa', 'se', 'ses', 'son', 'sur', 'ta', 'te', 'tes', 'toi', 'ton',
  'tu', 'un', 'une', 'vos', 'votre', 'vous',
  'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'in', 'is', 'it', 'its', 'of', 'on', 'or',
  'that', 'the', 'to', 'was', 'were', 'with',
])

function parseArgs(argv) {
  const args = {
    query: null,
    top: DEFAULT_TOP,
    format: 'text',
    index: DEFAULT_INDEX,
    chunks: DEFAULT_CHUNKS,
  }

  const positional = []

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (token === '--top' && argv[i + 1]) {
      const v = Number(argv[i + 1])
      if (Number.isFinite(v) && v > 0) args.top = Math.min(Math.floor(v), 50)
      i++
    } else if (token === '--format' && argv[i + 1]) {
      if (['text', 'json'].includes(argv[i + 1])) args.format = argv[i + 1]
      i++
    } else if (token === '--index' && argv[i + 1]) {
      args.index = argv[i + 1]
      i++
    } else if (token === '--chunks' && argv[i + 1]) {
      args.chunks = argv[i + 1]
      i++
    } else if (!token.startsWith('--')) {
      positional.push(token)
    }
  }

  if (positional.length > 0) {
    args.query = positional.join(' ')
  }

  return args
}

function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function tokenize(text) {
  const cleaned = normalizeText(text).replace(/[^a-z0-9\s]/g, ' ')
  return cleaned.split(/\s+/).filter((t) => t.length >= 2 && !STOPWORDS.has(t))
}

function readJsonl(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      try {
        return JSON.parse(line)
      } catch (e) {
        throw new Error(`Invalid JSONL at line ${i + 1}: ${e.message}`)
      }
    })
}

/**
 * BM25 score for a document against a set of query terms.
 *
 * score(d, q) = Σ IDF(t) × TF_norm(t, d)
 * IDF(t)      = log((N - n(t) + 0.5) / (n(t) + 0.5) + 1)
 * TF_norm     = tf × (k1 + 1) / (tf + k1 × (1 − b + b × |d| / avgdl))
 */
function bm25Score(queryTerms, doc, postings, documentsCount, avgDocLength) {
  const k1 = 1.2
  const b = 0.75
  let score = 0

  for (const term of queryTerms) {
    const posting = postings[term]
    if (!posting) continue

    const n = posting.length
    const idf = Math.log((documentsCount - n + 0.5) / (n + 0.5) + 1)

    const entry = posting.find((p) => p.docId === doc.id)
    if (!entry) continue

    const tf = entry.tf
    const tfNorm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc.wordCount / avgDocLength))
    score += idf * tfNorm
  }

  return score
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (!args.query) {
    console.error('Usage: npm run rag:search -- "your query" [--top 5] [--format text|json]')
    process.exitCode = 1
    return
  }

  const root = process.cwd()

  // ── Load index ──────────────────────────────────────────────────────────────
  let index
  try {
    const raw = await fs.readFile(path.resolve(root, args.index), 'utf8')
    index = JSON.parse(raw)
  } catch {
    console.error(`[RAG] Cannot load index at "${args.index}". Run "npm run rag:build-index" first.`)
    process.exitCode = 1
    return
  }

  // ── Load chunks for full text retrieval ─────────────────────────────────────
  let chunkMap
  try {
    const raw = await fs.readFile(path.resolve(root, args.chunks), 'utf8')
    const chunks = readJsonl(raw)
    chunkMap = new Map()
    for (const chunk of chunks) {
      // Support both normalized (id/chunkText) and raw IPCC format (chunk_id/text)
      const id = String(chunk.id ?? chunk.chunk_id ?? '')
      const text = chunk.chunkText ?? chunk.text ?? ''
      if (id) chunkMap.set(id, text)
    }
  } catch {
    console.error(`[RAG] Cannot load chunks at "${args.chunks}".`)
    process.exitCode = 1
    return
  }

  // ── Tokenize query ──────────────────────────────────────────────────────────
  const queryTerms = [...new Set(tokenize(args.query))]

  if (queryTerms.length === 0) {
    console.error('[RAG] No searchable terms after stopword filtering. Try different keywords.')
    process.exitCode = 1
    return
  }

  // ── Score all documents ─────────────────────────────────────────────────────
  const { documentsCount, avgDocLength } = index.stats
  const scored = []

  for (const doc of index.documents) {
    const score = bm25Score(queryTerms, doc, index.postings, documentsCount, avgDocLength)
    if (score > 0) scored.push({ doc, score })
  }

  scored.sort((a, b) => b.score - a.score)

  const results = scored.slice(0, args.top).map(({ doc, score }) => ({
    id: doc.id,
    report: doc.report,
    chapter: doc.chapter || undefined,
    section: doc.section || undefined,
    pageStart: doc.pageStart ?? undefined,
    pageEnd: doc.pageEnd ?? undefined,
    score: Math.round(score * 1000) / 1000,
    text: chunkMap.get(doc.id) ?? '[text unavailable]',
  }))

  // ── Output ──────────────────────────────────────────────────────────────────
  if (args.format === 'json') {
    process.stdout.write(
      JSON.stringify({ query: args.query, queryTerms, totalMatches: scored.length, results }, null, 2) + '\n',
    )
    return
  }

  const divider = '─'.repeat(80)
  console.log(`\n[RAG] Query  : "${args.query}"`)
  console.log(`[RAG] Terms  : ${queryTerms.join(', ')}`)
  console.log(`[RAG] Found  : ${results.length} results (${scored.length} documents matched)\n`)
  console.log(divider)

  for (const r of results) {
    const breadcrumb = [r.report, r.chapter, r.section].filter(Boolean).join(' › ')
    const pages =
      r.pageStart != null
        ? `p.${r.pageStart}${r.pageEnd != null && r.pageEnd !== r.pageStart ? `–${r.pageEnd}` : ''}`
        : ''

    console.log(`\n  Source : ${breadcrumb}${pages ? `  (${pages})` : ''}`)
    console.log(`  ID     : ${r.id}`)
    console.log(`  Score  : ${r.score}`)
    console.log()

    const preview =
      r.text.length > TEXT_PREVIEW_LENGTH
        ? r.text.slice(0, TEXT_PREVIEW_LENGTH).trimEnd() + ' [...]'
        : r.text
    console.log(`  ${preview.replace(/\n/g, '\n  ')}`)
    console.log('\n' + divider)
  }

  if (results.length === 0) {
    console.log('\n  No matching chunks found. Try broader or English keywords.\n')
  }
}

main().catch((error) => {
  console.error('[RAG] Search failed:', error.message)
  process.exitCode = 1
})
