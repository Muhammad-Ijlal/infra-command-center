"use client"

import { useState, useCallback } from 'react'
import Map, { Marker, Popup, NavigationControl, MarkerEvent, ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { Asset } from '@/types/asset'
import { AIDetection } from '@/types/detection'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

interface AssetMapProps {
  assets: Asset[]
  detections?: AIDetection[]
  height?: string
}

// Use OpenStreetMap as base layer (no token required)
const OSM_MAP_STYLE = {
  version: 8 as const,
  sources: {
    'osm': {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster' as const,
      source: 'osm'
    }
  ]
}

export function AssetMap({ assets, detections = [], height = '500px' }: AssetMapProps) {
  const [popupInfo, setPopupInfo] = useState<Asset | AIDetection | null>(null)
  const [popupType, setPopupType] = useState<'asset' | 'detection' | null>(null)
  
  // Filter assets with valid location data
  const assetsWithLocation = assets.filter(asset => asset.location)
  
  // Filter detections with valid location data and not completed
  const activeDetections = detections.filter(detection => 
    detection.location && 
    detection.status !== 'completed' && 
    detection.status !== 'resolved'
  )
  
  // Calculate center of map based on assets and detections
  const allLocations = [
    ...assetsWithLocation.map(asset => asset.location!),
    ...activeDetections.map(detection => detection.location!)
  ]
  
  const centerLat = allLocations.length > 0
    ? allLocations.reduce((sum, loc) => sum + loc.lat, 0) / allLocations.length
    : 24.7136
  const centerLng = allLocations.length > 0
    ? allLocations.reduce((sum, loc) => sum + loc.lng, 0) / allLocations.length
    : 46.6753

  const [viewState, setViewState] = useState({
    longitude: centerLng,
    latitude: centerLat,
    zoom: 12
  })

  const getAssetMarkerColor = (status: Asset['status']) => {
    switch (status) {
      case 'operational':
        return '#28A745' // green
      case 'maintenance_required':
        return '#FFC107' // yellow/amber
      case 'under_maintenance':
        return '#0055A4' // blue
      case 'decommissioned':
        return '#DC3545' // red
      default:
        return '#6B7280' // gray
    }
  }

  const getDetectionMarkerColor = (severity: AIDetection['severity'], status: AIDetection['status']) => {
    if (severity === 'critical') return '#DC3545' // red
    if (status === 'in_progress') return '#0055A4' // blue
    if (status === 'pending') return '#FFC107' // yellow/amber
    return '#6B7280' // gray
  }

  const getCategoryIcon = (category: Asset['category']) => {
    return category.charAt(0).toUpperCase()
  }

  const getDetectionIcon = (status: AIDetection['status']) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const onAssetMarkerClick = useCallback((asset: Asset) => {
    setPopupInfo(asset)
    setPopupType('asset')
  }, [])

  const onDetectionMarkerClick = useCallback((detection: AIDetection) => {
    setPopupInfo(detection)
    setPopupType('detection')
  }, [])

  const onPopupClose = useCallback(() => {
    setPopupInfo(null)
    setPopupType(null)
  }, [])

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle={OSM_MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {/* Asset Markers */}
        {assetsWithLocation.map((asset) => (
          <Marker
            key={`asset-${asset.asset_id}`}
            longitude={asset.location!.lng}
            latitude={asset.location!.lat}
            anchor="bottom"
            onClick={(e: MarkerEvent<MouseEvent>) => {
              e.originalEvent.stopPropagation()
              onAssetMarkerClick(asset)
            }}
          >
            <div
              className="cursor-pointer transition-transform hover:scale-110"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: getAssetMarkerColor(asset.status),
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {getCategoryIcon(asset.category)}
              </div>
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `8px solid ${getAssetMarkerColor(asset.status)}`,
                  marginTop: '-2px'
                }}
              />
            </div>
          </Marker>
        ))}

        {/* Detection Markers */}
        {activeDetections.map((detection) => (
          <Marker
            key={`detection-${detection.detection_id}`}
            longitude={detection.location!.lng}
            latitude={detection.location!.lat}
            anchor="bottom"
            onClick={(e: MarkerEvent<MouseEvent>) => {
              e.originalEvent.stopPropagation()
              onDetectionMarkerClick(detection)
            }}
          >
            <div
              className="cursor-pointer transition-transform hover:scale-110"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: getDetectionMarkerColor(detection.severity, detection.status),
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                {getDetectionIcon(detection.status)}
              </div>
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `7px solid ${getDetectionMarkerColor(detection.severity, detection.status)}`,
                  marginTop: '-2px'
                }}
              />
            </div>
          </Marker>
        ))}

        {popupInfo && popupInfo.location && (
          <Popup
            longitude={popupInfo.location.lng}
            latitude={popupInfo.location.lat}
            anchor="top"
            onClose={onPopupClose}
            closeOnClick={false}
            className="asset-popup"
          >
            <div className="p-2 min-w-[250px]">
              {popupType === 'asset' && popupInfo && 'name' in popupInfo && (
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm">{popupInfo.name}</h3>
                    <p className="text-xs text-muted-foreground">{popupInfo.asset_id}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={popupInfo.status === 'operational' ? 'default' : 
                                   popupInfo.status === 'maintenance_required' ? 'destructive' : 
                                   'secondary'}>
                      {popupInfo.status.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {popupInfo.category}
                    </Badge>
                  </div>

                  {popupInfo.location.address && (
                    <p className="text-xs text-muted-foreground">
                      {popupInfo.location.address}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                    <div>
                      <span className="text-muted-foreground">Impact Score</span>
                      <p className="font-semibold">{popupInfo.impact_score}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Maint.</span>
                      <p className="font-semibold">
                        {popupInfo.last_updated_date ? 
                          new Date(popupInfo.last_updated_date).toLocaleDateString() : 
                          'Not available'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {popupType === 'detection' && popupInfo && 'detection_id' in popupInfo && (
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm">{popupInfo.defect_type.replace(/_/g, ' ').toUpperCase()}</h3>
                    <p className="text-xs text-muted-foreground">{popupInfo.detection_id}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={popupInfo.severity === 'critical' ? 'destructive' : 
                                   popupInfo.status === 'pending' ? 'default' : 
                                   'secondary'}>
                      {popupInfo.severity}
                    </Badge>
                    <Badge variant="outline">
                      {popupInfo.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <div className="text-xs">
                    <span className="text-muted-foreground">Asset:</span>
                    <p className="font-semibold">{popupInfo.asset_id}</p>
                  </div>

                  {popupInfo.description && (
                    <p className="text-xs text-muted-foreground">
                      {popupInfo.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                    <div>
                      <span className="text-muted-foreground">Confidence</span>
                      <p className="font-semibold">{Math.round(popupInfo.confidence_score * 100)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SLA</span>
                      <p className="font-semibold">
                        {popupInfo.sla_hours ? `${popupInfo.sla_hours}h` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {popupInfo.assigned_engineer_name && (
                    <div className="pt-2 border-t text-xs">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <p className="font-semibold">{popupInfo.assigned_engineer_name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

