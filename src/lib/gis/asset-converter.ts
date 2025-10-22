import { supabaseAdmin } from '@/lib/supabase/server'
import { GisFeature, GeoJSONGeometry } from '@/types/gis'

export interface AssetFromGdb {
  asset_id: string
  name: string
  category: string
  status: 'operational' | 'maintenance_required' | 'under_maintenance'
  last_maintenance_date?: string
  next_maintenance_date?: string
  impact_score: number
  location_lat?: number
  location_lng?: number
  location_address?: string
  source_file?: string
  source_layer?: string
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
      primary_material: properties.MATERIAL || undefined,
      secondary_materials: this.extractSecondaryMaterials(properties),
      manufacturer: properties.MANUFACTURER || undefined,
      installation_date: this.extractDate(properties, 'INSTALLATIONDATE'),
      vision_2030_compliant: this.checkVision2030Compliance(properties),
      qcs_certified: this.checkQcsCertification(properties),
      last_inspection_date: this.extractDate(properties, 'ASSET_CONDITION_DATE'),
      certifications: this.extractCertifications(properties),
      related_detections: [],
      
      // Additional computed fields
      asset_priority: properties.ASSET_PRIORITY || 0,
      asset_condition: properties.ASSET_CONDITION || 'unknown',
      road_class: properties.ROAD_CLASS || undefined,
      district: properties.DISTRICT || undefined,
      municipality: properties.MUNICIPALITY || undefined,
      zone_number: properties.ZONE_NO || undefined,
      last_updated_by: properties.LAST_EDITED_BY || undefined,
      survey_date: this.extractDate(properties, 'SURVEY_DATE'),
      survey_method: properties.SURVEY_METHOD || undefined,
      remarks: properties.REMARKS || undefined,
      description: properties.DESCRIPTION || undefined,
      bim_id: properties.BIM_ID || undefined,
      rmc_guid: properties.RMC_GUID || undefined,
      framework_zone: properties.FRAMEWORKZONE || undefined,
      maintainer: properties.MAINTAINER || undefined
    }

    return {
      asset_id: assetId,
      name,
      category,
      status,
      last_maintenance_date: this.extractDate(properties, 'LAST_UPDATED_DATE'),
      next_maintenance_date: this.calculateNextMaintenanceDate(properties),
      impact_score: impactScore,
      location_lat: location?.lat,
      location_lng: location?.lng,
      location_address: this.generateAddress(properties),
      passport_data: passportData
    }
  }

  /**
   * Map GDB layer name to asset category
   */
  private mapLayerToCategory(layerName: string): string {
    const layer = layerName.toLowerCase()
    
    if (layer.includes('guardrail')) return 'guardrail'
    if (layer.includes('street') && layer.includes('light') && layer.includes('pole')) return 'street_light_pole'
    if (layer.includes('traffic') && layer.includes('signal')) return 'traffic_signal'
    if (layer.includes('bridge')) return 'bridge'
    if (layer.includes('road') || layer.includes('carriageway')) return 'road'
    
    return 'infrastructure'
  }

  /**
   * Generate asset ID based on category and feature ID
   */
  private generateAssetId(category: string, featureId: string): string {
    const categoryPrefix = this.getCategoryPrefix(category)
    const shortFeatureId = featureId.substring(0, 8) // Use first 8 chars of feature ID
    return `ASSET-${categoryPrefix}-${shortFeatureId}`
  }

  /**
   * Get category prefix for asset ID
   */
  private getCategoryPrefix(category: string): string {
    const prefixes: Record<string, string> = {
      'guardrail': 'GR',
      'street_light_pole': 'SLP',
      'traffic_signal': 'TS',
      'bridge': 'BR',
      'road': 'RD',
      'infrastructure': 'INF'
    }
    return prefixes[category] || 'INF'
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
   * Extract secondary materials from properties
   */
  private extractSecondaryMaterials(properties: Record<string, string | number | boolean | null | undefined | string[]>): string[] | undefined {
    const materials: string[] = []
    
    if (typeof properties.MATERIAL === 'string') materials.push(properties.MATERIAL)
    if (typeof properties.GURAIL_TYPE === 'string') materials.push(properties.GURAIL_TYPE)
    if (typeof properties.FOUNDATION === 'string') materials.push(`Foundation: ${properties.FOUNDATION}`)
    
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
      for (const asset of assets) {
        // Insert asset with integrated passport data
        const { data: assetData, error: assetError } = await supabaseAdmin
          .from('assets')
          .insert({
            asset_id: asset.asset_id,
            name: asset.name,
            category: asset.category,
            status: asset.status,
            last_maintenance_date: asset.last_maintenance_date,
            next_maintenance_date: asset.next_maintenance_date,
            impact_score: asset.impact_score,
            location_lat: asset.location_lat,
            location_lng: asset.location_lng,
            location_address: asset.location_address,
            source_file: asset.source_file || sourceFile,
            source_layer: asset.source_layer,
            passport_data: asset.passport_data
          })
          .select()
          .single()

        if (assetError) {
          errors.push(`Failed to create asset ${asset.asset_id}: ${assetError.message}`)
          continue
        }

        assetIds.push(assetData.id)
      }

      return {
        success: errors.length === 0,
        assetIds,
        errors
      }
    } catch (error) {
      return {
        success: false,
        assetIds,
        errors: [`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }
}

export const assetConverter = new AssetConverter()
