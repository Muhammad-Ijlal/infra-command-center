import { Contract } from '@/types/contract'

export const mockContracts: Contract[] = [
  {
    contract_id: 'CTR-001',
    title: 'Corniche Road Emergency Repair',
    type: 'direct_award',
    status: 'active',
    asset_id: 'ASSET-R-001',
    contractor_id: 'CNT-001',
    contractor_name: 'Qatari Construction Co.',
    description: 'Emergency repair works for critical crack on Corniche Road',
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
      currency: 'QAR'
    },
    approvals: [
      {
        approver_name: 'Eng. Mohammed Al-Thani',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Approved for immediate execution'
      },
      {
        approver_name: 'Dr. Fatima Al-Kuwari',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Budget allocated'
      }
    ]
  },
  {
    contract_id: 'CTR-002',
    title: 'Bridge Corrosion Treatment - Al Sadd',
    type: 'tender',
    status: 'pending_approval',
    asset_id: 'ASSET-B-003',
    detection_id: 'DET-002',
    suitable_contractors: ['CNT-002', 'CNT-003'], // AI-matched contractors for bridge repair
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
      currency: 'QAR'
    },
    approvals: [
      {
        approver_name: 'Eng. Mohammed Al-Thani',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-07',
        comments: 'Technical specifications approved'
      },
      {
        approver_name: 'Dr. Fatima Al-Kuwari',
        approver_role: 'Operations Manager',
        status: 'pending',
        comments: ''
      }
    ]
  },
  {
    contract_id: 'CTR-003',
    title: 'Streetlight Maintenance - C-Ring Zone 12',
    type: 'framework',
    status: 'sent_to_contractor',
    asset_id: 'ASSET-L-012',
    contractor_id: 'CNT-004',
    contractor_name: 'Qatar ElectroTech Solutions',
    description: 'Repair and upgrade of streetlight system in C-Ring Road Zone 12',
    sla_terms: {
      response_time: 2,
      completion_time: 7,
      quality_standards: ['IEC 60598', 'Qatar Electrical Code'],
      penalties: '2% per day for critical failures',
      warranty_period: 12
    },
    created_date: '2025-10-06',
    start_date: '2025-10-10',
    end_date: '2025-10-17',
    value: 45000,
    approvals: [
      {
        approver_name: 'Eng. Mohammed Al-Thani',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-06'
      },
      {
        approver_name: 'Dr. Fatima Al-Kuwari',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-06'
      }
    ]
  },
  {
    contract_id: 'CTR-004',
    title: 'Pothole Repair - Al Waab Intersection',
    type: 'direct_award',
    status: 'active',
    asset_id: 'ASSET-R-002',
    detection_id: 'DET-003',
    contractor_id: 'CNT-001',
    contractor_name: 'Qatari Construction Co.',
    description: 'Emergency pothole repair and surface restoration at Al Waab Street intersection',
    sla_terms: {
      response_time: 4,
      completion_time: 5,
      quality_standards: ['ASTM D6433', 'QCS 2014'],
      penalties: '1% per day delay after SLA breach',
      warranty_period: 18
    },
    created_date: '2025-10-08',
    start_date: '2025-10-09',
    end_date: '2025-10-14',
    value: 35000,
    boq: {
      items: [
        {
          item_id: 'BOQ-009',
          description: 'Pothole patching and filling',
          unit: 'sq meter',
          quantity: 25,
          unit_price: 600,
          total_price: 15000
        },
        {
          item_id: 'BOQ-010',
          description: 'Surface leveling',
          unit: 'sq meter',
          quantity: 25,
          unit_price: 400,
          total_price: 10000
        },
        {
          item_id: 'BOQ-011',
          description: 'Road marking restoration',
          unit: 'linear meter',
          quantity: 20,
          unit_price: 200,
          total_price: 4000
        },
        {
          item_id: 'BOQ-012',
          description: 'Traffic control and safety',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 6000,
          total_price: 6000
        }
      ],
      total_estimated_cost: 35000,
      currency: 'QAR'
    },
    approvals: [
      {
        approver_name: 'Eng. Mohammed Al-Thani',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Approved for immediate execution'
      },
      {
        approver_name: 'Dr. Fatima Al-Kuwari',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Budget allocated - emergency response'
      }
    ]
  }
]

