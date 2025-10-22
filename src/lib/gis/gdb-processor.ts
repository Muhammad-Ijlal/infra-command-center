import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { GisLayer, GisFeature, GdbLayerInfo, GdbImportResult, GdbImportOptions, LayerType, GeometryType, GdbFieldInfo, GeoJSONFeature } from '@/types/gis'
import { supabaseAdmin } from '@/lib/supabase/server'
import { extractGdbZip, cleanupExtractedFiles } from './zip-processor'
import { AssetConverter } from './asset-converter'

const execAsync = promisify(exec)

export class GdbProcessor {
  private tempDir: string
  private assetConverter: AssetConverter

  constructor() {
    this.tempDir = tmpdir()
    this.assetConverter = new AssetConverter()
  }

  /**
   * Process ZIP file containing .gdb folder
   */
  async processZipFile(zipBuffer: Buffer): Promise<{ gdbPath: string; cleanup: () => Promise<void> }> {
    const extractionResult = await extractGdbZip(zipBuffer)
    
    if (!extractionResult.success || !extractionResult.extractedPath) {
      throw new Error(extractionResult.error || 'Failed to extract ZIP file')
    }

    return {
      gdbPath: extractionResult.extractedPath,
      cleanup: () => cleanupExtractedFiles(extractionResult.extractedPath!)
    }
  }

  /**
   * List all layers in a .gdb file with feature counts
   */
  async listLayers(gdbPath: string): Promise<GdbLayerInfo[]> {
    try {
      // First, get all layers with basic info
      const { stdout } = await execAsync(`ogrinfo -so "${gdbPath}"`)
      
      const layers: GdbLayerInfo[] = []
      const lines = stdout.split('\n')

      // Parse layer information
      for (const line of lines) {
        const trimmed = line.trim()
        
        // Skip empty lines and info lines
        if (!trimmed || trimmed.startsWith('INFO:') || trimmed.startsWith('Using driver')) {
          continue
        }

        // Skip group definitions - we want a flat list
        if (trimmed.startsWith('Group ')) {
          continue
        }

        // Check if this is a layer definition
        if (trimmed.startsWith('Layer:')) {
          const layerMatch = trimmed.match(/Layer:\s*(.+?)\s*\((.+?)\)/)
          if (layerMatch) {
            const layerName = layerMatch[1].trim()
            const geometryType = layerMatch[2].trim()
            
            layers.push({
              name: layerName,
              type: this.mapLayerType(geometryType),
              geometry_type: this.mapGeometryType(geometryType),
              feature_count: 0, // Will be updated below
              fields: [],
              extent: undefined
            })
          }
        }
      }

      // Now get feature counts for all layers efficiently
      if (layers.length > 0) {
        try {
          // Use ogrinfo with -al flag to get detailed info for all layers at once
          const { stdout: detailStdout } = await execAsync(`ogrinfo -al "${gdbPath}"`)
          const detailLines = detailStdout.split('\n')
          
          let currentLayerIndex = -1
          for (const line of detailLines) {
            const trimmed = line.trim()
            
            // Check if this is a layer header
            if (trimmed.startsWith('Layer name:')) {
              const layerNameMatch = trimmed.match(/Layer name:\s*(.+)/)
              if (layerNameMatch) {
                const layerName = layerNameMatch[1].trim()
                currentLayerIndex = layers.findIndex(l => l.name === layerName)
              }
            }
            
            // Check for feature count
            if (trimmed.startsWith('Feature Count:') && currentLayerIndex >= 0) {
              const countMatch = trimmed.match(/Feature Count:\s*(\d+)/)
              if (countMatch) {
                layers[currentLayerIndex].feature_count = parseInt(countMatch[1], 10)
              }
            }
          }
        } catch (detailError) {
          console.warn('Failed to get detailed layer info, falling back to individual queries:', detailError)
          
          // Fallback: get feature count for each layer individually
          for (let i = 0; i < layers.length; i++) {
            const layer = layers[i]
            try {
              const { stdout: countStdout } = await execAsync(`ogrinfo -so -al "${gdbPath}" "${layer.name}"`)
              const countMatch = countStdout.match(/Feature Count:\s*(\d+)/)
              if (countMatch) {
                layer.feature_count = parseInt(countMatch[1], 10)
              }
            } catch (countError) {
              console.warn(`Failed to get feature count for layer ${layer.name}:`, countError)
              // Try alternative method using ogrinfo with -q flag
              try {
                const { stdout: altStdout } = await execAsync(`ogrinfo -q "${gdbPath}" "${layer.name}"`)
                const altLines = altStdout.split('\n')
                for (const line of altLines) {
                  if (line.includes('Feature Count:')) {
                    const match = line.match(/Feature Count:\s*(\d+)/)
                    if (match) {
                      layer.feature_count = parseInt(match[1], 10)
                      break
                    }
                  }
                }
              } catch (altError) {
                console.warn(`Alternative count method also failed for layer ${layer.name}:`, altError)
              }
            }
          }
        }
      }

      return layers
    } catch (error) {
      console.error('Error listing GDB layers:', error)
      throw new Error(`Failed to list layers from GDB file: ${error}`)
    }
  }

