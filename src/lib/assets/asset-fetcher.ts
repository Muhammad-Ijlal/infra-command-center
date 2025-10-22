import { Asset, AssetCategory, AssetStatus } from '@/types/asset'

/**
 * Fetch asset details from API by asset ID
 * Used when opening detection detail modal to show real asset information
 */
export async function fetchAssetById(assetId: string): Promise<Asset | null> {
  try {
    const response = await fetch(`/api/assets?assetId=${assetId}`)
    const result = await response.json()

    if (!result.success) {
      console.error(`Error fetching asset ${assetId}:`, result.error)
      return null
    }

    const asset = result.data
    if (!asset) {
      console.log(`Asset ${assetId} not found`)
      return null
    }

    // Transform database asset to Asset interface
    const transformedAsset: Asset = {
      asset_id: asset.asset_id,
      name: asset.name,
      category: asset.category as AssetCategory,
      status: asset.status as AssetStatus,
      impact_score: asset.impact_score,
      location: asset.location_lat && asset.location_lng ? {
        lat: asset.location_lat,
        lng: asset.location_lng,
        address: asset.location_address
      } : undefined,
      // Core GDB fields
      asset_tag: asset.asset_tag,
      asset_priority: asset.asset_priority,
      asset_condition: asset.asset_condition,
      mx_status: asset.mx_status,
      installation_date: asset.installation_date,
      last_updated_date: asset.last_updated_date,
      last_edited_by: asset.last_edited_by,
      survey_date: asset.survey_date,
      survey_method: asset.survey_method,
      remarks: asset.remarks,
      description: asset.description,
      maintainer: asset.maintainer,
      // Location information
      district: asset.district,
      municipality: asset.municipality,
      road_class: asset.road_class,
      road_type: asset.road_type,
      zone_no: asset.zone_no,
      nrs_number: asset.nrs_number,
      nrs_section_number: asset.nrs_section_number,
      // Project information
      project_id: asset.project_id,
      project_code: asset.project_code,
      // Database fields
      id: asset.id,
      location_lat: asset.location_lat,
      location_lng: asset.location_lng,
      location_address: asset.location_address,
      source_file: asset.source_file,
      source_layer: asset.source_layer,
      passport_data: asset.passport_data,
      created_at: asset.created_at,
      updated_at: asset.updated_at
    }

    return transformedAsset

  } catch (error) {
    console.error(`Error fetching asset ${assetId}:`, error)
    return null
  }
}
