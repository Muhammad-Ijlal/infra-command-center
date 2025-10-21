'use client'

import { useState, useEffect } from 'react'
import { useGis } from '@/hooks/use-gis'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Layers, Eye, Download, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { GisLayer, GisFeature } from '@/types/gis'

export function GisLayersList() {
  const { layers, loading, error, fetchLayers, getLayerWithFeatures } = useGis()
  const [selectedLayer, setSelectedLayer] = useState<GisLayer | null>(null)
  const [layerFeatures, setLayerFeatures] = useState<GisFeature[]>([])
  const [loadingFeatures, setLoadingFeatures] = useState(false)

  useEffect(() => {
    fetchLayers()
  }, [fetchLayers])

  const handleViewFeatures = async (layer: GisLayer) => {
    setSelectedLayer(layer)
    setLoadingFeatures(true)
    
    try {
      const layerWithFeatures = await getLayerWithFeatures(layer.id)
      setLayerFeatures(layerWithFeatures.features)
    } catch (err) {
      console.error('Failed to load features:', err)
    } finally {
      setLoadingFeatures(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getGeometryTypeIcon = (geometryType: string) => {
    switch (geometryType.toLowerCase()) {
      case 'point':
        return '📍'
      case 'linestring':
        return '📏'
      case 'polygon':
        return '🔷'
      case 'multipoint':
        return '📍📍'
      case 'multilinestring':
        return '📏📏'
      case 'multipolygon':
        return '🔷🔷'
      default:
        return '🗺️'
    }
  }

  const getLayerTypeColor = (layerType: string) => {
    switch (layerType) {
      case 'point':
        return 'bg-blue-100 text-blue-800'
      case 'line':
        return 'bg-green-100 text-green-800'
      case 'polygon':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && layers.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading GIS layers...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">GIS Layers</h2>
          <p className="text-muted-foreground">
            Manage and view your imported GIS data layers
          </p>
        </div>
        <Button onClick={fetchLayers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {layers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No GIS Layers Found</h3>
            <p className="text-muted-foreground mb-4">
              Upload a .GDB file to start importing GIS data
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {layers.map((layer) => (
            <Card key={layer.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getGeometryTypeIcon(layer.geometry_type)}</span>
                    <div>
                      <CardTitle className="text-lg">{layer.name}</CardTitle>
                      <CardDescription>
                        {layer.description || 'No description'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getLayerTypeColor(layer.layer_type)}>
                      {layer.layer_type}
                    </Badge>
                    <Badge variant="outline">
                      SRID: {layer.srid}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {layer.geometry_type}
                    </div>
                    <div className="text-sm text-muted-foreground">Geometry Type</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {layer.source_file.split('/').pop()}
                    </div>
                    <div className="text-sm text-muted-foreground">Source File</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatDate(layer.created_at)}
                    </div>
                    <div className="text-sm text-muted-foreground">Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatDate(layer.updated_at)}
                    </div>
                    <div className="text-sm text-muted-foreground">Updated</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewFeatures(layer)}
                    disabled={loadingFeatures}
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Features
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedLayer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Features in {selectedLayer.name}
            </CardTitle>
            <CardDescription>
              Showing sample features from this layer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFeatures ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading features...</span>
              </div>
            ) : layerFeatures.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Showing {layerFeatures.length} features (sample)
                </div>
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature ID</TableHead>
                        <TableHead>Geometry Type</TableHead>
                        <TableHead>Properties</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {layerFeatures.map((feature) => (
                        <TableRow key={feature.id}>
                          <TableCell className="font-mono text-sm">
                            {feature.feature_id}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {feature.geometry.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {Object.keys(feature.properties).length} properties
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(feature.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No features found in this layer
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
