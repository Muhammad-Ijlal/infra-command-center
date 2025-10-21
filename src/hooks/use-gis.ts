import { useState, useCallback } from 'react'
import { GisLayer, GisFeature, GdbLayerInfo, GdbImportResult, GdbImportOptions } from '@/types/gis'

interface UseGisResult {
  layers: GisLayer[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchLayers: () => Promise<void>
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
      const response = await fetch('/api/gis/layers?action=layers')
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


  const getLayerFeatures = useCallback(async (
    layerId: string, 
    limit: number = 1000, 
    offset: number = 0
  ): Promise<GisFeature[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/gis/layers?action=layer-features&layerId=${layerId}&limit=${limit}&offset=${offset}`
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
      const response = await fetch(`/api/gis/layers?action=layer-with-features&layerId=${layerId}`)
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
    getLayerFeatures,
    getLayerWithFeatures
  }
}
