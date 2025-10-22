export type GeometryType = 
  | 'POINT'
  | 'LINESTRING'
  | 'POLYGON'
  | 'MULTIPOINT'
  | 'MULTILINESTRING'
  | 'MULTIPOLYGON'
  | 'GEOMETRYCOLLECTION'

export type LayerType = 
  | 'point'
  | 'line'
  | 'polygon'
  | 'multipoint'
  | 'multiline'
  | 'multipolygon'
  | 'collection'

export interface GisLayer {
  id: string
  name: string
  description?: string
  source_file: string
  layer_type: LayerType
  geometry_type: GeometryType
  srid: number
  created_at: string
  updated_at: string
  created_by?: string
}

export interface GisFeature {
  id: string
  layer_id: string
  feature_id: string
  geometry: GeoJSONGeometry
  properties: Record<string, string | number | boolean | null>
  created_at: string
  updated_at: string
}

export interface GisLayerWithFeatures extends GisLayer {
  features: GisFeature[]
  feature_count: number
}

export interface GdbLayerInfo {
  name: string
  type: LayerType
  geometry_type: GeometryType
  feature_count: number
  fields: GdbFieldInfo[]
  extent?: {
    min_x: number
    min_y: number
    max_x: number
    max_y: number
  }
}

export interface GdbFieldInfo {
  name: string
  type: string
  length?: number
  precision?: number
  nullable: boolean
}

export interface GdbImportResult {
  success: boolean
  layer_id?: string
  features_imported: number
  errors: string[]
  warnings: string[]
}

export interface GdbImportOptions {
  layer_name?: string
  description?: string
  srid?: number
  batch_size?: number
  skip_errors?: boolean
}

// GeoJSON types for geometry handling
export interface GeoJSONGeometry {
  type: string
  coordinates: number[] | number[][] | number[][][] | number[][][][]
}

export interface GeoJSONPoint extends GeoJSONGeometry {
  type: 'Point'
  coordinates: [number, number]
}

export interface GeoJSONLineString extends GeoJSONGeometry {
  type: 'LineString'
  coordinates: [number, number][]
}

export interface GeoJSONPolygon extends GeoJSONGeometry {
  type: 'Polygon'
  coordinates: [number, number][][]
}

export interface GeoJSONMultiPoint extends GeoJSONGeometry {
  type: 'MultiPoint'
  coordinates: [number, number][]
}

export interface GeoJSONMultiLineString extends GeoJSONGeometry {
  type: 'MultiLineString'
  coordinates: [number, number][][]
}

export interface GeoJSONMultiPolygon extends GeoJSONGeometry {
  type: 'MultiPolygon'
  coordinates: [number, number][][][]
}

export interface GeoJSONGeometryCollection extends GeoJSONGeometry {
  type: 'GeometryCollection'
  geometries: GeoJSONGeometry[]
}

export type Geometry = 
  | GeoJSONPoint 
  | GeoJSONLineString 
  | GeoJSONPolygon 
  | GeoJSONMultiPoint 
  | GeoJSONMultiLineString 
  | GeoJSONMultiPolygon 
  | GeoJSONGeometryCollection

export interface GeoJSONFeature {
  type: 'Feature'
  geometry: Geometry
  properties: Record<string, string | number | boolean | null>
  id?: string | number
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}
