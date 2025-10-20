import { Engineer } from '@/types/engineer'

export const mockEngineers: Engineer[] = [
  {
    engineer_id: 'ENG-001',
    name: 'Alexander Müller',
    email: 'alexander.muller@trags.com',
    phone: '+49 1234 5678',
    specialization: ['electrical_systems', 'general_maintenance'],
    status: 'available',
    current_assignments: 2,
    completed_assignments: 47,
    sla_compliance_rate: 95,
    certifications: ['Electrical Safety Certification', 'Traffic Management Level 2'],
    created_at: '2024-01-15T00:00:00Z',
    last_active: '2025-01-08T14:30:00Z'
  },
  {
    engineer_id: 'ENG-002',
    name: 'Marco Rossi',
    email: 'marco.rossi@trags.com',
    phone: '+39 2345 6789',
    specialization: ['electrical_systems', 'structural_maintenance', 'general_maintenance'],
    status: 'busy',
    current_assignments: 3,
    completed_assignments: 132,
    sla_compliance_rate: 88,
    certifications: ['Road Construction Certification', 'Heavy Machinery License'],
    created_at: '2024-02-20T00:00:00Z',
    last_active: '2025-01-08T13:45:00Z'
  },
  {
    engineer_id: 'ENG-003',
    name: 'Sophie Dubois',
    email: 'sophie.dubois@trags.com',
    phone: '+33 3456 7890',
    specialization: ['structural_maintenance', 'general_maintenance'],
    status: 'available',
    current_assignments: 2,
    completed_assignments: 89,
    sla_compliance_rate: 92,
    certifications: ['Structural Engineering Certification', 'Bridge Inspection License'],
    created_at: '2024-03-10T00:00:00Z',
    last_active: '2025-01-08T15:20:00Z'
  }
]
