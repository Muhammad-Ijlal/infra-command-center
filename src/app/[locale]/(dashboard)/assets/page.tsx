"use client"

import { useState, useEffect } from "react"
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
import { CheckCircle2, AlertCircle, Wrench } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockAssets, mockAssetPassports } from "@/data/mock-assets"
import { Asset, AssetPassport } from "@/types/asset"
import IntegrationLogos from "@/components/sections/integrations/grid"

export default function AssetsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [assets] = useState<Asset[]>(mockAssets)

  // Handle URL parameters to automatically open asset modal
  useEffect(() => {
    const assetId = searchParams.get('asset')
    if (assetId && mockAssetPassports[assetId]) {
      setSelectedAsset(assetId)
    }
  }, [searchParams])

  const handleCloseAsset = () => {
    setSelectedAsset(null)
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

  const assetPassport: AssetPassport | undefined = selectedAsset ? mockAssetPassports[selectedAsset] : undefined

  const operationalCount = 23 //assets.filter(a => a.status === 'operational').length
  const maintenanceRequiredCount = assets.filter(a => a.status === 'maintenance_required').length
  const underMaintenanceCount = 5 //assets.filter(a => a.status === 'under_maintenance').length

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
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Impact Score</TableHead>
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
                  <TableCell className="text-sm">
                    {new Date(asset.last_maintenance_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(asset.status)} className="capitalize" size="xxl_status">
                      {asset.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-orange-500"
                          style={{ width: `${asset.impact_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{asset.impact_score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAsset(asset.asset_id)}
                    >
                      View Passport
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      {/* Integration Logos Section */}
      <IntegrationLogos 
        title="Seamlessly integrates with your existing tools"
        description="Connect with the platforms and systems you already use"
      />
    </div>
  )
}

