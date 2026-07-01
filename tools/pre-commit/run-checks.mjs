#!/usr/bin/env node
/**
 * Orchestrateur des vérifications pré-commit.
 * Exécute séquentiellement les checks GIEC et accessibilité.
 *
 * Sortie :
 *   exit 0  — tous les checks passés
 *   exit 1  — au moins un check critique a échoué
 */
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function runCheck(scriptPath, label) {
  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: 'inherit',
    timeout: 150000,
  })

  if (result.error) {
    console.warn(`[${label}] Erreur d'exécution : ${result.error.message}`)
    return 0
  }

  return result.status ?? 0
}

const giecExit = runCheck(join(__dirname, 'giec-check.mjs'), 'GIEC')
const a11yExit = runCheck(join(__dirname, 'a11y-check.mjs'), 'A11Y')

const failed = giecExit !== 0 || a11yExit !== 0
const giecIcon = giecExit !== 0 ? '❌' : '✅'
const a11yIcon = a11yExit !== 0 ? '❌' : '✅'

console.log(`\n🔒 Pré-commit — GIEC ${giecIcon}  A11Y ${a11yIcon}${failed ? '  →  commit bloqué' : ''}\n`)

process.exit(failed ? 1 : 0)
