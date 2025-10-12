"use client"

import { useState } from "react"
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
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
import { CheckCircle2, AlertTriangle, Clock, Eye, MapPin, Calendar, Activity, FileText, ArrowRight } from "lucide-react"
import { mockDetections } from "@/data/mock-detections"
import { mockAssets } from "@/data/mock-assets"
import { AIDetection } from "@/types/detection"

export default function AIDetectionsPage() {
  const t = useTranslations('aiDetections')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const [detections, setDetections] = useState<AIDetection[]>(mockDetections)
  const [selectedDetection, setSelectedDetection] = useState<AIDetection | null>(null)

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
    // Navigate to command center with pre-filled data
    router.push(`/${locale}/command-center?asset=${detection.asset_id}&detection=${detection.detection_id}`)
  }

  const getLinkedAsset = (assetId: string) => {
    return mockAssets.find(a => a.asset_id === assetId)
  }

  const getStatusColor = (status: AIDetection['status']) => {
    switch (status) {
      case 'resolved':
        return 'default'
      case 'validated':
        return 'secondary'
      case 'critical':
      case 'pending':
        return 'destructive'
      default:
        return 'outline'
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
  const warningCount = detections.filter(d => d.severity === 'warning').length
  const resolvedCount = detections.filter(d => d.status === 'resolved').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('criticalIssues')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">{t('requireImmediate')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('warnings')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{warningCount}</div>
            <p className="text-xs text-muted-foreground">{t('needsMonitoring')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('resolved')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">{t('successfullyAddressed')}</p>
          </CardContent>
        </Card>
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
                    <Badge className={getSeverityColor(detection.severity)} variant="outline">
                      {detection.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm">{Math.round(detection.confidence_score * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(detection.status)}>
                      {detection.status}
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
      <Dialog open={!!selectedDetection} onOpenChange={() => setSelectedDetection(null)}>
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
                  <Badge className={getSeverityColor(selectedDetection.severity)} variant="outline">
                    {selectedDetection.severity}
                  </Badge>
                  <Badge variant={getStatusColor(selectedDetection.status)}>
                    {selectedDetection.status}
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
                  {selectedDetection.status === 'validated' && (
                    <Button
                      onClick={() => handleCreateTender(selectedDetection)}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {t('createTender')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
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
                {selectedDetection.location && (
                  <div className="mt-4 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('location')}</p>
                      <p className="font-medium">
                        {selectedDetection.location.lat.toFixed(6)}, {selectedDetection.location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Detection Method */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('detectionMethod')}
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('aiModel')}</p>
                    <p className="font-medium">InfraVision AI v3.2</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('modelVersion')}</p>
                    <p className="font-medium">3.2.1-stable</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('detectionAlgorithm')}</p>
                    <p className="font-medium">Deep CNN + Transfer Learning</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('processingTime')}</p>
                    <p className="font-medium">2.3s</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">{t('imageAnalysis')}</p>
                    <p className="font-medium">
                      Multi-scale feature extraction with attention mechanism
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Linked Asset Information */}
              {(() => {
                const linkedAsset = getLinkedAsset(selectedDetection.asset_id)
                return linkedAsset ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('linkedAsset')}
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{t('assetName')}</p>
                          <p className="font-semibold text-lg">{linkedAsset.name}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
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
              {selectedDetection.status === 'validated' && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {t('detectionsValidated')}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      You can now create a tender/contract for this detection
                    </p>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setSelectedDetection(null)}>
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

