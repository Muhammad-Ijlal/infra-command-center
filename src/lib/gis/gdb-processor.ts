import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { GisLayer, GisFeature, GdbLayerInfo, GdbImportResult, GdbImportOptions } from '@/types/gis'
import { supabaseAdmin } from '@/lib/supabase/server'

const execAsync = promisify(exec)

export class GdbProcessor {
  private tempDir: string

  constructor() {
    this.tempDir = tmpdir()
  }

  /**
   * List all layers in a .gdb file
   */
  async listLayers(gdbPath: string): Promise<GdbLayerInfo[]> {
    try {
      // Use ogrinfo to get layer information
      const { stdout } = await execAsync(`ogrinfo -so "${gdbPath}"`)
      
      const layers: GdbLayerInfo[] = []
      const lines = stdout.split('\n')
      let currentLayer: Partial<GdbLayerInfo> | null = null

      for (const line of lines) {
        const trimmed = line.trim()
        
        if (trimmed.startsWith('Layer name:')) {
          if (currentLayer) {
            layers.push(currentLayer as GdbLayerInfo)
          }
          currentLayer = {
            name: trimmed.replace('Layer name:', '').trim(),
            fields: []
          }
        } else if (currentLayer && trimmed.startsWith('Geometry:')) {
          const geometryType = trimmed.replace('Geometry:', '').trim()
          currentLayer.geometry_type = this.mapGeometryType(geometryType)
          currentLayer.type = this.mapLayerType(geometryType)
        } else if (currentLayer && trimmed.startsWith('Feature Count:')) {
          currentLayer.feature_count = parseInt(trimmed.replace('Feature Count:', '').trim())
        } else if (currentLayer && trimmed.includes(':')) {
          // Field definition
          const fieldMatch = trimmed.match(/^(\w+):\s*(.+)$/)
          if (fieldMatch) {
            currentLayer.fields!.push({
              name: fieldMatch[1],
              type: fieldMatch[2],
              nullable: true
            })
          }
        }
      }

      if (currentLayer) {
        layers.push(currentLayer as GdbLayerInfo)
      }

      return layers
    } catch (error) {
      console.error('Error listing GDB layers:', error)
      throw new Error(`Failed to list layers from GDB file: ${error}`)
    }
  }

  /**
   * Convert a specific layer from .gdb to GeoJSON
   */
  async convertLayerToGeoJSON(
    gdbPath: string, 
    layerName: string, 
    outputPath?: string
  ): Promise<string> {
    const tempFile = outputPath || join(this.tempDir, `layer_${Date.now()}.geojson`)
    
    try {
      // Use ogr2ogr to convert the layer to GeoJSON
      const command = `ogr2ogr -f GeoJSON "${tempFile}" "${gdbPath}" "${layerName}"`
      await execAsync(command)
      
      return tempFile
    } catch (error) {
      console.error('Error converting layer to GeoJSON:', error)
      throw new Error(`Failed to convert layer ${layerName} to GeoJSON: ${error}`)
    }
  }

