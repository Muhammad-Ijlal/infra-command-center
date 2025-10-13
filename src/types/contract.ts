export type ContractStatus = 'draft' | 'pending_approval' | 'approved' | 'sent_to_contractor' | 'active' | 'completed' | 'cancelled'
export type ContractType = 'direct_award' | 'framework'

export interface Contract {
  contract_id: string
  title: string
  type: ContractType
  status: ContractStatus
  asset_id?: string
  detection_id?: string
  contractor_id?: string
  contractor_name?: string
  description: string
  sla_terms: SLATerms
  created_date: string
  start_date?: string
  end_date?: string
  value?: number
  boq?: BillOfQuantities
  approvals?: Approval[]
}

export interface SLATerms {
  response_time: number // hours
  completion_time: number // days
  quality_standards: string[]
  penalties?: string
  warranty_period?: number // months
}

export interface BillOfQuantities {
  items: BOQItem[]
  total_estimated_cost: number
  currency: string
}

export interface BOQItem {
  item_id: string
  description: string
  unit: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Approval {
  approver_name: string
  approver_role: string
  status: 'pending' | 'approved' | 'rejected'
  date?: string
  comments?: string
}

