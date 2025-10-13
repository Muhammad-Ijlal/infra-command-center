export type DetectionStatus = 'pending' | 'validated' | 'resolved' | 'critical' | 'warning'
export type DefectType = 'crack' | 'pothole' | 'corrosion' | 'wear' | 'structural' | 'electrical' | 'tree lean' | 'structural deterioration' | 'blocked drain' | 'survilance' | 'other'

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
  location?: {
    lat: number
    lng: number
  }
  contract_id?: string // Reference to associated contract
  tender_id?: string // Reference to associated tender (if no contract yet)
}

