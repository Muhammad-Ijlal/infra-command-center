import { supabaseAdmin } from '@/lib/supabase/server'
import { GisFeature, GeoJSONGeometry } from '@/types/gis'

export interface AssetFromGdb {
  asset_id: string
  name: string
  category: string
  status: 'operational' | 'maintenance_required' | 'under_maintenance'
  impact_score: number
  location_lat?: number
  location_lng?: number
  location_address?: string
  source_file?: string
  source_layer?: string
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
  passport_data: Record<string, string | number | boolean | null | undefined | string[]> // All GDB properties + computed fields
}

export class AssetConverter {
  /**
   * Convert GDB features to assets with integrated passport data
   */
  async convertGdbFeaturesToAssets(
    layerName: string,
    features: GisFeature[]
  ): Promise<AssetFromGdb[]> {
    const assets: AssetFromGdb[] = []

    for (const feature of features) {
      const asset = this.createAssetFromFeature(layerName, feature)
      assets.push(asset)
    }

    return assets
  }

  /**
   * Create asset record from GDB feature with integrated passport data
   */
  private createAssetFromFeature(layerName: string, feature: GisFeature): AssetFromGdb {
    const properties = feature.properties
    const category = this.mapLayerToCategory(layerName)
    
    // Generate asset ID based on category and feature ID
    const assetId = this.generateAssetId(category, feature.feature_id)
    
    // Extract location from geometry
    const location = this.extractLocationFromGeometry(feature.geometry)
    
    // Extract name from properties or generate one
    const name = this.generateAssetName(category, properties, feature.feature_id)
    
    // Determine status based on properties
    const status = this.determineAssetStatus(properties)
    
    // Calculate impact score based on properties
    const impactScore = this.calculateImpactScore(properties)

    // Create comprehensive passport data with all GDB properties + computed fields
    const passportData = {
      // Original GDB properties
      ...properties,
      
      // Computed asset passport fields
      primary_material: this.extractPrimaryMaterial(category, properties),
      secondary_materials: this.extractSecondaryMaterials(properties),
      manufacturer: this.extractManufacturer(properties),
      installation_date: this.extractDate(properties, 'INSTALLATIONDATE'),
      vision_2030_compliant: this.checkVision2030Compliance(properties),
      qcs_certified: this.checkQcsCertification(properties),
      last_inspection_date: this.extractDate(properties, 'ASSET_CONDITION_DATE'),
      certifications: this.extractCertifications(properties),
      related_detections: [],
      
      // Detailed GDB properties (flattened for database storage)
      gfcode: properties.GFCODE,
      data_load_id: properties.DATA_LOAD_ID,
      parent_asset_id: properties.PARENT_ASSET_ID,
      parent_globalid: properties.PARENT_GLOBALID,
      location_global_id: properties.LOCATION_GLOBAL_ID,
      mxsiteid: properties.MXSITEID,
      mxassetnum: properties.MXASSETNUM,
      mxlocation: properties.MXLOCATION,
      mxcreationstate: properties.MXCREATIONSTATE,
      rowstamp: properties.ROWSTAMP,
      source_dept_section_unit: properties.SOURCE_DEPT_SECTION_UNIT,
      hierarchyid: properties.HIERARCHYID,
      bim_id: properties.BIM_ID,
      rmc_guid: properties.RMC_GUID,
      frameworkzone: properties.FRAMEWORKZONE,
      warranty_end: this.extractDate(properties, 'WARRANTY_END'),
      
      // Traffic Sign specific fields
      sign_width: properties.SIGN_WIDTH,
      sign_type: properties.SIGN_TYPE,
      sign_category: properties.SIGN_CATEGORY,
      sign_code: properties.SIGN_CODE,
      sign_dimension: properties.SIGN_DIMENSION,
      sign_description: properties.SIGN_DESCRIPTION,
      sign_class: properties.SIGN_CLASS,
      sign_face_material: properties.SIGN_FACE_MATERIAL,
      sign_face_type: properties.SIGN_FACE_TYPE,
      sign_language: properties.SIGN_LANGUAGE,
      sign_post_standard: properties.SIGN_POST_STANDARD,
      sign_serial_no: properties.SIGN_SERIAL_NO,
      type_installation: properties.TYPE_INSTALLATION,
      pole_type: properties.POLE_TYPE,
      foundation: properties.FOUNDATION,
      background_color: properties.BACKGROUND_COLOR,
      traffic_sign_illumination: properties.TRAFFIC_SIGN_ILLUMINATION,
      post_mount_type: properties.POST_MOUNT_TYPE,
      text_symbol_color: properties.TEXT_SYMBOL_COLOR,
      
      // Road Marking Line specific fields
      code: properties.CODE,
      material_type: properties.MATERIAL_TYPE,
      road_marking_colour: properties.ROAD_MARKING_COLOUR,
      type_of_application: properties.TYPE_OF_APPLICATION,
      shape_length: properties.SHAPE_Length
    }

    return {
      asset_id: assetId,
      name,
      category,
      status,
      impact_score: impactScore,
      location_lat: location?.lat,
      location_lng: location?.lng,
      location_address: this.generateAddress(properties),
      // Core GDB fields that are actually populated
      asset_tag: properties.ASSET_TAG as string,
      asset_priority: properties.ASSET_PRIORITY as number,
      asset_condition: properties.ASSET_CONDITION as string,
      mx_status: properties.MXSTATUS as string,
      installation_date: this.extractDate(properties, 'INSTALLATIONDATE'),
      last_updated_date: this.extractDate(properties, 'LAST_UPDATED_DATE'),
      last_edited_by: properties.LAST_EDITED_BY as string,
      survey_date: this.extractDate(properties, 'SURVEY_DATE'),
      survey_method: properties.SURVEY_METHOD as string,
      remarks: properties.REMARKS as string,
      description: properties.DESCRIPTION as string,
      maintainer: properties.MAINTAINER as string,
      // Location information from GDB
      district: properties.DISTRICT as string,
      municipality: properties.MUNICIPALITY as string,
      road_class: properties.ROAD_CLASS as string,
      road_type: properties.ROAD_TYPE as string,
      zone_no: properties.ZONE_NO as number,
      nrs_number: properties.NRS_NUMBER as string,
      nrs_section_number: properties.NRS_SECTION_NUMBER as string,
      // Project information from GDB
      project_id: properties.PROJECT_ID as string,
      project_code: properties.PROJECT_CODE as string,
      passport_data: passportData
    }
  }

