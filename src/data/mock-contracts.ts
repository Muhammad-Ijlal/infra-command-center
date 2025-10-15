import { Contract } from '@/types/contract'

export const mockContracts: Contract[] = [
  {
    contract_id: 'CTR-001',
    detection_id: 'DET-001',
    title: 'Corniche Road Pothole Emergency Repair',
    type: 'direct_award',
    status: 'active',
    asset_id: 'ASSET-R-001',
    contractor_id: 'CNT-001',
    contractor_name: 'Qatari Construction Co.',
    description: 'Emergency repair works for critical pothole on Corniche Road',
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
          description: 'Pothole repair and filling',
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
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Approved for immediate execution'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Budget allocated'
      }
    ]
  },
  {
    contract_id: 'CTR-003',
    title: 'Emergency Tree Removal - C-Ring Road',
    type: 'framework',
    status: 'pending_approval',
    asset_id: 'ASSET-L-012',
    contractor_id: 'CNT-004',
    contractor_name: 'Qatar ElectroTech Solutions',
    description: 'Emergency removal of derooted tree leaning on house on C-Ring Road',
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
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'pending',
        date: '2025-10-06'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'pending',
        date: '2025-10-06'
      }
    ]
  },
  {
    contract_id: 'CTR-004',
    title: 'Solar Panel Replacement - Al Khor Solar Facility',
    type: 'direct_award',
    status: 'active',
    asset_id: 'ASSET-S-001',
    detection_id: 'DET-003',
    contractor_id: 'CNT-004',
    contractor_name: 'Qatar ElectroTech Solutions',
    description: 'Broken solar panel replacement and electrical system maintenance at Al Khor Solar Power Facility',
    sla_terms: {
      response_time: 2,
      completion_time: 7,
      quality_standards: ['IEC 61215', 'IEC 61730', 'QCS 2014', 'Solar Panel Standards'],
      penalties: '1.5% per day delay after SLA breach',
      warranty_period: 60
    },
    created_date: '2025-10-08',
    start_date: '2025-10-09',
    end_date: '2025-10-16',
    value: 85000,
    boq: {
      items: [
        {
          item_id: 'BOQ-009',
          description: 'Broken solar panel removal and disposal',
          unit: 'panel',
          quantity: 12,
          unit_price: 800,
          total_price: 9600
        },
        {
          item_id: 'BOQ-010',
          description: 'New solar panel installation and mounting',
          unit: 'panel',
          quantity: 12,
          unit_price: 1200,
          total_price: 14400
        },
        {
          item_id: 'BOQ-011',
          description: 'Electrical wiring and inverter connection',
          unit: 'panel',
          quantity: 12,
          unit_price: 400,
          total_price: 4800
        },
        {
          item_id: 'BOQ-012',
          description: 'System testing and performance verification',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 15000,
          total_price: 15000
        },
        {
          item_id: 'BOQ-013',
          description: 'Safety equipment and access systems',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 8000,
          total_price: 8000
        },
        {
          item_id: 'BOQ-014',
          description: 'Environmental compliance and waste management',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 5000,
          total_price: 5000
        },
        {
          item_id: 'BOQ-015',
          description: 'Documentation and certification',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 3000,
          total_price: 3000
        }
      ],
      total_estimated_cost: 85000,
      currency: 'QAR'
    },
    approvals: [
      {
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Solar panel replacement approved for immediate execution'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-08',
        comments: 'Renewable energy budget allocated - priority project'
      }
    ]
  },
  {
    contract_id: 'CTR-005',
    title: 'Surveillance Camera Maintenance - C-Ring Road',
    type: 'direct_award',
    status: 'completed',
    asset_id: 'ASSET-L-012',
    detection_id: 'DET-005',
    contractor_id: 'CNT-001',
    contractor_name: 'Qatari Construction Co.',
    description: 'Surveillance camera maintenance and image quality improvement on C-Ring Road',
    sla_terms: {
      response_time: 2,
      completion_time: 3,
      quality_standards: ['ASTM D6433', 'QCS 2014'],
      penalties: '1% per day delay after SLA breach',
      warranty_period: 12
    },
    created_date: '2025-10-05',
    start_date: '2025-10-06',
    end_date: '2025-10-09',
    value: 18000,
    boq: {
      items: [
        {
          item_id: 'BOQ-013',
          description: 'Camera lens cleaning and maintenance',
          unit: 'sq meter',
          quantity: 15,
          unit_price: 200,
          total_price: 3000
        },
        {
          item_id: 'BOQ-014',
          description: 'Camera hardware inspection and repair',
          unit: 'sq meter',
          quantity: 15,
          unit_price: 500,
          total_price: 7500
        },
        {
          item_id: 'BOQ-015',
          description: 'Image quality optimization and calibration',
          unit: 'sq meter',
          quantity: 15,
          unit_price: 300,
          total_price: 4500
        },
        {
          item_id: 'BOQ-016',
          description: 'Traffic management and safety',
          unit: 'lump sum',
          quantity: 1,
          unit_price: 3000,
          total_price: 3000
        }
      ],
      total_estimated_cost: 18000,
      currency: 'QAR'
    },
    approvals: [
      {
        approver_name: 'James Thompson',
        approver_role: 'Technical Director',
        status: 'approved',
        date: '2025-10-05',
        comments: 'Approved for execution'
      },
      {
        approver_name: 'Sarah Mitchell',
        approver_role: 'Operations Manager',
        status: 'approved',
        date: '2025-10-05',
        comments: 'Budget allocated'
      }
    ]
  }
]