  /**
   * Get detailed information about a specific layer including fields
   */
  async getLayerDetails(gdbPath: string, layerName: string): Promise<GdbLayerInfo | null> {
    try {
      const { stdout } = await execAsync(`ogrinfo -so -al "${gdbPath}" "${layerName}"`)
      const lines = stdout.split('\n')
      
      let layerInfo: GdbLayerInfo | null = null
      let currentField: GdbFieldInfo | null = null
      const fields: GdbFieldInfo[] = []
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        // Parse layer name and geometry type
        if (trimmed.startsWith('Layer name:')) {
          const nameMatch = trimmed.match(/Layer name:\s*(.+)/)
          if (nameMatch) {
            layerInfo = {
              name: nameMatch[1].trim(),
              type: 'point', // Will be updated below
              geometry_type: 'POINT', // Will be updated below
              feature_count: 0,
              fields: [],
              extent: undefined
            }
          }
        }
        
        // Parse geometry type
        if (trimmed.startsWith('Geometry:')) {
          const geomMatch = trimmed.match(/Geometry:\s*(.+)/)
          if (geomMatch && layerInfo) {
            const geomType = geomMatch[1].trim()
            layerInfo.type = this.mapLayerType(geomType)
            layerInfo.geometry_type = this.mapGeometryType(geomType)
          }
        }
        
        // Parse feature count
        if (trimmed.startsWith('Feature Count:')) {
          const countMatch = trimmed.match(/Feature Count:\s*(\d+)/)
          if (countMatch && layerInfo) {
            layerInfo.feature_count = parseInt(countMatch[1], 10)
          }
        }
        
        // Parse extent
        if (trimmed.startsWith('Extent:')) {
          const extentMatch = trimmed.match(/Extent:\s*\(([^,]+),\s*([^)]+)\)\s*-\s*\(([^,]+),\s*([^)]+)\)/)
          if (extentMatch && layerInfo) {
            layerInfo.extent = {
              min_x: parseFloat(extentMatch[1]),
              min_y: parseFloat(extentMatch[2]),
              max_x: parseFloat(extentMatch[3]),
              max_y: parseFloat(extentMatch[4])
            }
          }
        }
        
        // Parse fields
        if (trimmed.startsWith('Field')) {
          const fieldMatch = trimmed.match(/Field\s+(\d+):\s*(.+)/)
          if (fieldMatch) {
            currentField = {
              name: fieldMatch[2].trim(),
              type: '',
              length: 0,
              precision: 0,
              nullable: true
            }
          }
        }
        
        if (currentField && trimmed.startsWith('Type:')) {
          const typeMatch = trimmed.match(/Type:\s*(.+)/)
          if (typeMatch) {
            currentField.type = typeMatch[1].trim()
          }
        }
        
        if (currentField && trimmed.startsWith('Width:')) {
          const widthMatch = trimmed.match(/Width:\s*(\d+)/)
          if (widthMatch) {
            currentField.length = parseInt(widthMatch[1], 10)
          }
        }
        