  /**
   * Map GDB layer name to asset category
   */
  private mapLayerToCategory(layerName: string): string {
    const layer = layerName.toLowerCase()
    
    if (layer.includes('traffic') && layer.includes('sign')) return 'traffic_sign'
    if (layer.includes('road') && layer.includes('marking') && layer.includes('line')) return 'road_marking_line'
    if (layer.includes('guardrail')) return 'guardrail'
    if (layer.includes('street') && layer.includes('light') && layer.includes('pole')) return 'street_light_pole'
    if (layer.includes('bridge')) return 'bridge'
    if (layer.includes('road') || layer.includes('carriageway')) return 'road'
    
    return 'other'
  }

  /**
   * Generate asset ID based on category and feature ID
   */
  private generateAssetId(category: string, featureId: string): string {
    const categoryPrefix = this.getCategoryPrefix(category)
    // Use a hash of the full feature ID to ensure uniqueness
    const hash = this.simpleHash(featureId)
    return `ASSET-${categoryPrefix}-${hash}`
  }

  /**
   * Simple hash function to create unique IDs from feature IDs
   */
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8)
  }

  /**
   * Get category prefix for asset ID
   */
  private getCategoryPrefix(category: string): string {
    const prefixes: Record<string, string> = {
      'traffic_sign': 'TS',
      'road_marking_line': 'RML',
      'guardrail': 'GR',
      'street_light_pole': 'SLP',
      'bridge': 'BR',
      'road': 'RD',
      'other': 'OTH'
    }
    return prefixes[category] || 'OTH'
  }

  /**
   * Generate asset name from properties
   */
  private generateAssetName(category: string, properties: Record<string, string | number | boolean | null | undefined | string[]>, featureId: string): string {
    // Try to use ASSET_TAG or similar field
    if (properties.ASSET_TAG) {
      return `${category.replace('_', ' ').toUpperCase()}: ${properties.ASSET_TAG}`
    }
    
    // Try to use location-based naming
    if (properties.DISTRICT && properties.MUNICIPALITY) {
      return `${category.replace('_', ' ').toUpperCase()}: ${properties.DISTRICT}, ${properties.MUNICIPALITY}`
    }
    
    // Fallback to generic name
    return `${category.replace('_', ' ').toUpperCase()}: ${featureId}`
  }

  /**
   * Extract location from geometry
   */
  private extractLocationFromGeometry(geometry: GeoJSONGeometry): { lat: number; lng: number } | null {
    if (!geometry || !geometry.coordinates) return null

    let coords: number[]
    
    switch (geometry.type) {
      case 'Point':
        coords = geometry.coordinates as number[]
        break
      case 'LineString':
        // Use first point of line
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        coords = (geometry.coordinates as any)[0]
        break
      case 'MultiLineString':
        // Use first point of first line
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        coords = (geometry.coordinates as any)[0][0]
        break
      case 'Polygon':
        // Use first point of first ring
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        coords = (geometry.coordinates as any)[0][0]
        break
      case 'MultiPolygon':
        // Use first point of first ring of first polygon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        coords = (geometry.coordinates as any)[0][0][0]
        break
      default:
        return null
    }

    // Convert from Qatar National Grid (EPSG:2932) to WGS84 (EPSG:4326)
    // This is a simplified conversion - in production you'd use proper coordinate transformation
    return {
      lat: coords[1] / 111000, // Rough conversion
      lng: coords[0] / 111000   // Rough conversion
    }
  }

  /**
   * Determine asset status from properties
   */
  private determineAssetStatus(properties: Record<string, string | number | boolean | null | undefined | string[]>): 'operational' | 'maintenance_required' | 'under_maintenance' {
    const condition = typeof properties.ASSET_CONDITION === 'string' ? properties.ASSET_CONDITION.toLowerCase() : ''
    const status = typeof properties.MXSTATUS === 'string' ? properties.MXSTATUS.toLowerCase() : ''
    
    if (condition === 'poor' || condition === 'critical') return 'maintenance_required'
    if (status === 'maintenance' || status === 'repair') return 'under_maintenance'
    
    return 'operational'
  }

  /**
   * Calculate impact score based on properties
   */
  private calculateImpactScore(properties: Record<string, string | number | boolean | null | undefined | string[]>): number {
    let score = 50 // Base score
    
    // Increase score based on priority
    if (typeof properties.ASSET_PRIORITY === 'number') {
      score += properties.ASSET_PRIORITY * 5
    }
    
    // Increase score for critical roads
    if (properties.ROAD_CLASS === 'Primary' || properties.ROAD_CLASS === 'Highway') {
      score += 20
    }
    
    // Decrease score for poor condition
    const condition = typeof properties.ASSET_CONDITION === 'string' ? properties.ASSET_CONDITION.toLowerCase() : ''
    if (condition === 'poor') score -= 15
    if (condition === 'critical') score -= 25
    
    return Math.max(0, Math.min(100, score))
  }

  /**
   * Extract date from properties
   */
  private extractDate(properties: Record<string, string | number | boolean | null | undefined | string[]>, fieldName: string): string | undefined {
    const dateValue = properties[fieldName]
    if (!dateValue) return undefined
    
    // Handle different date formats
    if (typeof dateValue === 'string') {
      return dateValue.split('T')[0] // Extract date part from datetime
    }
    
    return undefined
  }

  /**
   * Calculate next maintenance date
   */
  private calculateNextMaintenanceDate(properties: Record<string, string | number | boolean | null | undefined | string[]>): string | undefined {
    const lastUpdate = this.extractDate(properties, 'LAST_UPDATED_DATE')
    if (!lastUpdate) return undefined
    
    // Add 6 months to last update date
    const lastUpdateDate = new Date(lastUpdate)
    const nextDate = new Date(lastUpdateDate.getTime() + (6 * 30 * 24 * 60 * 60 * 1000))
    
    return nextDate.toISOString().split('T')[0]
  }

  /**
   * Generate address from properties
   */
  private generateAddress(properties: Record<string, string | number | boolean | null | undefined | string[]>): string | undefined {
    const parts = []
    
    if (properties.DISTRICT) parts.push(properties.DISTRICT)
    if (properties.MUNICIPALITY) parts.push(properties.MUNICIPALITY)
    if (properties.ROAD_CLASS) parts.push(properties.ROAD_CLASS)
    
    return parts.length > 0 ? parts.join(', ') : undefined
  }

  /**
   * Extract primary material based on asset category and properties
   */
  private extractPrimaryMaterial(category: string, properties: Record<string, string | number | boolean | null | undefined | string[]>): string {
    switch (category) {
      case 'traffic_sign':
        return properties.SIGN_FACE_MATERIAL as string || properties.SIGN_TYPE as string || 'Traffic Sign Material'
      case 'road_marking_line':
        return properties.ROAD_MARKING_COLOUR as string || 'Road Marking Material'
      default:
        return properties.MATERIAL as string || 'Unknown Material'
    }
  }

  /**
   * Extract manufacturer information from properties
   */
  private extractManufacturer(properties: Record<string, string | number | boolean | null | undefined | string[]>): string | undefined {
    // Look for manufacturer-related fields
    if (properties.MANUFACTURER) return properties.MANUFACTURER as string
    if (properties.SIGN_SERIAL_NO) return 'Serial: ' + properties.SIGN_SERIAL_NO
    return undefined
  }

  /**
   * Extract secondary materials from properties
   */
  private extractSecondaryMaterials(properties: Record<string, string | number | boolean | null | undefined | string[]>): string[] | undefined {
    const materials: string[] = []
    
    // Traffic Sign materials
    if (typeof properties.POLE_TYPE === 'string') materials.push(`Pole: ${properties.POLE_TYPE}`)
    if (typeof properties.FOUNDATION === 'string') materials.push(`Foundation: ${properties.FOUNDATION}`)
    if (typeof properties.SIGN_POST_STANDARD === 'string') materials.push(`Post Standard: ${properties.SIGN_POST_STANDARD}`)
    if (typeof properties.BACKGROUND_COLOR === 'string') materials.push(`Background: ${properties.BACKGROUND_COLOR}`)
    if (typeof properties.TEXT_SYMBOL_COLOR === 'string') materials.push(`Text Color: ${properties.TEXT_SYMBOL_COLOR}`)
    
    // Road Marking materials
    if (typeof properties.MATERIAL_TYPE === 'number') materials.push(`Material Type: ${properties.MATERIAL_TYPE}`)
    if (typeof properties.TYPE_OF_APPLICATION === 'string') materials.push(`Application: ${properties.TYPE_OF_APPLICATION}`)
    
    // Generic materials
    if (typeof properties.MATERIAL === 'string') materials.push(properties.MATERIAL)
    if (typeof properties.GURAIL_TYPE === 'string') materials.push(properties.GURAIL_TYPE)
    
    return materials.length > 0 ? materials : undefined
  }

  /**
   * Check Vision 2030 compliance
   */
  private checkVision2030Compliance(properties: Record<string, string | number | boolean | null | undefined | string[]>): boolean {
    // Simple heuristic based on installation date and condition
    const installDate = this.extractDate(properties, 'INSTALLATIONDATE')
    const condition = typeof properties.ASSET_CONDITION === 'string' ? properties.ASSET_CONDITION.toLowerCase() : ''
    
    if (installDate && new Date(installDate) > new Date('2020-01-01')) {
      return condition !== 'poor' && condition !== 'critical'
    }
    
    return false
  }

  /**
   * Check QCS certification
   */
  private checkQcsCertification(properties: Record<string, string | number | boolean | null | undefined | string[]>): boolean {
    // Simple heuristic based on manufacturer and installation date
    const manufacturer = typeof properties.MANUFACTURER === 'string' ? properties.MANUFACTURER.toLowerCase() : ''
    const installDate = this.extractDate(properties, 'INSTALLATIONDATE')
    
    if (manufacturer && installDate && new Date(installDate) > new Date('2015-01-01')) {
      return true // Assume certified if recent installation
    }
    
    return false
  }

  /**
   * Extract certifications from properties
   */
  private extractCertifications(properties: Record<string, string | number | boolean | null | undefined | string[]>): string[] | undefined {
    const certifications = []
    
    // Add default certifications based on compliance
    if (this.checkVision2030Compliance(properties)) {
      certifications.push('Vision 2030 Compliant')
    }
    
    if (this.checkQcsCertification(properties)) {
      certifications.push('QCS Certified')
    }
    
    return certifications.length > 0 ? certifications : undefined
  }

  /**
   * Save assets to database with integrated passport data
   */
  async saveAssetsToDatabase(
    assets: AssetFromGdb[],
    sourceFile?: string
  ): Promise<{ success: boolean; assetIds: string[]; errors: string[] }> {
    const assetIds: string[] = []
    const errors: string[] = []

    try {
      console.log(`Attempting to save ${assets.length} assets to database`)
      
      for (const asset of assets) {
        try {
          // Insert asset with integrated passport data
          const { data: assetData, error: assetError } = await supabaseAdmin
            .from('assets')
            .insert({
              asset_id: asset.asset_id,
              name: asset.name,
              category: asset.category,
              status: asset.status,
              impact_score: asset.impact_score,
              location_lat: asset.location_lat,
              location_lng: asset.location_lng,
              location_address: asset.location_address,
              source_file: asset.source_file || sourceFile,
              source_layer: asset.source_layer,
              // Core GDB fields
              asset_tag: asset.asset_tag,
              asset_priority: asset.asset_priority,
              asset_condition: asset.asset_condition,
              mx_status: asset.mx_status,
              installation_date: asset.installation_date,
              last_updated_date: asset.last_updated_date,
              last_edited_by: asset.last_edited_by,
              survey_date: asset.survey_date,
              survey_method: asset.survey_method,
              remarks: asset.remarks,
              description: asset.description,
              maintainer: asset.maintainer,
              // Location information
              district: asset.district,
              municipality: asset.municipality,
              road_class: asset.road_class,
              road_type: asset.road_type,
              zone_no: asset.zone_no,
              nrs_number: asset.nrs_number,
              nrs_section_number: asset.nrs_section_number,
              // Project information
              project_id: asset.project_id,
              project_code: asset.project_code,
              passport_data: asset.passport_data
            })
            .select()
            .single()

          if (assetError) {
            console.error(`Failed to create asset ${asset.asset_id}:`, assetError)
            errors.push(`Failed to create asset ${asset.asset_id}: ${assetError.message}`)
            continue
          }

          assetIds.push(assetData.id)
          console.log(`Successfully created asset: ${asset.asset_id}`)
        } catch (insertError) {
          console.error(`Database insertion error for asset ${asset.asset_id}:`, insertError)
          errors.push(`Database insertion error for asset ${asset.asset_id}: ${insertError instanceof Error ? insertError.message : 'Unknown error'}`)
        }
      }

      console.log(`Database save completed. Success: ${assetIds.length}, Errors: ${errors.length}`)
      
      return {
        success: errors.length === 0,
        assetIds,
        errors
      }
    } catch (error) {
      console.error('Critical database error:', error)
      return {
        success: false,
        assetIds,
        errors: [`Critical database error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }
}

export const assetConverter = new AssetConverter()