  /**
   * Import a .gdb layer into Supabase
   */
  async importLayer(
    gdbPath: string,
    layerName: string,
    options: GdbImportOptions = {}
  ): Promise<GdbImportResult> {
    const result: GdbImportResult = {
      success: false,
      features_imported: 0,
      errors: [],
      warnings: []
    }

    try {
      // First, get layer information
      const layers = await this.listLayers(gdbPath)
      const layerInfo = layers.find(l => l.name === layerName)
      
      if (!layerInfo) {
        result.errors.push(`Layer ${layerName} not found in GDB file`)
        return result
      }

      // Convert layer to GeoJSON
      const geoJsonPath = await this.convertLayerToGeoJSON(gdbPath, layerName)
      
      try {
        // Read the GeoJSON file
        const geoJsonContent = await readFile(geoJsonPath, 'utf-8')
        const geoJson = JSON.parse(geoJsonContent)

        // Create the layer record in Supabase
        const { data: layerData, error: layerError } = await supabaseAdmin
          .from('gis_layers')
          .insert({
            name: options.layer_name || layerName,
            description: options.description || `Imported from ${gdbPath}`,
            source_file: gdbPath,
            layer_type: layerInfo.type,
            geometry_type: layerInfo.geometry_type,
            srid: options.srid || 4326
          })
          .select()
          .single()

        if (layerError) {
          result.errors.push(`Failed to create layer: ${layerError.message}`)
          return result
        }

        result.layer_id = layerData.id

        // Import features in batches
        const batchSize = options.batch_size || 1000
        const features = geoJson.features || []
        
        for (let i = 0; i < features.length; i += batchSize) {
          const batch = features.slice(i, i + batchSize)
          
          const featuresToInsert = batch.map((feature: any) => ({
            layer_id: layerData.id,
            feature_id: feature.id?.toString() || `feature_${i + batch.indexOf(feature)}`,
            geometry: feature.geometry,
            properties: feature.properties || {}
          }))

          const { error: featuresError } = await supabaseAdmin
            .from('gis_features')
            .insert(featuresToInsert)

          if (featuresError) {
            if (options.skip_errors) {
              result.warnings.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${featuresError.message}`)
            } else {
              result.errors.push(`Failed to insert features batch: ${featuresError.message}`)
              return result
            }
          } else {
            result.features_imported += featuresToInsert.length
          }
        }

        result.success = true
        return result

      } finally {
        // Clean up temporary file
        try {
          await unlink(geoJsonPath)
        } catch (cleanupError) {
          result.warnings.push(`Failed to clean up temporary file: ${cleanupError}`)
        }
      }

    } catch (error) {
      result.errors.push(`Import failed: ${error}`)
      return result
    }
  }

  /**
   * Import all layers from a .gdb file
   */
  async importAllLayers(
    gdbPath: string,
    options: GdbImportOptions = {}
  ): Promise<GdbImportResult[]> {
    const layers = await this.listLayers(gdbPath)
    const results: GdbImportResult[] = []

    for (const layer of layers) {
      const result = await this.importLayer(gdbPath, layer.name, {
        ...options,
        layer_name: options.layer_name ? `${options.layer_name}_${layer.name}` : layer.name
      })
      results.push(result)
    }

    return results
  }

  /**
   * Get GIS layers from Supabase
   */
  async getLayers(): Promise<GisLayer[]> {
    const { data, error } = await supabaseAdmin
      .from('gis_layers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch layers: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get features for a specific layer
   */
  async getLayerFeatures(
    layerId: string, 
    limit: number = 1000,
    offset: number = 0
  ): Promise<GisFeature[]> {
    const { data, error } = await supabaseAdmin
      .from('gis_features')
      .select('*')
      .eq('layer_id', layerId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch features: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get layer with feature count
   */
  async getLayerWithFeatures(layerId: string): Promise<GisLayer & { features: GisFeature[], feature_count: number }> {
    const { data: layer, error: layerError } = await supabaseAdmin
      .from('gis_layers')
      .select('*')
      .eq('id', layerId)
      .single()

    if (layerError) {
      throw new Error(`Failed to fetch layer: ${layerError.message}`)
    }

    const { data: features, error: featuresError } = await supabaseAdmin
      .from('gis_features')
      .select('*')
      .eq('layer_id', layerId)
      .limit(100) // Limit features for performance

    if (featuresError) {
      throw new Error(`Failed to fetch features: ${featuresError.message}`)
    }

    const { count } = await supabaseAdmin
      .from('gis_features')
      .select('*', { count: 'exact', head: true })
      .eq('layer_id', layerId)

    return {
      ...layer,
      features: features || [],
      feature_count: count || 0
    }
  }

  /**
   * Map PostGIS geometry type to our LayerType
   */
  private mapLayerType(geometryType: string): LayerType {
    const type = geometryType.toLowerCase()
    if (type.includes('point')) return 'point'
    if (type.includes('line')) return 'line'
    if (type.includes('polygon')) return 'polygon'
    return 'collection'
  }

  /**
   * Map PostGIS geometry type to our GeometryType
   */
  private mapGeometryType(geometryType: string): string {
    return geometryType.toUpperCase()
  }
}

export const gdbProcessor = new GdbProcessor()
