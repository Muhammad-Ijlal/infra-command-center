import { Tender } from '@/types/tender'

export const mockTenders: Tender[] = [
  {
    tender_id: 'TND-001',
    title: 'Lusail Expressway Bridge Road Surface Repair',
    type: 'open',
    status: 'published',
    asset_id: 'ASSET-B-001',
    detection_id: 'DET-006',
    description: 'Road surface deterioration repair and restoration works for Lusail Expressway bridge following detection of structural deterioration',
    requirements: [
      'Minimum 10 years experience in road surface repair and bridge maintenance',
      'Valid Qatar construction license',
      'ISO 9001:2015 certification',
      'Previous experience with similar road surface repair projects',
      'Capability to work during night hours to minimize traffic disruption'
    ],
    submission_deadline: '2025-10-20T17:00:00Z',
    opening_date: '2025-10-21T09:00:00Z',
    created_date: '2025-10-08',
    estimated_value: 450000,
    currency: 'QAR',
    suitable_contractors: ['CNT-002', 'CNT-003', 'CNT-005'], // AI-matched contractors for road surface repair
    sla_terms: {
      response_time: 2,
      completion_time: 14,
      quality_standards: ['ASTM D6433', 'QCS 2014', 'ISO 9001:2015'],
      penalties: '0.5% per day delay after SLA breach',
      warranty_period: 24
    },
    approvals: [
      {
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Technical specifications approved for tender publication'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Budget allocation confirmed'
      }
    ]
  },
  {
    tender_id: 'TND-002',
    title: 'Bridge Corrosion Treatment - Al Sadd',
    type: 'open',
    status: 'pending_approval',
    asset_id: 'ASSET-B-003',
    detection_id: 'DET-002',
    description: 'Corrosion treatment and protective coating for bridge support structures',
    requirements: [
      'Minimum 8 years experience in bridge corrosion treatment',
      'Valid Qatar construction license',
      'ISO 12944 certification for corrosion protection',
      'Previous experience with similar bridge corrosion projects',
      'Capability to work at height with proper safety equipment'
    ],
    submission_deadline: '2025-10-25T17:00:00Z',
    opening_date: '2025-10-26T09:00:00Z',
    created_date: '2025-10-07',
    estimated_value: 285000,
    currency: 'QAR',
    suitable_contractors: ['CNT-002', 'CNT-003'], // AI-matched contractors for bridge repair
    sla_terms: {
      response_time: 3,
      completion_time: 21,
      quality_standards: ['ISO 12944', 'NACE SP0178'],
      penalties: '0.5% per day delay',
      warranty_period: 36
    },
    approvals: [
      {
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-07',
        comments: 'Technical specifications approved for tender publication'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-07',
        comments: 'Budget allocation confirmed'
      },
      {
        approver_name: 'Michael Chen',
        approver_role: 'Procurement Manager',
        status: 'pending',
        comments: 'Final procurement review pending'
      }
    ]
  }
]
