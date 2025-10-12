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
    name: 'Gulf Bridge Specialists',
    scope: ['bridge_repair', 'structural'],
    sla_compliance: 'good',
    avg_response_time: 6,
    capacity: 80,
    rating: 4.5,
    active_contracts: 8,
    completed_contracts: 89,
    contact: {
      email: 'contact@gulfbridge.qa',
      phone: '+974 4433 7890',
      representative: 'Khalid Al-Attiyah'
    },
    certifications: ['ISO 9001', 'Bridge Safety Specialist']
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
  }
]

