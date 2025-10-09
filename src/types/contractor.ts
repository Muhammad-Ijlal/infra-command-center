export type ContractorScope = 'road_maintenance' | 'bridge_repair' | 'electrical' | 'structural' | 'general' | 'all'
export type ComplianceLevel = 'excellent' | 'good' | 'fair' | 'poor'

export interface Contractor {
  contractor_id: string
  name: string
  scope: ContractorScope[]
  sla_compliance: ComplianceLevel
  avg_response_time: number // in hours
  capacity: number // percentage
  rating: number // 0-5
  active_contracts: number
  completed_contracts: number
  contact: {
    email: string
    phone?: string
    representative?: string
  }
  certifications?: string[]
}

export interface ContractorMatch {
  contractor: Contractor
  match_score: number
  availability: 'available' | 'limited' | 'unavailable'
  estimated_response: string
  estimated_cost?: number
}

