/**
 * Détecte le binaire claude CLI sur différentes plateformes.
 * Cherche dans PATH, puis dans les emplacements connus (VS Code extension, npm global, etc.)
 */
import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { homedir, platform } from 'os'
import { spawnSync } from 'child_process'

export function findClaudeBin() {
  // 1. Essai direct dans PATH
  const probe = spawnSync('claude', ['--version'], { encoding: 'utf-8', timeout: 5000 })
  if (!probe.error) return 'claude'

  const home = homedir()
  const isWin = platform() === 'win32'

  // 2. Extension VS Code (Windows et macOS/Linux)
  const vscodeExtDirs = [
    join(home, '.vscode/extensions'),
    join(home, '.vscode-server/extensions'),
  ]

  for (const extDir of vscodeExtDirs) {
    if (!existsSync(extDir)) continue
    const claudeExts = readdirSync(extDir)
      .filter(d => d.startsWith('anthropic.claude-code-'))
      .sort()
    const latest = claudeExts[claudeExts.length - 1]
    if (!latest) continue

    const candidates = [
      join(extDir, latest, 'resources/native-binary/claude.exe'),
      join(extDir, latest, 'resources/native-binary/claude'),
    ]
    for (const bin of candidates) {
      if (existsSync(bin)) return bin
    }
  }

  // 3. Emplacements npm global
  const npmCandidates = isWin
    ? [
        join(home, 'AppData/Roaming/npm/claude.cmd'),
        join(home, 'AppData/Roaming/npm/claude'),
        'C:/Program Files/nodejs/claude.cmd',
      ]
    : [
        '/usr/local/bin/claude',
        '/usr/bin/claude',
        join(home, '.npm-global/bin/claude'),
        join(home, '.local/bin/claude'),
      ]

  for (const bin of npmCandidates) {
    if (existsSync(bin)) return bin
  }

  // 4. Installation standalone macOS/Windows
  const standaloneCandidates = isWin
    ? [join(home, 'AppData/Local/Programs/Claude/claude.exe')]
    : ['/Applications/Claude.app/Contents/MacOS/claude']

  for (const bin of standaloneCandidates) {
    if (existsSync(bin)) return bin
  }

  return null
}
