import { useState, useCallback } from 'react'
import { GisLayer, GisFeature, GdbLayerInfo, GdbImportResult, GdbImportOptions } from '@/types/gis'

interface UseGisResult {
  layers: GisLayer[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchLayers: () => Promise<void>
  listGdbLayers: (gdbPath: string) => Promise<GdbLayerInfo[]>
  importLayer: (gdbPath: string, layerName: string, options?: GdbImportOptions) => Promise<GdbImportResult>
  importAllLayers: (gdbPath: string, options?: GdbImportOptions) => Promise<GdbImportResult[]>
  getLayerFeatures: (layerId: string, limit?: number, offset?: number) => Promise<GisFeature[]>
  getLayerWithFeatures: (layerId: string) => Promise<GisLayer & { features: GisFeature[], feature_count: number }>
}

export function useGis(): UseGisResult {
  const [layers, setLayers] = useState<GisLayer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    setError(errorMessage)
    console.error('GIS operation error:', err)
  }

  const fetchLayers = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/gis?action=layers')
      const result = await response.json()
      
      if (result.success) {
        setLayers(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const listGdbLayers = useCallback(async (gdbPath: string): Promise<GdbLayerInfo[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/gis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list-layers',
          gdbPath
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const importLayer = useCallback(async (
    gdbPath: string, 
    layerName: string, 
    options?: GdbImportOptions
  ): Promise<GdbImportResult> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/gis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'import-layer',
          gdbPath,
          layerName,
          options
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refresh layers list after successful import
        await fetchLayers()
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchLayers])

  const importAllLayers = useCallback(async (
    gdbPath: string, 
    options?: GdbImportOptions
  ): Promise<GdbImportResult[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/gis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'import-all-layers',
          gdbPath,
          options
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refresh layers list after successful import
        await fetchLayers()
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchLayers])

  const getLayerFeatures = useCallback(async (
    layerId: string, 
    limit: number = 1000, 
    offset: number = 0
  ): Promise<GisFeature[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/gis?action=layer-features&layerId=${layerId}&limit=${limit}&offset=${offset}`
      )
      
      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getLayerWithFeatures = useCallback(async (
    layerId: string
  ): Promise<GisLayer & { features: GisFeature[], feature_count: number }> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/gis?action=layer-with-features&layerId=${layerId}`)
      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    layers,
    loading,
    error,
    fetchLayers,
    listGdbLayers,
    importLayer,
    importAllLayers,
    getLayerFeatures,
    getLayerWithFeatures
  }
}
