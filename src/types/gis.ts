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
  geometry: GeoJSON.Geometry
  properties: Record<string, any>
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
export namespace GeoJSON {
  export interface Geometry {
    type: string
    coordinates: any[]
  }

  export interface Point extends Geometry {
    type: 'Point'
    coordinates: [number, number]
  }

  export interface LineString extends Geometry {
    type: 'LineString'
    coordinates: [number, number][]
  }

  export interface Polygon extends Geometry {
    type: 'Polygon'
    coordinates: [number, number][][]
  }

  export interface MultiPoint extends Geometry {
    type: 'MultiPoint'
    coordinates: [number, number][]
  }

  export interface MultiLineString extends Geometry {
    type: 'MultiLineString'
    coordinates: [number, number][][]
  }

  export interface MultiPolygon extends Geometry {
    type: 'MultiPolygon'
    coordinates: [number, number][][][]
  }

  export interface GeometryCollection extends Geometry {
    type: 'GeometryCollection'
    geometries: Geometry[]
  }

  export interface Feature {
    type: 'Feature'
    geometry: Geometry
    properties: Record<string, any>
    id?: string | number
  }

  export interface FeatureCollection {
    type: 'FeatureCollection'
    features: Feature[]
  }
}
