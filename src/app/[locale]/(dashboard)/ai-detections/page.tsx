"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
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
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { mockDetections } from "@/data/mock-detections"
import { AIDetection } from "@/types/detection"

export default function AIDetectionsPage() {
  const t = useTranslations('aiDetections')
  const [detections, setDetections] = useState<AIDetection[]>(mockDetections)

  const handleValidate = (detectionId: string) => {
    setDetections(prev =>
      prev.map(d =>
        d.detection_id === detectionId
          ? { ...d, status: 'validated' as const }
          : d
      )
    )
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
                    {detection.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidate(detection.detection_id)}
                      >
                        {t('validate')}
                      </Button>
                    )}
                    {detection.status === 'validated' && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {t('validated')}
                      </Badge>
                    )}
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
    </div>
  )
}

