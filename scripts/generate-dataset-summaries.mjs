#!/usr/bin/env node

/**
 * generate-dataset-summaries.mjs
 *
 * Génère un fichier .txt compagnon pour chaque CSV non-vide référencé dans
 * tools/rag/data_sources/datasets/index.json. Ces fichiers texte sont optimisés pour
 * l'indexation BM25 (RAG) : ils décrivent le contenu en langage naturel avec
 * les métadonnées de la figure et les statistiques clés extraites des données.
 *
 * Usage:
 *   node scripts/generate-dataset-summaries.mjs
 *   node scripts/generate-dataset-summaries.mjs --force   # regénère même si .txt existe déjà
 *
 * Comportement par défaut : skippe les .txt déjà présents (mode idempotent).
 * Les CSV vides sont skippés avec un avertissement.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const dataSourcesDir = path.join(projectRoot, 'tools', 'rag', 'data_sources')
const indexPath = path.join(dataSourcesDir, 'datasets', 'index.json')

const FORCE = process.argv.includes('--force')

// ─── CSV Parser ───────────────────────────────────────────────────────────────
/**
 * Parse un CSV simple (séparateur virgule ou point-virgule).
 * Retourne { headers: string[], rows: Record<string, string>[] }
 */
function parseCsv(content) {
  const lines = content.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return null

  // Détection du séparateur : virgule ou point-virgule
  const sep = lines[0].includes(';') ? ';' : ','
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = lines.slice(1).map(line => {
    const vals = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  })

  return { headers, rows }
}

// ─── Stats ────────────────────────────────────────────────────────────────────
/**
 * Calcule les statistiques descriptives d'une colonne numérique.
 * Retourne null si la colonne n'est pas numérique.
 */
function columnStats(rows, colName) {
  const values = rows
    .map(r => parseFloat(r[colName]))
    .filter(v => !isNaN(v))

  if (values.length === 0) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const first = values[0]
  const last = values[values.length - 1]
  const trend = last > first ? 'hausse' : last < first ? 'baisse' : 'stable'
  const change = ((last - first) / Math.abs(first || 1) * 100).toFixed(1)

  return { min, max, first, last, trend, changePercent: change, count: values.length }
}

/**
 * Formate un nombre pour l'affichage : supprime les zéros inutiles après la virgule.
 */
function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return 'N/A'
  return parseFloat(n.toPrecision(5)).toString()
}

// ─── Générateur de texte compagnon ───────────────────────────────────────────
/**
 * Construit le contenu texte indexable pour un CSV donné.
 *
 * @param {object} dataset  - Entrée du dataset dans index.json
 * @param {string} csvPath  - Chemin absolu du fichier CSV
 * @param {object} parsed   - Résultat de parseCsv()
 * @param {object} sources  - Objet sources de index.json
 */
