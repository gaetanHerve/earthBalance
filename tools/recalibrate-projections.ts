/**
 * recalibrate-projections.ts
 *
 * Step 4 of the grid migration: fix post-2074 projection values in
 * src/data/mitigationPolicies.ts using a line-by-line state machine.
 *
 * Two classes of changes:
 *
 * A. Baseline arrays (co2.baseline, temperature.baseline, forest.baseline):
 *    Replace with exact SSP3-7.0 values from baselines.config.ts.
 *    Per-policy baselines were interpolated from the 9-point legacy grid;
 *    this makes them fully consistent with the global baseline constants.
 *
 * B. Decided / pessimist arrays — flat tail fix:
 *    After step 3, indices 10–15 (years 2075–2100) hold the clamped 2074 value.
 *    We extend them by maintaining a constant absolute delta vs. the new baseline:
 *      new[i] = newBaseline[i] + (current[10] − oldBaselineAt2074)
 *    This models "the policy maintains its 2074 level of impact through 2100".
 *
 * Sources:
 *    BASELINE_CO2_16PT / BASELINE_FOREST_16PT : baselines.config.ts
 *    BASELINE_TEMP_16PT : CEDA Archive spm_fig8/panel_a/tas_global_SSP3_7_0.csv
 *      (2100 extrapolated: 3.909°C at 2099 + Δ0.037°C/yr → 3.95°C)
 *
 * Usage:
 *   npx vite-node tools/recalibrate-projections.ts           # dry-run (preview)
 *   npx vite-node tools/recalibrate-projections.ts --write   # apply in-place
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILE = resolve(__dirname, '../src/data/mitigationPolicies.ts')

// ─── Correct SSP3-7.0 baselines (16 points, 2025→2100) ───────────────────────

const BASELINE_CO2    = [66.2, 71.6, 75.7, 79.9, 83.6, 87.2, 90.1, 92.9, 95.5, 98.2, 100.9, 103.9, 106.9, 109.9, 112.9, 115.9]
const BASELINE_TEMP   = [1.35, 1.49, 1.63, 1.78, 1.94, 2.10, 2.27, 2.44, 2.62, 2.80, 2.99, 3.18, 3.37, 3.57, 3.76, 3.95]
const BASELINE_FOREST = [57.7, 55.5, 52.6, 49.5, 46.5, 43.5, 40.8, 38.0, 35.7, 33.4, 31.2, 29.8, 28.3, 26.9, 25.4, 24.0]

const NEW_BASELINE: Record<string, number[]> = {
  co2: BASELINE_CO2,
  temperature: BASELINE_TEMP,
  forest: BASELINE_FOREST,
}

// The flat tail value = the OLD 9PT last value (2074), which became the clamped
// value at indices 10–15 after step 3. Used to compute the absolute delta.
const OLD_BASELINE_AT_2074: Record<string, number> = {
  co2: 100.3,
  temperature: 2.95,
  forest: 31.5,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return String(Math.round(n * 100) / 100)
}

function serializeArray(values: number[]): string {
  return '[' + values.map(fmt).join(', ') + ']'
}

function hasFlatTail(values: number[]): boolean {
  if (values.length !== 16) return false
  const v10 = values[10]
  return values.slice(10).every(v => v === v10)
}

function extendTail(values: number[], indicator: string): number[] {
  const newBL = NEW_BASELINE[indicator]
  const oldAt2074 = OLD_BASELINE_AT_2074[indicator]
  // Absolute delta = effect at the last real data point (2074-equivalent)
  const delta = values[10] - oldAt2074
  return [
    ...values.slice(0, 10),
    ...newBL.slice(10).map(b => Math.round((b + delta) * 100) / 100),
  ]
}

// ─── State machine ────────────────────────────────────────────────────────────
// Tracks which projection sub-key (co2 / temperature / forest) and which role
// (baseline / decided / pessimist) we're currently on.

const SIXTEEN_NUM_RE = /\[(-?[\d.]+(?:,\s*-?[\d.]+){15})\]/

let section: string | null = null  // 'co2' | 'temperature' | 'forest' | null
let role:    string | null = null  // 'baseline' | 'decided' | 'pessimist' | null

let baselineCount  = 0
let decidedCount   = 0
let pessimistCount = 0

const source   = readFileSync(FILE, 'utf-8')
const newLines = source.split('\n').map(line => {
  const trimmed = line.trimStart()

  // ── Section detection (co2 / temperature / forest sub-keys in projections) ──
  if (/\bco2:\s*\{/.test(line))             section = 'co2'
  else if (/\btemperature:\s*\{/.test(line)) section = 'temperature'
  else if (/\bforest:\s*\{/.test(line))      section = 'forest'
  // Reset section on keys that cannot appear inside co2/temp/forest blocks
  else if (/\bprojections:\s*\{/.test(line)) { section = null; role = null }
  else if (/\bprojectedImpact\b/.test(line) || /\bprospectiveNarratives\b/.test(line) || /\bprerequisites\b/.test(line)) {
    section = null; role = null
  }

  // ── Role detection (skip comment lines) ──
  if (!trimmed.startsWith('//')) {
    if (/\bbaseline:\s/.test(line))       role = 'baseline'
    else if (/\bdecided:\s/.test(line))   role = 'decided'
    else if (/\bpessimist:\s/.test(line)) role = 'pessimist'
    else if (/\blabels:\s/.test(line))    role = null
  }

  // ── Transform if in a known context ──
  if (section && role) {
    const match = line.match(SIXTEEN_NUM_RE)
    if (match) {
      const values = match[1].split(',').map(s => parseFloat(s.trim()))
      let newValues: number[]

      if (role === 'baseline') {
        newValues = NEW_BASELINE[section]
        baselineCount++
      } else if (hasFlatTail(values)) {
        newValues = role === 'decided'
          ? (decidedCount++, extendTail(values, section))
          : (pessimistCount++, extendTail(values, section))
      } else {
        return line  // non-flat tail — already handled, leave as-is
      }

      return line.replace(match[0], serializeArray(newValues))
    }
  }

  return line
})

// ─── Output ───────────────────────────────────────────────────────────────────

const result      = newLines.join('\n')
const totalChanges = baselineCount + decidedCount + pessimistCount

console.log(`Baseline arrays replaced : ${baselineCount}`)
console.log(`Decided  arrays extended : ${decidedCount}`)
console.log(`Pessimist arrays extended: ${pessimistCount}`)
console.log(`Total changes            : ${totalChanges}`)

const isWrite = process.argv.includes('--write')
if (isWrite) {
  writeFileSync(FILE, result, 'utf-8')
  console.log(`\n✓ Written: ${FILE}`)
} else {
  console.log('\n[dry-run] Pass --write to apply. Showing first projections block:\n')
  // Print the first projections block for visual verification
  const lines = result.split('\n')
  const startIdx = lines.findIndex(l => /projections:\s*\{/.test(l))
  if (startIdx >= 0) {
    console.log(lines.slice(startIdx, startIdx + 35).join('\n'))
  }
}
