import { Contract } from '@/src/types/contract'

export const mockContracts: Contract[] = [
  {
    contract_id: 'CTR-001',
    title: 'King Fahd Road Emergency Repair',
    type: 'direct_award',
    status: 'active',
    asset_id: 'ASSET-R-001',
    contractor_id: 'CNT-001',
    contractor_name: 'AlRajhi Construction',
    description: 'Emergency repair works for critical crack on King Fahd Road',
    sla_terms: {
      response_time: 4,
      completion_time: 10,
      quality_standards: ['ASTM D6433', 'QCS 2014'],
      penalties: '1% per day delay after SLA breach',
      warranty_period: 24
    },
    created_date: '2025-10-08',
    start_date: '2025-10-09',
    end_date: '2025-10-19',
    value: 125000,
    boq: {
      items: [
        {
          item_id: 'BOQ-001',
          description: 'Crack repair and sealing',
          unit: 'linear meter',
          quantity: 50,
          unit_price: 800,
          total_price: 40000
        },
        {
          item_id: 'BOQ-002',
          description: 'Surface milling',
          unit: 'sq meter',
          quantity: 100,
          unit_price: 150,
          total_price: 15000
        },
        {
          item_id: 'BOQ-003',
          description: 'Asphalt overlay',
          unit: 'sq meter',
          quantity: 100,
          unit_price: 400,
          total_price: 40000
        },
        {
          item_id: 'BOQ-004',
          description: 'Traffic management',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 30000,
          total_price: 30000
        }
      ],
      total_estimated_cost: 125000,
      currency: 'SAR'
    },
    approvals: [
      {
        approver_name: 'Eng. Mohammed Al-Saud',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Approved for immediate execution'
      },
      {
        approver_name: 'Dr. Sarah Al-Mutairi',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Budget allocated'
      }
    ]
  },
  {
    contract_id: 'CTR-002',
    title: 'Bridge Corrosion Treatment - Al-Murooj',
    type: 'tender',
    status: 'pending_approval',
    asset_id: 'ASSET-B-003',
    contractor_id: 'CNT-002',
    contractor_name: 'Saudi Infrastructure Co.',
    description: 'Corrosion treatment and protective coating for bridge support structures',
    sla_terms: {
      response_time: 3,
      completion_time: 21,
      quality_standards: ['ISO 12944', 'NACE SP0178'],
      penalties: '0.5% per day delay',
      warranty_period: 36
    },
    created_date: '2025-10-07',
    value: 285000,
    boq: {
      items: [
        {
          item_id: 'BOQ-005',
          description: 'Surface preparation and cleaning',
          unit: 'sq meter',
          quantity: 200,
          unit_price: 250,
          total_price: 50000
        },
        {
          item_id: 'BOQ-006',
          description: 'Corrosion treatment application',
          unit: 'sq meter',
          quantity: 200,
          unit_price: 600,
          total_price: 120000
        },
        {
          item_id: 'BOQ-007',
          description: 'Protective coating system',
          unit: 'sq meter',
          quantity: 200,
          unit_price: 450,
          total_price: 90000
        },
        {
          item_id: 'BOQ-008',
          description: 'Safety and access equipment',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 25000,
          total_price: 25000
        }
      ],
      total_estimated_cost: 285000,
      currency: 'SAR'
    },
    approvals: [
      {
        approver_name: 'Eng. Mohammed Al-Saud',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-07',
        comments: 'Technical specifications approved'
      },
      {
        approver_name: 'Dr. Sarah Al-Mutairi',
        approver_role: 'Operations Manager',
        status: 'pending',
        comments: ''
      }
    ]
  },
  {
    contract_id: 'CTR-003',
    title: 'Streetlight Maintenance - Olaya Zone 12',
    type: 'framework',
    status: 'sent_to_contractor',
    asset_id: 'ASSET-L-012',
    contractor_id: 'CNT-004',
    contractor_name: 'ElectroTech Solutions',
    description: 'Repair and upgrade of streetlight system in Olaya Zone 12',
    sla_terms: {
      response_time: 2,
      completion_time: 7,
      quality_standards: ['IEC 60598', 'Saudi Electrical Code'],
      penalties: '2% per day for critical failures',
      warranty_period: 12
    },
    created_date: '2025-10-06',
    start_date: '2025-10-10',
    end_date: '2025-10-17',
    value: 45000,
    approvals: [
      {
        approver_name: 'Eng. Mohammed Al-Saud',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-06'
      },
      {
        approver_name: 'Dr. Sarah Al-Mutairi',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-06'
      }
    ]
  },
  {
    contract_id: 'CTR-004',
    title: 'Pothole Repair - Olaya Intersection',
    type: 'tender',
    status: 'draft',
    asset_id: 'ASSET-R-002',
    description: 'Pothole repair and surface restoration at Olaya Street intersection',
    sla_terms: {
      response_time: 4,
      completion_time: 5,
      quality_standards: ['ASTM D6433', 'QCS 2014'],
      warranty_period: 18
    },
    created_date: '2025-10-08',
    value: 35000,
    approvals: []
  }
]