function buildSummaryText(dataset, csvPath, parsed, sources) {
  const filename = path.basename(csvPath)
  const source = sources[dataset.source] ?? {}
  const lines = []

  // ── En-tête ──────────────────────────────────────────────────────────────
  lines.push(`=== DATASET SUMMARY ===`)
  lines.push(`Titre: ${dataset.title}`)
  lines.push(`Figure(s) GIEC: ${(dataset.figure_id ?? []).join(', ') || 'N/A'}`)
  lines.push(`Section du rapport: ${dataset.report_section ?? dataset.working_group ?? 'N/A'}`)
  lines.push(`Source: ${source.label ?? dataset.source} | Licence: ${source.license ?? 'N/A'}`)
  lines.push(`Fichier CSV: ${filename}`)
  lines.push(`Période couverte: ${dataset.time_range ?? 'N/A'}`)
  lines.push(`Thèmes: ${(dataset.themes ?? dataset.theme ?? []).join(', ')}`)
  lines.push(`Scénarios: ${(dataset.scenarios ?? []).join(', ') || 'N/A'}`)
  lines.push(`Variables: ${(dataset.variables ?? []).join(', ') || 'N/A'}`)
  lines.push('')

  // ── Description narrative ─────────────────────────────────────────────────
  if (dataset.description) {
    lines.push(`Description:`)
    lines.push(dataset.description)
    lines.push('')
  }

  if (dataset.note) {
    lines.push(`Note: ${dataset.note}`)
    lines.push('')
  }

  // ── Structure du CSV ──────────────────────────────────────────────────────
  lines.push(`Colonnes (${parsed.headers.length}): ${parsed.headers.join(', ')}`)
  lines.push(`Nombre de lignes de données: ${parsed.rows.length}`)
  lines.push('')

  // ── Statistiques par colonne numérique ────────────────────────────────────
  const numericCols = parsed.headers.filter(h => {
    const stats = columnStats(parsed.rows, h)
    return stats !== null
  })

  if (numericCols.length > 0) {
    lines.push(`Statistiques par colonne:`)
    for (const col of numericCols) {
      const stats = columnStats(parsed.rows, col)
      if (!stats) continue
      lines.push(
        `  ${col}: ` +
        `min=${fmt(stats.min)}, max=${fmt(stats.max)}, ` +
        `première valeur=${fmt(stats.first)}, dernière valeur=${fmt(stats.last)}, ` +
        `tendance=${stats.trend} (${stats.changePercent}%)`
      )
    }
    lines.push('')
  }

  // ── Valeurs à dates charnières (si colonne temporelle détectée) ───────────
  const yearCol = parsed.headers.find(h =>
    /^(year|an|année|date|time)$/i.test(h) || /year/i.test(h)
  )
  if (yearCol && numericCols.length > 1) {
    const pivotYears = [2030, 2050, 2075, 2100]
    const dataCols = numericCols.filter(c => c !== yearCol)

    const pivotRows = pivotYears
      .map(yr => parsed.rows.find(r => parseFloat(r[yearCol]) === yr))
      .filter(Boolean)

    if (pivotRows.length > 0 && dataCols.length > 0) {
      lines.push(`Valeurs aux années charnières:`)
      for (const row of pivotRows) {
        const yr = row[yearCol]
        const vals = dataCols
          .map(c => `${c}=${fmt(parseFloat(row[c]))}`)
          .join(', ')
        lines.push(`  ${yr}: ${vals}`)
      }
      lines.push('')
    }
  }

  // ── URL CEDA ──────────────────────────────────────────────────────────────
  if (dataset.ceda_url) {
    lines.push(`URL source CEDA: ${dataset.ceda_url}`)
  }
  if (dataset.citation) {
    lines.push(`Citation: ${dataset.citation}`)
  }

  lines.push('')
  lines.push(`[Généré automatiquement par generate-dataset-summaries.mjs]`)

  return lines.join('\n')
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Index introuvable : ${indexPath}`)
    process.exit(1)
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  const { sources, datasets } = index

  let generated = 0
  let skipped = 0
  let empty = 0
  let errors = 0

  for (const dataset of datasets) {
    const files = dataset.files ?? []
    const csvFiles = files.filter(f => f.endsWith('.csv'))

    for (const relPath of csvFiles) {
      const csvAbs = path.join(dataSourcesDir, relPath.replace(/^(datasets\/|external_data\/)/, '').startsWith('datasets') ? '' : '', relPath.startsWith('datasets/') ? '' : relPath.startsWith('external_data/') ? '' : '')
      // Résolution correcte : relPath est relatif à tools/rag/data_sources/
      const csvAbsPath = path.join(dataSourcesDir, relPath)
      const txtPath = csvAbsPath.replace(/\.csv$/, '.summary.txt')

      // Skip si le .txt existe déjà et qu'on n'est pas en mode --force
      if (!FORCE && fs.existsSync(txtPath)) {
        skipped++
        continue
      }

      // Vérification existence du CSV
      if (!fs.existsSync(csvAbsPath)) {
        console.warn(`⚠️  CSV introuvable (skippé) : ${relPath}`)
        errors++
        continue
      }

      // Lecture du CSV
      const content = fs.readFileSync(csvAbsPath, 'utf8').trim()
      if (!content) {
        console.warn(`⏭️  CSV vide (skippé) : ${relPath}`)
        empty++
        continue
      }

      // Parsing
      const parsed = parseCsv(content)
      if (!parsed) {
        console.warn(`⚠️  CSV illisible (moins de 2 lignes) : ${relPath}`)
        errors++
        continue
      }

      // Génération du texte
      try {
        const summary = buildSummaryText(dataset, csvAbsPath, parsed, sources)
        fs.writeFileSync(txtPath, summary, 'utf8')
        console.log(`✅ Généré : ${path.relative(projectRoot, txtPath)}`)
        generated++
      } catch (err) {
        console.error(`❌ Erreur pour ${relPath} : ${err.message}`)
        errors++
      }
    }
  }

  console.log('')
  console.log(`─── Résumé ──────────────────────────────`)
  console.log(`  Générés  : ${generated}`)
  console.log(`  Skippés  : ${skipped} (déjà présents)`)
  console.log(`  Vides    : ${empty} (CSV sans données)`)
  console.log(`  Erreurs  : ${errors}`)
  if (empty > 0) {
    console.log(``)
    console.log(`  ℹ️  Pour les CSVs vides, téléchargez les données depuis CEDA :`)
    console.log(`     http://data.ceda.ac.uk/badc/ar6_wg1/`)
    console.log(`     puis relancez ce script.`)
  }
}

main()
