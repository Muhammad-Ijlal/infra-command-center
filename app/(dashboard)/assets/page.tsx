"use client"

import { useState } from "react"
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
import { mockAssets, mockAssetPassports } from "@/src/data/mock-assets"
import { Asset, AssetPassport } from "@/src/types/asset"

export default function AssetsPage() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [assets] = useState<Asset[]>(mockAssets)

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

  const getStatusIcon = (status: Asset['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'maintenance_required':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'under_maintenance':
        return <Wrench className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const assetPassport: AssetPassport | undefined = selectedAsset ? mockAssetPassports[selectedAsset] : undefined

  const operationalCount = assets.filter(a => a.status === 'operational').length
  const maintenanceRequiredCount = assets.filter(a => a.status === 'maintenance_required').length
  const underMaintenanceCount = assets.filter(a => a.status === 'under_maintenance').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
        <p className="text-muted-foreground mt-1">
          Infrastructure asset inventory and health monitoring
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{operationalCount}</div>
            <p className="text-xs text-muted-foreground">Assets in good condition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Required</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{maintenanceRequiredCount}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{underMaintenanceCount}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
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
                    <Badge variant="outline" className="capitalize">
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
                    <div className="flex items-center gap-2">
                      {getStatusIcon(asset.status)}
                      <Badge variant={getStatusColor(asset.status)}>
                        {asset.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            asset.impact_score >= 90
                              ? 'bg-red-600'
                              : asset.impact_score >= 70
                              ? 'bg-orange-500'
                              : 'bg-green-600'
                          }`}
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
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
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
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Asset Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Asset ID</p>
                    <p className="font-medium">{assetPassport.asset_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{assetPassport.asset.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge className="capitalize">{assetPassport.asset.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(assetPassport.asset.status)}>
                      {assetPassport.asset.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Material Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Material Information</h3>
                <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Compliance & Certifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Vision 2030 Compliant:</p>
                    <Badge variant={assetPassport.compliance.vision_2030_compliant ? 'default' : 'destructive'}>
                      {assetPassport.compliance.vision_2030_compliant ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">QCS Certified:</p>
                    <Badge variant={assetPassport.compliance.qcs_certified ? 'default' : 'destructive'}>
                      {assetPassport.compliance.qcs_certified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Certifications</p>
                    <div className="flex gap-2 mt-1">
                      {assetPassport.compliance.certifications?.map((cert) => (
                        <Badge key={cert} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Maintenance History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetPassport.maintenance_history.map((record) => (
                      <TableRow key={record.record_id}>
                        <TableCell className="text-sm">
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{record.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{record.description}</TableCell>
                        <TableCell className="text-sm">{record.contractor}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <Button onClick={() => setSelectedAsset(null)}>
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

