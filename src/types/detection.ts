export type DetectionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'validated' | 'resolved' | 'critical' | 'warning'
export type DefectType = 'crack' | 'pothole' | 'corrosion' | 'wear' | 'structural' | 'electrical' | 'tree lean' | 'structural deterioration' | 'blocked drain' | 'surveillance' | 'subsea corrosion' | 'panel damage' | 'structural crack' | 'traffic_signal' | 'asphalt' | 'barrier_damage' | 'missing_road_stud' | 'asphalt_damage' | 'other'

export interface AIDetection {
  detection_id: string
  asset_id: string
  defect_type: DefectType
  confidence_score: number
  timestamp: string
  status: DetectionStatus
  severity: 'critical' | 'warning' | 'normal'
  description?: string
  image_url?: string
  baseline_image_url?: string // Original image for comparison
  repair_image_url?: string // Photo uploaded after repair
  location?: {
    lat: number
    lng: number
  }
  // Engineer assignment workflow
  assigned_engineer_id?: string
  assigned_engineer_name?: string
  assignment_timestamp?: string
  suitable_engineers?: string[] // List of engineer IDs suitable for this detection
  sla_hours?: number // SLA in hours (4 for traffic signals, 24 for asphalt, etc.)
  sla_deadline?: string // Calculated deadline
  repair_started_at?: string
  repair_completed_at?: string
  ai_validation_result?: 'approved' | 'rejected' | 'pending' // AI validation of repair
  validation_confidence?: number // AI confidence in repair validation
  detection_device?: string // Device used for detection
  device_model?: string // Model number of the detection device
}

