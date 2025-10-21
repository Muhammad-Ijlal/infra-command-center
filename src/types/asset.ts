export type AssetCategory = 'road' | 'bridge' | 'lighting' | 'other'
export type AssetStatus = 'operational' | 'maintenance_required' | 'under_maintenance'

export interface Asset {
  asset_id: string
  name: string
  category: AssetCategory
  last_maintenance_date: string
  next_maintenance_date?: string
  status: AssetStatus
  impact_score: number
  location?: {
    lat: number
    lng: number
    address?: string
  }
}

export interface AssetPassport {
  asset_id: string
  asset: Asset
  material_info: {
    primary_material: string
    secondary_materials?: string[]
    manufacturer?: string
    installation_date?: string
  }
  maintenance_history: MaintenanceRecord[]
  compliance: {
    vision_2030_compliant: boolean
    qcs_certified: boolean
    last_inspection_date?: string
    certifications?: string[]
  }
  related_detections?: string[]
}

export interface MaintenanceRecord {
  record_id: string
  date: string
  type: 'routine' | 'corrective' | 'preventive' | 'emergency'
  description: string
  cost?: number
  contractor?: string
  status: 'completed' | 'scheduled' | 'in_progress'
}
