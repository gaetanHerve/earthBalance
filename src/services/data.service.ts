import type {
  PlanetaryLimit, RadarData, SocietalIndicators,
  EcologicalCharts, TickerItem, MitigationPolicy,
  GlobalStats, BlockchainState, TimeSeries,
} from '@/types/index'
import { planetaryLimits, radarData } from '@/data/planetaryLimits'
import { societalIndicators, ecologicalCharts, tickerItems, populationTimeSeries } from '@/data/societalIndicators'
import { mitigationPolicies, globalStats, blockchainState } from '@/data/mitigationPolicies'

/**
 * DataService — façade statique vers les fichiers de données locaux.
 *
 * Toutes les méthodes sont intentionnellement async : quand les données
 * seront servies par de vraies API (ODD, OWID, GHO…), les call sites
 * (stores) n'auront pas besoin d'être modifiés — seule cette couche change.
 */
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

  async getActiveMitigationPolicy(): Promise<MitigationPolicy | null> {
    const active = mitigationPolicies.find((d) => d.status === 'active')
    // TODO: GET /api/blockchain/mitigation-policies/active
    return active ?? null
  },

  async getMitigationPolicyHistory(): Promise<MitigationPolicy[]> {
    // TODO: GET /api/blockchain/mitigation-policies?status=validated
    return mitigationPolicies.filter((d) => d.status !== 'active')
  },

  async getAllMitigationPolicies(): Promise<MitigationPolicy[]> {
    return mitigationPolicies
  },

  async getGlobalStats(): Promise<GlobalStats> {
    // TODO: GET /api/stats/global
    return globalStats
  },

  async getBlockchainState(): Promise<BlockchainState> {
    // TODO: blockchain.service.ts — lire l'état on-chain via ethers.js
    return blockchainState
  },

  async getPopulationTimeSeries(): Promise<TimeSeries> {
    // TODO: GET https://population.un.org/wpp/Download/Files/...
    return populationTimeSeries
  },
}
