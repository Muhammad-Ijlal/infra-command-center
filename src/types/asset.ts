export type AssetCategory = 'traffic_sign' | 'road_marking_line' | 'road' | 'bridge' | 'lighting' | 'other'
export type AssetStatus = 'operational' | 'maintenance_required' | 'under_maintenance' | 'decommissioned'

export interface Asset {
  asset_id: string
  name: string
  category: AssetCategory
  status: AssetStatus
  impact_score: number
  location?: {
    lat: number
    lng: number
    address?: string
  }
  // Core GDB fields that are actually populated
  asset_tag?: string
  asset_priority?: number
  asset_condition?: string
  mx_status?: string
  installation_date?: string
  last_updated_date?: string
  last_edited_by?: string
  survey_date?: string
  survey_method?: string
  remarks?: string
  description?: string
  maintainer?: string
  // Location information from GDB
  district?: string
  municipality?: string
  road_class?: string
  road_type?: string
  zone_no?: number
  nrs_number?: string
  nrs_section_number?: string
  // Project information from GDB
  project_id?: string
  project_code?: string
  // Database fields
  id?: string
  location_lat?: number
  location_lng?: number
  location_address?: string
  source_file?: string
  source_layer?: string
  passport_data?: Record<string, string | number | boolean | string[] | null | undefined>
  created_at?: string
  updated_at?: string
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
  // Detailed GDB passport data
  gdb_properties: {
    // Common fields
    gfcode?: string | number | boolean | string[] | null | undefined
    data_load_id?: string | number | boolean | string[] | null | undefined
    parent_asset_id?: string | number | boolean | string[] | null | undefined
    parent_globalid?: string | number | boolean | string[] | null | undefined
    location_global_id?: string | number | boolean | string[] | null | undefined
    mxsiteid?: string | number | boolean | string[] | null | undefined
    mxassetnum?: string | number | boolean | string[] | null | undefined
    mxlocation?: string | number | boolean | string[] | null | undefined
    mxcreationstate?: string | number | boolean | string[] | null | undefined
    rowstamp?: string | number | boolean | string[] | null | undefined
    source_dept_section_unit?: string | number | boolean | string[] | null | undefined
    hierarchyid?: string | number | boolean | string[] | null | undefined
    bim_id?: string | number | boolean | string[] | null | undefined
    rmc_guid?: string | number | boolean | string[] | null | undefined
    frameworkzone?: string | number | boolean | string[] | null | undefined
    warranty_end?: string | number | boolean | string[] | null | undefined
    // Traffic Sign specific fields
    sign_width?: string | number | boolean | string[] | null | undefined
    sign_type?: string | number | boolean | string[] | null | undefined
    sign_category?: string | number | boolean | string[] | null | undefined
    sign_code?: string | number | boolean | string[] | null | undefined
    sign_dimension?: string | number | boolean | string[] | null | undefined
    sign_description?: string | number | boolean | string[] | null | undefined
    sign_class?: string | number | boolean | string[] | null | undefined
    sign_face_material?: string | number | boolean | string[] | null | undefined
    sign_face_type?: string | number | boolean | string[] | null | undefined
    sign_language?: string | number | boolean | string[] | null | undefined
    sign_post_standard?: string | number | boolean | string[] | null | undefined
    sign_serial_no?: string | number | boolean | string[] | null | undefined
    type_installation?: string | number | boolean | string[] | null | undefined
    pole_type?: string | number | boolean | string[] | null | undefined
    foundation?: string | number | boolean | string[] | null | undefined
    background_color?: string | number | boolean | string[] | null | undefined
    traffic_sign_illumination?: string | number | boolean | string[] | null | undefined
    post_mount_type?: string | number | boolean | string[] | null | undefined
    text_symbol_color?: string | number | boolean | string[] | null | undefined
    // Road Marking Line specific fields
    code?: string | number | boolean | string[] | null | undefined
    material_type?: string | number | boolean | string[] | null | undefined
    road_marking_colour?: string | number | boolean | string[] | null | undefined
    type_of_application?: string | number | boolean | string[] | null | undefined
    shape_length?: string | number | boolean | string[] | null | undefined
  }
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
