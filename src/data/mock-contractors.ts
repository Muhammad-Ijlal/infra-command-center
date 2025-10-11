import { Contractor } from '@/types/contractor'

export const mockContractors: Contractor[] = [
  {
    contractor_id: 'CNT-001',
    name: 'AlRajhi Construction',
    scope: ['road_maintenance', 'general'],
    sla_compliance: 'excellent',
    avg_response_time: 4,
    capacity: 65,
    rating: 4.8,
    active_contracts: 12,
    completed_contracts: 156,
    contact: {
      email: 'projects@alrajhi-const.sa',
      phone: '+966 11 234 5678',
      representative: 'Ahmed Al-Rajhi'
    },
    certifications: ['ISO 9001', 'OHSAS 18001', 'Vision 2030 Certified']
  },
  {
    contractor_id: 'CNT-002',
    name: 'Saudi Infrastructure Co.',
    scope: ['road_maintenance', 'bridge_repair', 'structural'],
    sla_compliance: 'excellent',
    avg_response_time: 3,
    capacity: 45,
    rating: 4.9,
    active_contracts: 18,
    completed_contracts: 203,
    contact: {
      email: 'info@saudinfra.sa',
      phone: '+966 11 345 6789',
      representative: 'Mohammed Al-Faisal'
    },
    certifications: ['ISO 9001', 'ISO 14001', 'QCS 2014', 'Vision 2030 Certified']
  },
  {
    contractor_id: 'CNT-003',
    name: 'Bridge Experts Ltd.',
    scope: ['bridge_repair', 'structural'],
    sla_compliance: 'good',
    avg_response_time: 6,
    capacity: 80,
    rating: 4.5,
    active_contracts: 8,
    completed_contracts: 89,
    contact: {
      email: 'contact@bridgeexperts.sa',
      phone: '+966 11 456 7890',
      representative: 'Khalid Al-Otaibi'
    },
    certifications: ['ISO 9001', 'Bridge Safety Specialist']
  },
  {
    contractor_id: 'CNT-004',
    name: 'ElectroTech Solutions',
    scope: ['electrical'],
    sla_compliance: 'excellent',
    avg_response_time: 2,
    capacity: 55,
    rating: 4.7,
    active_contracts: 15,
    completed_contracts: 312,
    contact: {
      email: 'service@electrotech.sa',
      phone: '+966 11 567 8901',
      representative: 'Faisal Al-Harbi'
    },
    certifications: ['ISO 9001', 'Electrical Safety Cert', 'Smart City Partner']
  },
  {
    contractor_id: 'CNT-005',
    name: 'Universal Maintenance Group',
    scope: ['general', 'all'],
    sla_compliance: 'good',
    avg_response_time: 5,
    capacity: 70,
    rating: 4.3,
    active_contracts: 22,
    completed_contracts: 445,
    contact: {
      email: 'contracts@umg.sa',
      phone: '+966 11 678 9012',
      representative: 'Abdullah Al-Zahrani'
    },
    certifications: ['ISO 9001', 'Multi-Sector Certified']
  }
]

