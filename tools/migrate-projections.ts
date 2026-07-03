/**
 * migrate-projections.ts
 *
 * Migrates all projection arrays in src/data/mitigationPolicies.ts from the
 * old 9-point irregular grid to the new 16-point uniform 5-year grid via
 * linear interpolation.
 *
 * Old grid (9 pts, irregular): [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]
 * New grid (16 pts, uniform):  [2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060,
 *                               2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100]
 *
 * Why linear interpolation is sufficient:
 *   - All projection curves are smooth and monotone; interpolation error is small.
 *   - Key anchor years 2030/2040/2050/2060 are preserved exactly (they appear in
 *     both grids). Only 2024→2025 and 2034→2035 require a short extrapolation/
 *     interpolation step, which is negligible over 1–2 years.
 *   - earthBalance is educational, not a climate model; sub-5-year precision is
 *     not meaningful at game scale.
 *
 * Approach:
 *   1. Replace the `labels:` array literal (avoids double-processing it in step 2).
 *   2. Process every non-comment line: match all 9-element numeric arrays and
 *      replace them with their 16-point interpolated equivalent.
 *   Comment-only lines (starting with //) are skipped to preserve header docs.
 *
 * Usage:
 *   npx vite-node tools/migrate-projections.ts           # dry-run (preview only)
 *   npx vite-node tools/migrate-projections.ts --write   # applies changes in-place
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILE = resolve(__dirname, '../src/data/mitigationPolicies.ts')

// ─── Grid definitions ─────────────────────────────────────────────────────────

const OLD_LABELS = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]
const NEW_LABELS = [2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100]

// ─── Interpolation helpers ────────────────────────────────────────────────────

function interpolateAtYear(year: number, values: number[]): number {
  if (year <= OLD_LABELS[0]) return values[0]
  if (year >= OLD_LABELS[OLD_LABELS.length - 1]) return values[values.length - 1]
  for (let i = 0; i < OLD_LABELS.length - 1; i++) {
    if (year >= OLD_LABELS[i] && year <= OLD_LABELS[i + 1]) {
      const t = (year - OLD_LABELS[i]) / (OLD_LABELS[i + 1] - OLD_LABELS[i])
      return values[i] + t * (values[i + 1] - values[i])
    }
  }
  return values[values.length - 1]
}

function interpolate(values: number[]): number[] {
  return NEW_LABELS.map(year => interpolateAtYear(year, values))
}

function fmt(n: number): string {
  // Round to 2 decimal places, strip trailing zeros (JS toString handles this)
  return String(Math.round(n * 100) / 100)
}

function serializeArray(values: number[]): string {
  return '[' + values.map(fmt).join(', ') + ']'
}

// ─── Regex for exactly 9 comma-separated numbers (integers or decimals) ───────
// Matches arrays like [65.2, 67.2, 69.3, 71.6, 74.9, 79.9, 87.2, 92.9, 100.3]
// Does NOT match arrays starting with non-numeric content (e.g. comment refs like
// [AR6 WGI SPM.4 — CEDA, CC-BY-4.0]) because those don't match [\d.] at start.
const NINE_NUM_RE = /\[(-?[\d.]+(?:,\s*-?[\d.]+){8})\]/g

// ─── Main ────────────────────────────────────────────────────────────────────

let source = readFileSync(FILE, 'utf-8')

// Step 1 — replace the `labels:` array literal (exact string match).
// Must happen before step 2 to avoid running the 9-element regex on the labels
// line and replacing it with interpolated year values instead of the new grid.
const OLD_LABELS_LINE = `labels: [${OLD_LABELS.join(', ')}],`
const NEW_LABELS_LINE = `labels: [${NEW_LABELS.join(', ')}],`
const labelsCount = (source.match(new RegExp(OLD_LABELS_LINE.replace(/[[\]]/g, '\\$&'), 'g')) ?? []).length
source = source.replaceAll(OLD_LABELS_LINE, NEW_LABELS_LINE)

// Also update the matching comment at the top of the file
source = source.replace(
  `// labels : [${OLD_LABELS.join(', ')}]`,
  `// labels : [${NEW_LABELS.join(', ')}]`
)

// Step 2 — migrate all 9-element numeric arrays in non-comment lines.
let arraysCount = 0
source = source.split('\n').map(line => {
  // Skip pure comment lines — their documentation arrays are stale but harmless;
  // they will be recalibrated in the SSP3-7.0 scientific pass (step 4).
  if (line.trimStart().startsWith('//')) return line

  return line.replace(NINE_NUM_RE, (_match, content: string) => {
    const values = content.split(',').map(s => parseFloat(s.trim()))
    if (values.length !== 9 || values.some(isNaN)) return _match
    arraysCount++
    return serializeArray(interpolate(values))
  })
}).join('\n')

// ─── Report ──────────────────────────────────────────────────────────────────

console.log(`Labels arrays replaced : ${labelsCount}`)
console.log(`Data arrays migrated   : ${arraysCount}`)
console.log(`Total replacements     : ${labelsCount + arraysCount}`)

const isWrite = process.argv.includes('--write')
if (isWrite) {
  writeFileSync(FILE, source, 'utf-8')
  console.log(`\n✓ Written: ${FILE}`)
} else {
  console.log('\n[dry-run] Pass --write to apply. Showing first 100 lines of result:\n')
  console.log(source.split('\n').slice(0, 100).join('\n'))
}
