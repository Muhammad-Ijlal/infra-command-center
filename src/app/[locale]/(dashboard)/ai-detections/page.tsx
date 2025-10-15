"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
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
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, AlertTriangle, Clock, Eye, MapPin, Activity, FileText, ArrowRight, Image as ImageIcon, ExternalLink } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockDetections } from "@/data/mock-detections"
import { mockAssets } from "@/data/mock-assets"
import { mockContracts } from "@/data/mock-contracts"
import { mockTenders } from "@/data/mock-tenders"
import { AIDetection } from "@/types/detection"
import { Contract } from "@/types/contract"
import { Tender } from "@/types/tender"
import 'mapbox-gl/dist/mapbox-gl.css'

// Dynamically import Map components to avoid SSR issues
const Map = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.default), { ssr: false })
const Marker = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Marker), { ssr: false })
const NavigationControl = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.NavigationControl), { ssr: false })

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function AIDetectionsPage() {
  const t = useTranslations('aiDetections')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [detections, setDetections] = useState<AIDetection[]>(mockDetections)
  const [selectedDetection, setSelectedDetection] = useState<AIDetection | null>(null)

  // Handle URL parameters to automatically open detection modal
  useEffect(() => {
    const detectionId = searchParams.get('detection')
    if (detectionId) {
      const detection = detections.find(d => d.detection_id === detectionId)
      if (detection) {
        setSelectedDetection(detection)
      }
    }
  }, [searchParams, detections])

  const handleViewAsset = (assetId: string) => {
    router.push(`/${locale}/assets?asset=${assetId}`)
  }

  const handleValidate = (detectionId: string) => {
    setDetections(prev =>
      prev.map(d =>
        d.detection_id === detectionId
          ? { ...d, status: 'validated' as const }
          : d
      )
    )
    if (selectedDetection && selectedDetection.detection_id === detectionId) {
      setSelectedDetection({ ...selectedDetection, status: 'validated' as const })
    }
  }

  const handleCreateTender = (detection: AIDetection) => {
    // Open the linked contract or tender modal
    if (detection.contract_id) {
      handleViewContract(detection.contract_id)
    } else if (detection.tender_id) {
      handleViewTender(detection.tender_id)
    } else {
      // If no linked contract/tender, navigate to command center to create one
      router.push(`/${locale}/command-center?asset=${detection.asset_id}&detection=${detection.detection_id}`)
    }
  }

  const handleViewContract = (contractId: string) => {
    // Navigate to contract details in command center
    router.push(`/${locale}/command-center?contract=${contractId}`)
  }

  const handleViewTender = (tenderId: string) => {
    // Navigate to tender details in command center
    router.push(`/${locale}/command-center?tender=${tenderId}`)
  }

  const handleCloseDetection = () => {
    setSelectedDetection(null)
    // Clear query parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('detection')
    router.replace(url.pathname + url.search)
  }

  const getLinkedAsset = (assetId: string) => {
    return mockAssets.find(a => a.asset_id === assetId)
  }

  const getLinkedContract = (detectionId: string): Contract | undefined => {
    return mockContracts.find(c => c.detection_id === detectionId)
  }

  const getLinkedTender = (detectionId: string): Tender | undefined => {
    return mockTenders.find(t => t.detection_id === detectionId)
  }

  const getStatusColor = (status: AIDetection['status']) => {
    switch (status) {
      case 'resolved':
        return { variant: 'default' as const, className: '' }
      case 'validated':
        return { variant: 'secondary' as const, className: '' }
      case 'critical':
        return { variant: 'destructive' as const, className: '' }
      case 'pending':
        return { variant: 'default' as const, className: 'bg-yellow-600 text-white' } // Same as pending_approval
      default:
        return { variant: 'outline' as const, className: '' }
    }
  }

  const getSeverityColor = (severity: AIDetection['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50'
      case 'warning':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-green-600 bg-green-50'
    }
  }

  const criticalCount = detections.filter(d => d.severity === 'critical').length
  const warningCount = 6 //detections.filter(d => d.severity === 'warning').length
  const resolvedCount = 31 //detections.filter(d => d.status === 'resolved').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-title tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
          label={t('criticalIssues')}
          value={criticalCount}
          description={t('requireImmediate')}
        />
        <SummaryCard
          icon={<Clock className="h-4 w-4 text-orange-600" />}
          label={t('warnings')}
          value={warningCount}
          description={t('needsMonitoring')}
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          label={t('resolved')}
          value={resolvedCount}
          description={t('successfullyAddressed')}
        />
      </div>

      {/* Detections Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detectionRecords')}</CardTitle>
          <CardDescription>
            {t('aiPoweredDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('detectionId')}</TableHead>
                <TableHead>{t('assetId')}</TableHead>
                <TableHead>{t('defectType')}</TableHead>
                <TableHead>{t('severity')}</TableHead>
                <TableHead>{t('confidence')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('timestamp')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detections.map((detection) => (
                <TableRow key={detection.detection_id}>
                  <TableCell className="font-medium">{detection.detection_id}</TableCell>
                  <TableCell>{detection.asset_id}</TableCell>
                  <TableCell>
                    <span className="capitalize">{detection.defect_type.replace(/_/g, ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getSeverityColor(detection.severity)} capitalize`} 
                      variant="outline"
                      size="status"
                    >
                      {detection.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm">{Math.round(detection.confidence_score * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusColor(detection.status).variant} 
                      className={`capitalize ${getStatusColor(detection.status).className}`}
                      size="status"
                    >
                      {detection.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(detection.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDetection(detection)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {t('viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detection Flow Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detectionWorkflow')}</CardTitle>
          <CardDescription>{t('workflowDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <p className="text-sm font-medium">{t('aiDetection')}</p>
              <p className="text-xs text-muted-foreground">{t('automatedScanning')}</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xl font-bold text-orange-600">2</span>
              </div>
              <p className="text-sm font-medium">{t('validation')}</p>
              <p className="text-xs text-muted-foreground">{t('humanVerification')}</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <p className="text-sm font-medium">{t('assetLinking')}</p>
              <p className="text-xs text-muted-foreground">{t('connectToAsset')}</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">4</span>
              </div>
              <p className="text-sm font-medium">{t('contractCreation')}</p>
              <p className="text-xs text-muted-foreground">{t('automatedResponse')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detection Details Modal */}
      <Dialog open={!!selectedDetection} onOpenChange={(open) => !open && handleCloseDetection()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('detectionDetails')}</DialogTitle>
            <DialogDescription>
              {selectedDetection?.detection_id}
            </DialogDescription>
          </DialogHeader>

          {selectedDetection && (
            <div className="space-y-6">
              {/* Detection Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    className={`${getSeverityColor(selectedDetection.severity)} capitalize`} 
                    variant="outline"
                    size="status"
                  >
                    {selectedDetection.severity}
                  </Badge>
                  <Badge 
                    variant={getStatusColor(selectedDetection.status).variant} 
                    className={`capitalize ${getStatusColor(selectedDetection.status).className}`}
                    size="status"
                  >
                    {selectedDetection.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {selectedDetection.status === 'pending' && (
                    <Button
                      onClick={() => handleValidate(selectedDetection.detection_id)}
                      className="gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t('validate')}
                    </Button>
                  )}
                  {selectedDetection.status === 'validated' && (() => {
                    const linkedContract = getLinkedContract(selectedDetection.detection_id)
                    const linkedTender = getLinkedTender(selectedDetection.detection_id)
                    
                    if (linkedContract) {
                      // Show "View Contract" or "View Tender" button
                      const buttonText = t('viewContract')
                      return (
                        <Button
                          onClick={() => handleViewContract(linkedContract.contract_id)}
                          className="gap-2"
                          variant="default"
                        >
                          <FileText className="h-4 w-4" />
                          {buttonText}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )
                    } else if (linkedTender) {
                      // Show "View Tender" button for separate tender
                      return (
                        <Button
                          onClick={() => handleViewTender(linkedTender.tender_id)}
                          className="gap-2"
                          variant="default"
                        >
                          <FileText className="h-4 w-4" />
                          {t('viewTender')}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )
                    } else {
                      // Show "Create Tender/Contract" button
                      return (
                        <Button
                          onClick={() => handleCreateTender(selectedDetection)}
                          className="gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          {t('createTender')}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )
                    }
                  })()}
                </div>
              </div>

              <Separator />

              {/* Detection Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('detectionDetails')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('defectType')}</p>
                    <p className="font-medium capitalize">{selectedDetection.defect_type.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('confidence')}</p>
                    <p className="font-medium">{Math.round(selectedDetection.confidence_score * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('timestamp')}</p>
                    <p className="font-medium">
                      {new Date(selectedDetection.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('severity')}</p>
                    <p className="font-medium capitalize">{selectedDetection.severity}</p>
                  </div>
                </div>
                {selectedDetection.description && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">{t('description')}</p>
                    <p className="font-medium">{selectedDetection.description}</p>
                  </div>
                )}
                {(selectedDetection.detection_device || selectedDetection.device_model) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {selectedDetection.detection_device && (
                      <div>
                        <p className="text-sm text-muted-foreground">Detection Device</p>
                        <p className="font-medium">{selectedDetection.detection_device}</p>
                      </div>
                    )}
                    {selectedDetection.device_model && (
                      <div>
                        <p className="text-sm text-muted-foreground">Device Model</p>
                        <p className="font-medium">{selectedDetection.device_model}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Detection Image */}
              {selectedDetection.image_url && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Detection Image
                    </h3>
                    <div className="rounded-lg overflow-hidden border">
                      <Image 
                        src={selectedDetection.image_url} 
                        alt={`Detection ${selectedDetection.detection_id}`}
                        width={600}
                        height={300}
                        className="w-full h-[300px] object-cover"
                      />
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Location Map */}
              {selectedDetection.location && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Asset Location
                    </h3>
                    <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid hsl(var(--border))' }}>
                      <Map
                        initialViewState={{
                          longitude: selectedDetection.location.lng,
                          latitude: selectedDetection.location.lat,
                          zoom: 14
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        mapboxAccessToken={MAPBOX_TOKEN}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <NavigationControl position="top-right" />
                        <Marker
                          longitude={selectedDetection.location.lng}
                          latitude={selectedDetection.location.lat}
                          anchor="bottom"
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: selectedDetection.severity === 'critical' ? '#DC3545' : selectedDetection.severity === 'warning' ? '#FFC107' : '#28A745',
                                border: '3px solid white',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '20px'
                              }}
                            >
                              !
                            </div>
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderTop: `10px solid ${selectedDetection.severity === 'critical' ? '#DC3545' : selectedDetection.severity === 'warning' ? '#FFC107' : '#28A745'}`,
                                marginTop: '-2px'
                              }}
                            />
                          </div>
                        </Marker>
                      </Map>
                    </div>
                  </div>
                  <Separator />
                </>
              )}


              {/* Linked Asset Information */}
              {(() => {
                const linkedAsset = getLinkedAsset(selectedDetection.asset_id)
                return linkedAsset ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('linkedAsset')}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewAsset(linkedAsset.asset_id)}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{t('assetName')}</p>
                          <p className="font-semibold text-lg">{linkedAsset.name}</p>
                        </div>
                        <Badge variant="outline" className="capitalize" size="table">
                          {linkedAsset.category}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t('assetStatus')}</p>
                          <p className="font-medium capitalize">{linkedAsset.status.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('impactScore')}</p>
                          <p className="font-medium">{linkedAsset.impact_score}/100</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('lastMaintenance')}</p>
                          <p className="font-medium">
                            {new Date(linkedAsset.last_maintenance_date).toLocaleDateString()}
                          </p>
                        </div>
                        {linkedAsset.location?.address && (
                          <div>
                            <p className="text-sm text-muted-foreground">{t('location')}</p>
                            <p className="font-medium">{linkedAsset.location.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No linked asset information available
                  </div>
                )
              })()}

              {/* Validation Success Message */}
              {selectedDetection.status === 'validated' && (() => {
                const linkedContract = getLinkedContract(selectedDetection.detection_id)
                return (
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        {t('detectionsValidated')}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {linkedContract 
                          ? `A contract (${linkedContract.contract_id}) has been created for this detection`
                          : 'You can now create a tender/contract for this detection'
                        }
                      </p>
                    </div>
                  </div>
                )
              })()}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={handleCloseDetection}>
                  {tCommon('close')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

