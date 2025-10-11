"use client"

import { useState, useCallback } from 'react'
import Map, { Marker, Popup, NavigationControl, MarkerEvent, ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { Asset } from '@/types/asset'
import { Badge } from '@/components/ui/badge'
import 'mapbox-gl/dist/mapbox-gl.css'

interface AssetMapProps {
  assets: Asset[]
  height?: string
}

// Default Mapbox token - users should replace with their own
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export function AssetMap({ assets, height = '500px' }: AssetMapProps) {
  const [popupInfo, setPopupInfo] = useState<Asset | null>(null)
  
  // Filter assets with valid location data
  const assetsWithLocation = assets.filter(asset => asset.location)
  
  // Calculate center of map based on assets
  const centerLat = assetsWithLocation.length > 0
    ? assetsWithLocation.reduce((sum, asset) => sum + (asset.location?.lat || 0), 0) / assetsWithLocation.length
    : 24.7136
  const centerLng = assetsWithLocation.length > 0
    ? assetsWithLocation.reduce((sum, asset) => sum + (asset.location?.lng || 0), 0) / assetsWithLocation.length
    : 46.6753

  const [viewState, setViewState] = useState({
    longitude: centerLng,
    latitude: centerLat,
    zoom: 12
  })

  const getMarkerColor = (status: Asset['status']) => {
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

  const getCategoryIcon = (category: Asset['category']) => {
    return category.charAt(0).toUpperCase()
  }

  const onMarkerClick = useCallback((asset: Asset) => {
    setPopupInfo(asset)
  }, [])

  const onPopupClose = useCallback(() => {
    setPopupInfo(null)
  }, [])

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {assetsWithLocation.map((asset) => (
          <Marker
            key={asset.asset_id}
            longitude={asset.location!.lng}
            latitude={asset.location!.lat}
            anchor="bottom"
            onClick={(e: MarkerEvent<MouseEvent>) => {
              e.originalEvent.stopPropagation()
              onMarkerClick(asset)
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
                  backgroundColor: getMarkerColor(asset.status),
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
                  borderTop: `8px solid ${getMarkerColor(asset.status)}`,
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
                      {new Date(popupInfo.last_maintenance_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

