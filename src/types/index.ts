// ─── Limites Planétaires ──────────────────────────────────────────────────────

export type LimitStatus = 'safe' | 'zone_incertitude' | 'depasse'

export interface TimeSeries {
  years: number[]
  values: number[]
}

export interface PlanetaryLimit {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
  definition: string
  unit: string
  threshold: number
  currentValue: number
  ratio: number
  status: LimitStatus
  sources: string
  timeSeries: TimeSeries
}

export interface RadarData {
  labels: string[]
  values: number[]
  colors: string[]
}

// ─── Indicateurs Sociétaux ────────────────────────────────────────────────────

export interface SubIndicator {
  label: string
  value: number
  color: string
}

export interface StatItem {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
  color: string
}

export interface SocietalIndicatorBase {
  label: string
  icon: string
  color: string
  source: string
}

export interface GaugeIndicator extends SocietalIndicatorBase {
  unit: string
  criticalThreshold: number
  current: number
  timeSeries?: TimeSeries
}

export interface ConflictIndicator extends SocietalIndicatorBase {
  subIndicators: SubIndicator[]
}

export interface StatIndicator extends SocietalIndicatorBase {
  stats: StatItem[]
}

export interface SocietalIndicators {
  foodSecurity: GaugeIndicator
  waterAccess: GaugeIndicator
  geopoliticalConflicts: ConflictIndicator
  globalHealth: StatIndicator
  inequality: StatIndicator
}

export interface TickerItem {
  emoji: string
  label: string
  value: string
  colorClass: string
}

// ─── Indicateurs Écologiques (Dashboard) ─────────────────────────────────────

export interface EnergyCategory {
  label: string
  value: number
  color: string
}

export interface ResourceDataset {
  label: string
  color: string
  bgColor: string
  values: number[]
}

export interface EcologicalCharts {
  co2: {
    label: string
    unit: string
    color: string
    source: string
    timeSeries: TimeSeries
  }
  temperature: {
    label: string
    unit: string
    color: string
    source: string
    timeSeries: TimeSeries
  }
  forest: {
    label: string
    unit: string
    color: string
    criticalThreshold: number
    current: number
    source: string
  }
  energyMix: {
    label: string
    unit: string
    source: string
    categories: EnergyCategory[]
  }
  resources: {
    label: string
    unit: string
    source: string
    datasets: ResourceDataset[]
    years: number[]
  }
}

// ─── Décisions & Vote ─────────────────────────────────────────────────────────

export type MitigationPolicyStatus = 'active' | 'validated' | 'rejected' | 'expired'
export type VoteOptionId = 'pour' | 'contre' | 'abst'

export interface VoteOption {
  id: VoteOptionId
  label: string
  color: string
  bgClass: string
  borderClass: string
}

export interface VoteTally {
  pour: number
  contre: number
  abst: number
}

// ─── Vote par classement — méthode de Condorcet ───────────────────────────────

// Comptages pairwise pour un scrutin à 3 candidats A (idx 0), B (idx 1), C (idx 2)
export interface PairwiseVotes {
  ab: number  // votants préférant A à B
  ba: number
  ac: number  // votants préférant A à C
  ca: number
  bc: number  // votants préférant B à C
  cb: number
}

export type BallotStatus = 'active' | 'closed'

export interface DecisionBallot {
  id: string
  sessionId: number
  decisionIds: [string, string, string]
  pairwise: PairwiseVotes
  totalVoters: number
  deadline: string
  status: BallotStatus
}

export interface MitigationPolicyResource {
  title: string
  excerpt: string
  url: string
}

export interface ProspectiveNarrative {
  horizon: string
  label: string
  colorClass: string
  borderClass: string
  text: string
}

export interface ProjectionSeries {
  baseline: number[]
  decided: number[]
  pessimist: number[]
}

export interface MitigationPolicyProjections {
  labels: number[]
  co2: ProjectionSeries
  temperature: ProjectionSeries
}

export interface IpccReference {
  report: string
  section: string
  sectionTitle: string
  excerpt: string
  url: string
}

export interface MitigationPolicy {
  id: string
  sessionId: number
  number: string
  status: MitigationPolicyStatus
  title: string
  summary?: string
  description: string
  ipccReference?: IpccReference
  options?: VoteOption[]
  votes?: VoteTally
  consensusThreshold?: number
  deadline: string
  resources: MitigationPolicyResource[]
  projectedImpact: Record<string, number>
  prospectiveNarratives: Record<string, ProspectiveNarrative>
  projections: MitigationPolicyProjections | Record<string, never>
}

export interface VotePcts {
  pour: number
  contre: number
  abst: number
}

// ─── Blockchain ───────────────────────────────────────────────────────────────

export interface BlockchainState {
  lastHash: string
  blocksValidated: number
  activeNodes: number
  latencyMs: number
  lastBlockTime: number
}

export interface BlockchainVoteResult {
  hash: string
  blockNumber: number
}

// ─── Stats globales ───────────────────────────────────────────────────────────

export interface GlobalStats {
  totalDecisions: number
  validatedDecisions: number
  totalSessions: number
  uniquePlayers: number
}

// ─── Composants Charts ────────────────────────────────────────────────────────

export interface ChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor?: string
  fill?: boolean
  tension?: number
  pointRadius?: number
}
