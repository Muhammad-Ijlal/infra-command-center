import { Contractor } from '@/types/contractor'

export const mockContractors: Contractor[] = [
  {
    contractor_id: 'CNT-001',
    name: 'Qatari Construction Co.',
    scope: ['road_maintenance', 'general'],
    sla_compliance: 'excellent',
    avg_response_time: 4,
    capacity: 65,
    rating: 4.8,
    active_contracts: 12,
    completed_contracts: 156,
    contact: {
      email: 'projects@qatari-const.qa',
      phone: '+974 4411 5678',
      representative: 'Ahmed Al-Thani'
    },
    certifications: ['ISO 9001', 'OHSAS 18001', 'Qatar National Vision 2030 Certified']
  },
  {
    contractor_id: 'CNT-002',
    name: 'Qatar Infrastructure Group',
    scope: ['road_maintenance', 'bridge_repair', 'structural'],
    sla_compliance: 'excellent',
    avg_response_time: 3,
    capacity: 45,
    rating: 4.9,
    active_contracts: 18,
    completed_contracts: 203,
    contact: {
      email: 'info@qatarinfra.qa',
      phone: '+974 4422 6789',
      representative: 'Mohammed Al-Kuwari'
    },
    certifications: ['ISO 9001', 'ISO 14001', 'QCS 2014', 'Qatar National Vision 2030 Certified']
  },
  {
    contractor_id: 'CNT-003',
    name: 'Qatar Subsea Pipeline Solutions',
    scope: ['pipeline_maintenance', 'subsea_repair', 'marine_corrosion'],
    sla_compliance: 'excellent',
    avg_response_time: 3,
    capacity: 55,
    rating: 4.7,
    active_contracts: 12,
    completed_contracts: 134,
    contact: {
      email: 'projects@qspi.qa',
      phone: '+974 4433 7890',
      representative: 'Hassan Al-Marri'
    },
    certifications: ['ISO 9001', 'NACE Certification', 'Marine Pipeline Specialist', 'Subsea Safety Cert']
  },
  {
    contractor_id: 'CNT-004',
    name: 'Qatar ElectroTech Solutions',
    scope: ['electrical'],
    sla_compliance: 'excellent',
    avg_response_time: 2,
    capacity: 55,
    rating: 4.7,
    active_contracts: 15,
    completed_contracts: 312,
    contact: {
      email: 'service@qelectrotech.qa',
      phone: '+974 4444 8901',
      representative: 'Faisal Al-Marri'
    },
    certifications: ['ISO 9001', 'Electrical Safety Cert', 'Smart City Partner']
  },
  {
    contractor_id: 'CNT-005',
    name: 'Doha Maintenance Group',
    scope: ['general', 'all'],
    sla_compliance: 'good',
    avg_response_time: 5,
    capacity: 70,
    rating: 4.3,
    active_contracts: 22,
    completed_contracts: 445,
    contact: {
      email: 'contracts@dmg.qa',
      phone: '+974 4455 9012',
      representative: 'Abdullah Al-Sulaiti'
    },
    certifications: ['ISO 9001', 'Multi-Sector Certified']
  },
  {
    contractor_id: 'CNT-006',
    name: 'Qatar Facility Maintenance Solutions',
    scope: ['facility_maintenance', 'structural', 'building_repair'],
    sla_compliance: 'excellent',
    avg_response_time: 2,
    capacity: 60,
    rating: 4.8,
    active_contracts: 16,
    completed_contracts: 198,
    contact: {
      email: 'projects@qfms.qa',
      phone: '+974 4466 0123',
      representative: 'Omar Al-Mansouri'
    },
    certifications: ['ISO 9001', 'Facility Management Cert', 'Structural Safety Cert', 'Qatar National Vision 2030 Certified']
  }
]
