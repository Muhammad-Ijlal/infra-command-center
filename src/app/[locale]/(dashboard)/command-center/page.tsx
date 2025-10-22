"use client"

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
import { FileText, Clock, CheckCircle2, AlertTriangle, TrendingUp, Shield } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockDetections } from "@/data/mock-detections"
import { AIDetection } from "@/types/detection"

export default function CommandCenterPage() {
  const t = useTranslations('commandCenter')
  
  // Filter detections by status
  const criticalDetections = mockDetections.filter(d => d.severity === 'critical')
  const warningDetections = mockDetections.filter(d => d.severity === 'warning')
  const normalDetections = mockDetections.filter(d => d.severity === 'normal')
  
  const pendingDetections = mockDetections.filter(d => d.status === 'pending')
  const inProgressDetections = mockDetections.filter(d => d.status === 'in_progress')
  const resolvedDetections = mockDetections.filter(d => d.status === 'resolved')

  const getSeverityBadge = (severity: AIDetection['severity']) => {
    switch (severity) {
      case 'critical':
        return { variant: 'destructive' as const, className: 'bg-red-600' }
      case 'warning':
        return { variant: 'secondary' as const, className: 'bg-yellow-600' }
      case 'normal':
        return { variant: 'outline' as const, className: 'bg-blue-600' }
      default:
        return { variant: 'outline' as const, className: '' }
    }
  }

  const getStatusBadge = (status: AIDetection['status']) => {
    switch (status) {
      case 'pending':
        return { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' }
      case 'in_progress':
        return { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' }
      case 'resolved':
        return { variant: 'outline' as const, className: 'bg-green-100 text-green-800' }
      default:
        return { variant: 'outline' as const, className: '' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label={t('criticalDetections')}
          value={criticalDetections.length}
          description={t('requiresImmediateAttention')}
          className="border-red-200 bg-red-50"
        />
        <SummaryCard
          icon={<Clock className="h-4 w-4" />}
          label={t('pendingDetections')}
          value={pendingDetections.length}
          description={t('awaitingAssignment')}
          className="border-yellow-200 bg-yellow-50"
        />
        <SummaryCard
          icon={<TrendingUp className="h-4 w-4" />}
          label={t('inProgressDetections')}
          value={inProgressDetections.length}
          description={t('currentlyBeingAddressed')}
          className="border-blue-200 bg-blue-50"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label={t('resolvedDetections')}
          value={resolvedDetections.length}
          description={t('successfullyCompleted')}
          className="border-green-200 bg-green-50"
        />
      </div>

      {/* Detection Registry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('detectionRegistry')}
          </CardTitle>
          <CardDescription>
            {t('allDetections')}
          </CardDescription>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{t('critical')}: {criticalDetections.length}</span>
            <span>{t('warning')}: {warningDetections.length}</span>
            <span>{t('normal')}: {normalDetections.length}</span>
          </div>
        </CardHeader>
        <CardContent>
          {mockDetections.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('detectionId')}</TableHead>
                  <TableHead>{t('description')}</TableHead>
                  <TableHead>{t('severity')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('detectedDate')}</TableHead>
                  <TableHead>{t('location')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDetections.map((detection) => (
                  <TableRow key={detection.detection_id}>
                    <TableCell className="font-medium">{detection.detection_id}</TableCell>
                    <TableCell>{detection.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getSeverityBadge(detection.severity).variant}
                        className={`capitalize ${getSeverityBadge(detection.severity).className}`}
                        size="default"
                      >
                        {detection.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadge(detection.status).variant}
                        className={`capitalize ${getStatusBadge(detection.status).className}`}
                        size="default"
                      >
                        {detection.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(detection.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{detection.location ? `${detection.location.lat}, ${detection.location.lng}` : '-'}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {t('viewDetails')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">{t('noDetectionsFound')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('noDetectionsDescription')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}