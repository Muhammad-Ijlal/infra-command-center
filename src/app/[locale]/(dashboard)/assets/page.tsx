"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, AlertCircle, Wrench, MapPin } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { Asset, AssetPassport } from "@/types/asset"
import { fetchAssetById } from "@/lib/assets/asset-fetcher"
import { GdbUploader } from "@/components/gis/gdb-uploader"

export default function AssetsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [selectedAssetData, setSelectedAssetData] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState({
    operational: 0,
    maintenance_required: 0,
    under_maintenance: 0,
    decommissioned: 0,
    total: 0
  })
  
  const ITEMS_PER_PAGE = 20

  // Fetch stats from database
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/assets?stats=true')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.stats)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  // Fetch assets from database with pagination
  const fetchAssets = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true)
      const offset = (page - 1) * ITEMS_PER_PAGE
      const response = await fetch(`/api/assets?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
      const result = await response.json()
      
      if (result.success) {
        setAssets(result.data || [])
        setTotalCount(result.pagination?.total || 0)
        setError(null)
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Failed to fetch assets:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchStats() // Fetch stats first
    fetchAssets(currentPage)
  }, [currentPage, fetchAssets])

  // Handle GDB import completion
  const handleImportComplete = () => {
    fetchStats() // Refresh stats
    fetchAssets(currentPage) // Refresh the assets list
  }

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalCount)

  // Handle URL parameters to automatically open asset modal
  useEffect(() => {
    const assetId = searchParams.get('asset')
    if (assetId) {
      // First check if asset is in current view
      const assetInView = assets.find(a => a.asset_id === assetId)
      if (assetInView) {
        setSelectedAsset(assetId)
        setSelectedAssetData(assetInView)
      } else {
        // If not in current view, fetch it from database
        const fetchSpecificAsset = async () => {
          try {
            const asset = await fetchAssetById(assetId)
            if (asset) {
              setSelectedAsset(assetId)
              setSelectedAssetData(asset)
            }
          } catch (error) {
            console.error('Error fetching asset for modal:', error)
          }
        }
        fetchSpecificAsset()
      }
    }
  }, [searchParams, assets])

  const handleCloseAsset = () => {
    setSelectedAsset(null)
    setSelectedAssetData(null)
    // Clear query parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('asset')
    router.replace(url.pathname + url.search)
  }

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'operational':
        return 'default'
      case 'maintenance_required':
        return 'destructive'
      case 'under_maintenance':
        return 'secondary'
      case 'decommissioned':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const assetPassport: AssetPassport | undefined = selectedAssetData ? 
    (() => {
      const asset = selectedAssetData
      
      // Extract passport data from the asset (assuming it has passport_data field)
      const passportData = asset.passport_data || {}
      
      return {
        asset_id: asset.asset_id,
        asset: {
          ...asset,
          location: asset.location_lat && asset.location_lng ? {
            lat: asset.location_lat,
            lng: asset.location_lng,
            address: asset.location_address
          } : asset.location
        },
        material_info: {
          primary_material: String(passportData.primary_material || passportData.MATERIAL || 'Unknown'),
          secondary_materials: Array.isArray(passportData.secondary_materials) ? passportData.secondary_materials : [],
          manufacturer: String(passportData.manufacturer || passportData.MANUFACTURER || 'Unknown'),
          installation_date: String(passportData.installation_date || passportData.INSTALLATIONDATE || '')
        },
        maintenance_history: [], // TODO: Implement maintenance history from database
        compliance: {
          vision_2030_compliant: Boolean(passportData.vision_2030_compliant),
          qcs_certified: Boolean(passportData.qcs_certified),
          last_inspection_date: String(passportData.last_inspection_date || passportData.ASSET_CONDITION_DATE || ''),
          certifications: Array.isArray(passportData.certifications) ? passportData.certifications : []
        },
        gdb_properties: {
          // Common fields
          gfcode: passportData.gfcode,
          data_load_id: passportData.data_load_id,
          parent_asset_id: passportData.parent_asset_id,
          parent_globalid: passportData.parent_globalid,
          location_global_id: passportData.location_global_id,
          mxsiteid: passportData.mxsiteid,
          mxassetnum: passportData.mxassetnum,
          mxlocation: passportData.mxlocation,
          mxcreationstate: passportData.mxcreationstate,
          rowstamp: passportData.rowstamp,
          source_dept_section_unit: passportData.source_dept_section_unit,
          hierarchyid: passportData.hierarchyid,
          bim_id: passportData.bim_id,
          rmc_guid: passportData.rmc_guid,
          frameworkzone: passportData.frameworkzone,
          warranty_end: passportData.warranty_end,
          // Traffic Sign specific fields
          sign_width: passportData.sign_width,
          sign_type: passportData.sign_type,
          sign_category: passportData.sign_category,
          sign_code: passportData.sign_code,
          sign_dimension: passportData.sign_dimension,
          sign_description: passportData.sign_description,
          sign_class: passportData.sign_class,
          sign_face_material: passportData.sign_face_material,
          sign_face_type: passportData.sign_face_type,
          sign_language: passportData.sign_language,
          sign_post_standard: passportData.sign_post_standard,
          sign_serial_no: passportData.sign_serial_no,
          type_installation: passportData.type_installation,
          pole_type: passportData.pole_type,
          foundation: passportData.foundation,
          background_color: passportData.background_color,
          traffic_sign_illumination: passportData.traffic_sign_illumination,
          post_mount_type: passportData.post_mount_type,
          text_symbol_color: passportData.text_symbol_color,
          // Road Marking Line specific fields
          code: passportData.code,
          material_type: passportData.material_type,
          road_marking_colour: passportData.road_marking_colour,
          type_of_application: passportData.type_of_application,
          shape_length: passportData.shape_length
        }
      }
    })() : undefined

  // Use stats from API instead of calculating from current page
  const operationalCount = stats.operational
  const maintenanceRequiredCount = stats.maintenance_required
  const underMaintenanceCount = stats.under_maintenance

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-title tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground mt-1">
            Loading infrastructure asset inventory...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading assets...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-title tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground mt-1">
            Infrastructure asset inventory and health monitoring
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load assets</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-title tracking-tight">Asset Management</h1>
        <p className="text-muted-foreground mt-1">
          Infrastructure asset inventory and health monitoring
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          label="Operational"
          value={operationalCount}
          description="Assets in good condition"
        />
        <SummaryCard
          icon={<AlertCircle className="h-4 w-4 text-red-600" />}
          label="Maintenance Required"
          value={maintenanceRequiredCount}
          description="Needs attention"

        />
        <SummaryCard
          icon={<Wrench className="h-4 w-4 text-blue-600" />}
          label="Under Maintenance"
          value={underMaintenanceCount}
          description="Work in progress"
        />
      </div>

      {/* GDB File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Import Assets from GDB Files
          </CardTitle>
          <CardDescription>
            Upload ESRI File Geodatabase (.gdb) files to automatically create infrastructure assets. 
            Each feature in your GIS data will become an asset with comprehensive passport information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GdbUploader onImportComplete={handleImportComplete} />
        </CardContent>
      </Card>
      
      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>
            Comprehensive list of infrastructure assets with health status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.asset_id}>
                    <TableCell className="font-medium">{asset.asset_id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize" size="status">
                        {asset.category.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(asset.status)} className="capitalize" size="xxl_status">
                        {asset.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {asset.location_address || asset.location?.address || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAsset(asset.asset_id)
                            setSelectedAssetData(asset)
                          }}
                        >
                          View Passport
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                        >
                          Draw on Map
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          
          {/* Pagination Controls */}
          {totalCount > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {totalCount} assets
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Passport Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && handleCloseAsset()}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asset Passport</DialogTitle>
            <DialogDescription>
              Comprehensive asset information and history
            </DialogDescription>
          </DialogHeader>

          {assetPassport && (
            <div className="space-y-6">
              {/* Asset Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Asset Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Asset ID</p>
                      <p className="font-medium">{assetPassport.asset_id}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={getStatusColor(assetPassport.asset.status)} className="capitalize" size="large_status">
                        {assetPassport.asset.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{assetPassport.asset.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Material Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Material Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Material</p>
                    <p className="font-medium">{assetPassport.material_info.primary_material}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturer</p>
                    <p className="font-medium">{assetPassport.material_info.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Installation Date</p>
                    <p className="font-medium">
                      {assetPassport.material_info.installation_date &&
                        new Date(assetPassport.material_info.installation_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Secondary Materials</p>
                    <p className="font-medium text-sm">
                      {assetPassport.material_info.secondary_materials?.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Compliance & Certifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vision 2030 Compliant</span>
                    <Badge variant={assetPassport.compliance.vision_2030_compliant ? 'default' : 'destructive'} className="capitalize" size="default">
                      {assetPassport.compliance.vision_2030_compliant ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">QCS Certified</span>
                    <Badge variant={assetPassport.compliance.qcs_certified ? 'default' : 'destructive'} className="capitalize" size="default">
                      {assetPassport.compliance.qcs_certified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Certifications</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {assetPassport.compliance.certifications?.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs capitalize" size="default">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional GDB Data */}
              {(() => {
                const passportData = assetPassport.asset.passport_data || {}
                const additionalFields = [
                  { key: 'asset_condition', label: 'Asset Condition', value: passportData.asset_condition },
                  { key: 'asset_priority', label: 'Asset Priority', value: passportData.asset_priority },
                  { key: 'road_class', label: 'Road Class', value: passportData.road_class },
                  { key: 'district', label: 'District', value: passportData.district },
                  { key: 'municipality', label: 'Municipality', value: passportData.municipality },
                  { key: 'zone_number', label: 'Zone Number', value: passportData.zone_number },
                  { key: 'maintainer', label: 'Maintainer', value: passportData.maintainer },
                  { key: 'survey_date', label: 'Survey Date', value: passportData.survey_date },
                  { key: 'survey_method', label: 'Survey Method', value: passportData.survey_method },
                  { key: 'bim_id', label: 'BIM ID', value: passportData.bim_id },
                  { key: 'rmc_guid', label: 'RMC GUID', value: passportData.rmc_guid },
                  { key: 'framework_zone', label: 'Framework Zone', value: passportData.framework_zone },
                  { key: 'remarks', label: 'Remarks', value: passportData.remarks },
                  { key: 'description', label: 'Description', value: passportData.description }
                ].filter(field => field.value !== undefined && field.value !== null && field.value !== '')

                if (additionalFields.length === 0) return null

                return (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {additionalFields.map((field) => (
                        <div key={field.key}>
                          <p className="text-sm text-muted-foreground">{field.label}</p>
                          <p className="font-medium text-sm">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Maintenance History */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Maintenance History</h3>
                {assetPassport.maintenance_history.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {assetPassport.maintenance_history.map((record) => (
                      <div key={record.record_id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{record.type.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={record.status === 'completed' ? 'default' : 'secondary'} className="text-xs capitalize" size="default">
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{record.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{record.contractor}</span>
                          <span>{record.cost ? `${record.cost.toLocaleString()} QAR` : 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No maintenance records available</p>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <Button onClick={handleCloseAsset}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

