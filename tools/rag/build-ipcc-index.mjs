#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_INPUT = 'tools/rag/chunks/ipcc_chunks.jsonl'
const DEFAULT_OUTPUT_DIR = '.rag'
const OUTPUT_INDEX = 'ipcc_index.json'
const OUTPUT_CHUNKS = 'ipcc_chunks.jsonl'

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
    input: DEFAULT_INPUT,
    outDir: DEFAULT_OUTPUT_DIR,
    minTokenLength: 2,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--input' && argv[i + 1]) {
      args.input = argv[i + 1]
      i += 1
      continue
    }
    if (token === '--outDir' && argv[i + 1]) {
      args.outDir = argv[i + 1]
      i += 1
      continue
    }
    if (token === '--minTokenLength' && argv[i + 1]) {
      const value = Number(argv[i + 1])
      if (Number.isFinite(value) && value > 0) {
        args.minTokenLength = value
      }
      i += 1
    }
  }

  return args
}

function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function tokenize(text, minTokenLength) {
  const cleaned = normalizeText(text).replace(/[^a-z0-9\s]/g, ' ')
  return cleaned
    .split(/\s+/)
    .filter((token) => token.length >= minTokenLength && !STOPWORDS.has(token))
}

function readJsonl(content) {
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines.map((line, index) => {
    try {
      return JSON.parse(line)
    } catch (error) {
      throw new Error(`Invalid JSONL at line ${index + 1}: ${error.message}`)
    }
  })
}

/**
 * Normalize chunk from various formats to standard schema.
 * Supports:
 *   - chunk_id, text, source, pages, confidence_terms (IPCC format)
 *   - id, chunkText, report, pageStart, ... (standard format)
 */
function normalizeChunk(rawChunk, index) {
  // Map flexible field names
  const id = rawChunk.id ?? rawChunk.chunk_id
  const chunkText = rawChunk.chunkText ?? rawChunk.text
  const report = rawChunk.report ?? rawChunk.source
  
  if (!id || !chunkText || !report) {
    throw new Error(
      `Chunk #${index + 1} missing required fields: id=${id ? '✓' : '✗'}, chunkText=${chunkText ? '✓' : '✗'}, report=${report ? '✓' : '✗'}`
    )
  }

  // Extract optional fields
  const pageStart = rawChunk.pageStart ?? (Array.isArray(rawChunk.pages) && rawChunk.pages[0]) ?? undefined
  const pageEnd = rawChunk.pageEnd ?? (Array.isArray(rawChunk.pages) && rawChunk.pages[rawChunk.pages.length - 1]) ?? undefined

  return {
    id: String(id),
    chunkText: String(chunkText),
    report: String(report),
    chapter: rawChunk.chapter ? String(rawChunk.chapter) : undefined,
    section: rawChunk.section ? String(rawChunk.section) : undefined,
    pageStart: Number.isFinite(pageStart) ? pageStart : undefined,
    pageEnd: Number.isFinite(pageEnd) ? pageEnd : undefined,
    year: rawChunk.year ? Number(rawChunk.year) : undefined,
    sourcePath: rawChunk.sourcePath ? String(rawChunk.sourcePath) : undefined,
  }
}

function buildIndex(chunks, minTokenLength) {
  const docStore = []
  const inverted = new Map()
  let totalLength = 0

  chunks.forEach((rawChunk, i) => {
    const chunk = normalizeChunk(rawChunk, i)

    const terms = tokenize(chunk.chunkText, minTokenLength)
    totalLength += terms.length

    const tfMap = new Map()
    for (const term of terms) {
      tfMap.set(term, (tfMap.get(term) ?? 0) + 1)
    }

    const doc = {
      id: chunk.id,
      report: chunk.report,
      chapter: chunk.chapter ?? '',
      section: chunk.section ?? '',
      pageStart: chunk.pageStart ?? null,
      pageEnd: chunk.pageEnd ?? null,
      year: chunk.year ?? null,
      sourcePath: chunk.sourcePath ?? '',
      wordCount: terms.length,
      termsCount: tfMap.size,
    }

    docStore.push(doc)

    for (const [term, tf] of tfMap.entries()) {
      if (!inverted.has(term)) {
        inverted.set(term, [])
      }
      inverted.get(term).push({ docId: doc.id, tf })
    }
  })

  const documentsCount = docStore.length
  const avgDocLength = documentsCount > 0 ? totalLength / documentsCount : 0

  const postings = {}
  for (const [term, docs] of inverted.entries()) {
    postings[term] = docs
  }

  return {
    version: 1,
    builtAt: new Date().toISOString(),
    algorithm: 'bm25',
    bm25: { k1: 1.2, b: 0.75 },
    stats: {
      documentsCount,
      avgDocLength,
      vocabularySize: Object.keys(postings).length,
    },
    documents: docStore,
    postings,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const workspaceRoot = process.cwd()
  const inputPath = path.resolve(workspaceRoot, args.input)
  const outDir = path.resolve(workspaceRoot, args.outDir)

  const content = await fs.readFile(inputPath, 'utf8')
  const chunks = readJsonl(content)
  const index = buildIndex(chunks, args.minTokenLength)

  await fs.mkdir(outDir, { recursive: true })

  const indexPath = path.join(outDir, OUTPUT_INDEX)
  const chunksOutPath = path.join(outDir, OUTPUT_CHUNKS)

  await fs.writeFile(indexPath, JSON.stringify(index), 'utf8')
  await fs.writeFile(chunksOutPath, content.trim() + '\n', 'utf8')

  console.log('[RAG] Index build complete')
  console.log(`[RAG] Input chunks: ${chunks.length}`)
  console.log(`[RAG] Vocabulary size: ${index.stats.vocabularySize}`)
  console.log(`[RAG] Wrote: ${path.relative(workspaceRoot, indexPath)}`)
  console.log(`[RAG] Wrote: ${path.relative(workspaceRoot, chunksOutPath)}`)
}

main().catch((error) => {
  console.error('[RAG] Failed to build index')
  console.error(error.message)
  process.exitCode = 1
})
