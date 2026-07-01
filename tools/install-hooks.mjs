#!/usr/bin/env node
/**
 * Configure git pour utiliser le répertoire .hooks/ du projet.
 * À exécuter via "npm run prepare" après un clone ou "npm install".
 */
import { execSync, spawnSync } from 'child_process'
import { chmodSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

try {
  execSync('git config core.hooksPath .hooks', { cwd: ROOT, stdio: 'inherit' })
  console.log('✅ git core.hooksPath configuré → .hooks/')
} catch {
  console.error('❌ Impossible de configurer git core.hooksPath')
  process.exit(1)
}

const hookFile = join(ROOT, '.hooks/pre-commit')
if (existsSync(hookFile)) {
  try {
    chmodSync(hookFile, 0o755)
    console.log('✅ .hooks/pre-commit rendu exécutable')
  } catch {
    // chmod échoue silencieusement sur Windows NTFS — git l'exécutera quand même
  }
}

console.log('✅ Hooks pré-commit actifs (git commit --no-verify pour contourner)')
