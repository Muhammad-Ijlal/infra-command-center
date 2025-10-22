'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Building, Eye, Download, RefreshCw, AlertCircle, Loader2, CheckCircle2, Wrench } from 'lucide-react'
import { Asset } from '@/types/asset'

interface ImportedAssetsListProps {
  onImportComplete?: () => void
}

export function ImportedAssetsList({ onImportComplete }: ImportedAssetsListProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/assets?limit=100')
      const result = await response.json()
      
      if (result.success) {
        setAssets(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Failed to fetch assets:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  // Refresh assets when import completes
  useEffect(() => {
    if (onImportComplete) {
      fetchAssets()
    }
  }, [onImportComplete])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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

  const getStatusIcon = (status: Asset['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'maintenance_required':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'under_maintenance':
        return <Wrench className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'kerb':
        return '🛣️'
      case 'carriageway':
        return '🛤️'
      case 'shoulder':
        return '🛣️'
      case 'traffic_sign':
        return '🚦'
      case 'street_light_pole':
        return '💡'
      case 'bridge':
        return '🌉'
      case 'tunnel':
        return '🚇'
      default:
        return '🏗️'
    }
  }

  // Group assets by category for summary
  const assetsByCategory = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const operationalCount = assets.filter(a => a.status === 'operational').length
  const maintenanceRequiredCount = assets.filter(a => a.status === 'maintenance_required').length
  const underMaintenanceCount = assets.filter(a => a.status === 'under_maintenance').length

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading imported assets...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{assets.length}</div>
                <div className="text-sm text-muted-foreground">Total Assets</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{operationalCount}</div>
                <div className="text-sm text-muted-foreground">Operational</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{maintenanceRequiredCount}</div>
                <div className="text-sm text-muted-foreground">Maintenance Required</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{underMaintenanceCount}</div>
                <div className="text-sm text-muted-foreground">Under Maintenance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(assetsByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assets by Category</CardTitle>
            <CardDescription>Breakdown of imported assets by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(assetsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <span className="font-medium capitalize">{category.replace(/_/g, ' ')}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets Table */}
      {assets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assets Found</h3>
            <p className="text-muted-foreground mb-4">
              Import GIS data to create assets from your .GDB files
            </p>
            <Button onClick={fetchAssets} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Imported Assets</CardTitle>
                <CardDescription>
                  {assets.length} assets imported from GIS data
                </CardDescription>
              </div>
              <Button onClick={fetchAssets} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.asset_id}>
                      <TableCell className="font-mono text-sm">
                        {asset.asset_id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {asset.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getCategoryIcon(asset.category)}</span>
                          <span className="capitalize">{asset.category.replace(/_/g, ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(asset.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(asset.status)}
                          {asset.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {asset.location ? (
                          <div className="text-sm">
                            <div>{asset.location.lat.toFixed(6)}, {asset.location.lng.toFixed(6)}</div>
                            {asset.location.address && (
                              <div className="text-muted-foreground truncate max-w-xs">
                                {asset.location.address}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No location</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(asset.last_maintenance_date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
