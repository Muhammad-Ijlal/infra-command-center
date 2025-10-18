export interface Engineer {
  engineer_id: string
  name: string
  email: string
  phone?: string
  specialization: EngineerSpecialization[]
  status: 'available' | 'busy' | 'offline'
  current_assignments: number
  max_assignments: number
  sla_compliance_rate: number // Percentage of SLA deadlines met
  average_response_time_hours: number
  skills: string[]
  certifications?: string[]
  created_at: string
  last_active?: string
}

export type EngineerSpecialization = 
  | 'traffic_signals' 
  | 'asphalt_repair' 
  | 'structural_maintenance' 
  | 'electrical_systems' 
  | 'drainage_systems' 
  | 'bridge_maintenance' 
  | 'road_maintenance' 
  | 'general_maintenance'

export interface EngineerAssignment {
  assignment_id: string
  detection_id: string
  engineer_id: string
  assigned_at: string
  status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimated_duration_hours: number
  actual_duration_hours?: number
  notes?: string
}