        if (currentField && trimmed.startsWith('Precision:')) {
          const precisionMatch = trimmed.match(/Precision:\s*(\d+)/)
          if (precisionMatch) {
            currentField.precision = parseInt(precisionMatch[1], 10)
            fields.push(currentField)
            currentField = null
          }
        }
      }
      
      if (layerInfo) {
        layerInfo.fields = fields
      }
      
      return layerInfo
    } catch (error) {
      console.error(`Error getting layer details for ${layerName}:`, error)
      return null
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
      console.log('Running ogr2ogr command:', command)
      const { stdout, stderr } = await execAsync(command)
      console.log('ogr2ogr stdout:', stdout)
      console.log('ogr2ogr stderr:', stderr)
      
      return tempFile
    } catch (error) {
      console.error('Error converting layer to GeoJSON:', error)
      throw new Error(`Failed to convert layer ${layerName} to GeoJSON: ${error}`)
    }
  }

  /**
   * Import a .gdb layer directly as assets (simplified flow)
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

      console.log(`Importing layer: ${layerName} with ${layerInfo.feature_count} features`)

      // Convert layer to GeoJSON
      const geoJsonPath = await this.convertLayerToGeoJSON(gdbPath, layerName)
      console.log('GeoJSON path:', geoJsonPath)
      
      try {
        // Read the GeoJSON file
        const geoJsonContent = await readFile(geoJsonPath, 'utf-8')
        const geoJson = JSON.parse(geoJsonContent)
        console.log('GeoJSON features count:', geoJson.features?.length || 0)
        
        if (!geoJson.features || geoJson.features.length === 0) {
          result.errors.push('No features found in the layer')
          return result
        }

        // Convert features to GisFeature format for asset converter
        const gisFeatures: GisFeature[] = geoJson.features.map((feature: GeoJSONFeature, index: number) => ({
          id: `temp_${index}`,
          layer_id: 'temp_layer',
          feature_id: feature.id?.toString() || `feature_${index}`,
          geometry: feature.geometry,
          properties: feature.properties || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        console.log(`Converting ${gisFeatures.length} features to assets...`)

        // Convert features to assets
        const assets = await this.assetConverter.convertGdbFeaturesToAssets(layerName, gisFeatures)
        console.log(`Created ${assets.length} assets from features`)

        // Set source information for all assets
        assets.forEach(asset => {
          asset.source_file = gdbPath
          asset.source_layer = layerName
        })

        // Save assets to database in batches
        const batchSize = options.batch_size || 100
        let totalAssetsCreated = 0

        for (let i = 0; i < assets.length; i += batchSize) {
          const batch = assets.slice(i, i + batchSize)
          
          console.log(`Saving asset batch ${Math.floor(i / batchSize) + 1} with ${batch.length} assets`)

          const saveResult = await this.assetConverter.saveAssetsToDatabase(batch, gdbPath)
          
          if (saveResult.success) {
            totalAssetsCreated += saveResult.assetIds.length
            console.log(`Successfully saved ${saveResult.assetIds.length} assets`)
          } else {
            console.error('Asset save errors:', saveResult.errors)
            if (options.skip_errors) {
              result.warnings.push(`Asset batch ${Math.floor(i / batchSize) + 1} failed: ${saveResult.errors.join(', ')}`)
            } else {
              result.errors.push(`Failed to save asset batch: ${saveResult.errors.join(', ')}`)
              return result
            }
          }
        }

        result.success = true
        result.features_imported = totalAssetsCreated
        console.log(`Import completed successfully. Created ${totalAssetsCreated} assets.`)

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
      console.error('Import failed:', error)
      result.errors.push(`Import failed: ${error}`)
      return result
    }
  }

  /**
   * Import all layers from a .gdb file as assets
   */
  async importAllLayers(
    gdbPath: string,
    options: GdbImportOptions = {}
  ): Promise<GdbImportResult[]> {
    const layers = await this.listLayers(gdbPath)
    const results: GdbImportResult[] = []

    // Only import layers that have features
    const layersWithFeatures = layers.filter(layer => layer.feature_count > 0)
    
    console.log(`Found ${layersWithFeatures.length} layers with features to import`)

    for (const layer of layersWithFeatures) {
      console.log(`Importing layer: ${layer.name} (${layer.feature_count} features)`)
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
    if (type === 'none') return 'point' // Default for unknown types
    if (type.includes('point')) return 'point'
    if (type.includes('line')) return 'line'
    if (type.includes('polygon')) return 'polygon'
    if (type.includes('multi')) {
      if (type.includes('point')) return 'multipoint'
      if (type.includes('line')) return 'multiline'
      if (type.includes('polygon')) return 'multipolygon'
    }
    return 'collection'
  }

  /**
   * Map PostGIS geometry type to our GeometryType
   */
  private mapGeometryType(geometryType: string): GeometryType {
    const type = geometryType.toLowerCase()
    if (type === 'none') return 'POINT' // Default for unknown types
    if (type === 'point') return 'POINT'
    if (type === 'line string') return 'LINESTRING'
    if (type === 'polygon') return 'POLYGON'
    if (type === 'multi point') return 'MULTIPOINT'
    if (type === 'multi line string') return 'MULTILINESTRING'
    if (type === 'multi polygon') return 'MULTIPOLYGON'
    if (type === '3d point') return 'POINT'
    return 'GEOMETRYCOLLECTION'
  }
}

export const gdbProcessor = new GdbProcessor()
