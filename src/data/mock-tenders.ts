import { Tender } from '@/types/tender'

export const mockTenders: Tender[] = [
  {
    tender_id: 'TND-001',
    title: 'West Bay Traffic Control Tower Structural Repair',
    type: 'open',
    status: 'pending_approval',
    asset_id: 'ASSET-F-001',
    detection_id: 'DET-006',
    description: 'Structural crack repair and reinforcement works for West Bay Traffic Control Tower control room following detection of critical structural crack',
    requirements: [
      'Minimum 10 years experience in structural repair and building maintenance',
      'Valid Qatar construction license',
      'ISO 9001:2015 certification',
      'Previous experience with similar structural repair projects in critical infrastructure',
      'Capability to work in occupied facilities with minimal disruption to operations',
      'Structural engineering expertise for crack assessment and repair'
    ],
    submission_deadline: '2025-10-20T17:00:00Z',
    opening_date: '2025-10-21T09:00:00Z',
    created_date: '2025-10-08',
    estimated_value: 320000,
    currency: 'QAR',
    suitable_contractors: ['CNT-002', 'CNT-005', 'CNT-006'], // AI-matched contractors for structural repair
    sla_terms: {
      response_time: 1,
      completion_time: 10,
      quality_standards: ['ASTM C39', 'QCS 2014', 'ISO 9001:2015', 'Structural Safety Standards'],
      penalties: '1% per day delay after SLA breach',
      warranty_period: 36
    },
    approvals: [
      {
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'pending',
        date: '2025-10-08',
        comments: 'Urgent structural repair specifications under review'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'pending',
        date: '2025-10-08',
        comments: 'Critical infrastructure budget allocation confirmed'
      }
    ]
  },
  {
    tender_id: 'TND-002',
    title: 'Doha Bay Subsea Pipeline Corrosion Repair',
    type: 'open',
    status: 'published',
    asset_id: 'ASSET-P-001',
    detection_id: 'DET-002',
    description: 'Subsea pipeline corrosion treatment and protective coating restoration for marine pipeline network in Doha Bay',
    requirements: [
      'Minimum 10 years experience in subsea pipeline corrosion treatment',
      'Valid Qatar construction license',
      'ISO 12944 certification for marine corrosion protection',
      'NACE certification for underwater corrosion control',
      'Previous experience with similar subsea pipeline projects',
      'Capability to work underwater with proper diving equipment',
      'Marine environmental compliance certification',
      'Subsea welding and coating application expertise'
    ],
    submission_deadline: '2025-10-25T17:00:00Z',
    opening_date: '2025-10-26T09:00:00Z',
    created_date: '2025-10-07',
    estimated_value: 485000,
    currency: 'QAR',
    suitable_contractors: ['CNT-002', 'CNT-003'], // AI-matched contractors for subsea pipeline repair
    sla_terms: {
      response_time: 2,
      completion_time: 28,
      quality_standards: ['ISO 12944', 'NACE SP0178', 'Marine Pipeline Standards', 'Environmental Protection Standards'],
      penalties: '0.75% per day delay',
      warranty_period: 48
    },
    approvals: [
      {
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-07',
        comments: 'Subsea corrosion repair specifications approved for tender publication'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-07',
        comments: 'Marine infrastructure budget allocation confirmed'
      },
      {
        approver_name: 'Michael Chen',
        approver_role: 'Procurement Manager',
        status: 'approved',
        comments: 'Environmental compliance review completed'
      }
    ]
  }
]
