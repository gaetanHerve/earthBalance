/**
 * LLMService — couche d'abstraction pour les appels LLM prospectifs
 *
 * Objectif : après validation d'une décision collective, générer une analyse
 * narrative de l'impact sur les indicateurs planétaires (scénarios +10/+20/+50 ans).
 *
 * TODO: intégrer avec l'API Claude (Anthropic SDK)
 *   npm install @anthropic-ai/sdk
 *
 * TODO: créer un endpoint backend proxy (ne jamais exposer la clé API côté client)
 *   POST /api/llm/prospective
 *   Body: { decisionTitle, decisionDescription, currentIndicators, votedOption }
 *   Response: { optimistic, moderate, pessimistic } — objets narratifs
 *
 * TODO: si backend Python/FastAPI : utiliser anthropic.Anthropic().messages.create(...)
 * TODO: si backend Node : utiliser new Anthropic().messages.create(...)
 *
 * Prompt système suggéré (à affiner) :
 *   "Tu es un modèle de simulation prospective planétaire.
 *    À partir d'une décision politique validée par la communauté EarthBalance,
 *    génère trois scénarios d'évolution des indicateurs planétaires et sociétaux
 *    à +10, +20 et +50 ans. Sois factuel, sourcé, concis (150 mots max par scénario).
 *    Format JSON : { optimistic, moderate, pessimistic } — champs: horizon, text."
 */

import type { MitigationPolicy, ProspectiveNarrative } from '@/types/index'

type ProspectiveResult = Record<string, ProspectiveNarrative>

export const LLMService = {
  async generateProspective(
    mitigationPolicy: MitigationPolicy,
    _currentIndicators: Record<string, unknown>,
  ): Promise<ProspectiveResult> {
    // TODO: POST /api/llm/prospective via backend proxy (ne jamais exposer la clé API côté client)
    // const response = await fetch('/api/llm/prospective', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ mitigationPolicy, currentIndicators: _currentIndicators }),
    // })
    // if (!response.ok) throw new Error('Erreur LLM service')
    // return await response.json()
    console.warn('[LLMService] generateProspective — non implémenté (stub). Données fictives retournées.')
    return mitigationPolicy.prospectiveNarratives as ProspectiveResult
  },

  async summarizeMitigationPolicy(mitigationPolicy: MitigationPolicy): Promise<string> {
    // TODO: POST /api/llm/summarize via backend proxy
    console.warn('[LLMService] summarizeMitigationPolicy — non implémenté (stub)')
    return mitigationPolicy.description.slice(0, 120) + '…'
  },

}
