import type {
  PlanetaryLimit, RadarData, SocietalIndicators,
  EcologicalCharts, TickerItem, Decision,
  GlobalStats, BlockchainState,
} from '@/types/index'
import { planetaryLimits, radarData } from '@/data/planetaryLimits'
import { societalIndicators, ecologicalCharts, tickerItems } from '@/data/societalIndicators'
import { decisions, globalStats, blockchainState } from '@/data/decisions'

export const DataService = {
  async getPlanetaryLimits(): Promise<PlanetaryLimit[]> {
    // TODO: GET https://owid-api.example.com/planetary-boundaries
    return planetaryLimits
  },

  async getRadarData(): Promise<RadarData> {
    return radarData
  },

  async getSocietalIndicators(): Promise<SocietalIndicators> {
    // TODO: GET https://sdg-api.un.org/indicators
    return societalIndicators
  },

  async getEcologicalCharts(): Promise<EcologicalCharts> {
    // TODO: GET https://ourworldindata.org/api/v1/...
    return ecologicalCharts
  },

  async getTickerItems(): Promise<TickerItem[]> {
    return tickerItems
  },

  async getActiveDecision(): Promise<Decision | null> {
    const active = decisions.find((d) => d.status === 'active')
    // TODO: GET /api/blockchain/decisions/active
    return active ?? null
  },

  async getDecisionHistory(): Promise<Decision[]> {
    // TODO: GET /api/blockchain/decisions?status=validated
    return decisions.filter((d) => d.status !== 'active')
  },

  async getAllDecisions(): Promise<Decision[]> {
    return decisions
  },

  async getGlobalStats(): Promise<GlobalStats> {
    // TODO: GET /api/stats/global
    return globalStats
  },

  async getBlockchainState(): Promise<BlockchainState> {
    // TODO: blockchain.service.ts — lire l'état on-chain via ethers.js
    return blockchainState
  },
}
