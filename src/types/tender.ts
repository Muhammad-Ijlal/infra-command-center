export type TenderStatus = 'pending_approval' | 'published' | 'submission_period' | 'evaluation' | 'awarded' | 'cancelled'
export type TenderType = 'open' | 'restricted' | 'negotiated'

export interface Tender {
  tender_id: string
  title: string
  type: TenderType
  status: TenderStatus
  asset_id?: string
  detection_id?: string
  description: string
  requirements: string[]
  submission_deadline: string
  opening_date: string
  created_date: string
  estimated_value?: number
  currency: string
  suitable_contractors?: string[] // Array of contractor IDs
  sla_terms?: SLATerms
  approvals?: Approval[]
}

export interface SLATerms {
  response_time: number // hours
  completion_time: number // days
  quality_standards: string[]
  penalties?: string
  warranty_period?: number // months
}

export interface Approval {
  approver_name: string
  approver_role: string
  status: 'pending' | 'approved' | 'rejected'
  date?: string
  comments?: string
}

