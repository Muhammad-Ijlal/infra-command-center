"use client"

import { useTranslations } from 'next-intl'
import { Badge } from "@/components/ui/badge"
import { mockAssets } from "@/data/mock-assets"
import { AssetMap } from "@/components/asset-map"
import { mockDetections } from "@/data/mock-detections"
import { mockEngineers } from "@/data/mock-engineers"
import { Brain, Users, AlertTriangle, CheckCircle2, Clock, Wrench, Activity, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCard } from "@/components/summary-card"

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  
  // Status color function for detection badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return { variant: 'default' as const, className: '' }
      case 'completed':
        return { variant: 'default' as const, className: 'bg-primary text-primary-foreground' }
      case 'validated':
        return { variant: 'secondary' as const, className: '' }
      case 'critical':
        return { variant: 'destructive' as const, className: '' }
      case 'pending':
        return { variant: 'default' as const, className: 'bg-yellow-600 text-white' }
      default:
        return { variant: 'outline' as const, className: '' }
    }
  }
  
  // Calculate summary statistics
  const openDetections = mockDetections.filter(d => d.status === 'pending' || d.status === 'assigned').length
  const criticalDetections = mockDetections.filter(d => d.severity === 'critical').length
  const assignedDetections = mockDetections.filter(d => d.assigned_engineer_id).length
  const inProgressDetections = mockDetections.filter(d => d.status === 'in_progress').length
  const completedDetections = mockDetections.filter(d => d.status === 'completed' || d.status === 'resolved').length
  
  // Engineer statistics
  const totalEngineers = mockEngineers.length
  const availableEngineers = mockEngineers.filter(e => e.status === 'available').length
  
  // Calculate SLA compliance
  const avgSlaCompliance = Math.round(
    mockEngineers.reduce((sum, e) => sum + e.sla_compliance_rate, 0) / totalEngineers
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-title tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Brain className="h-4 w-4 text-red-600" />}
          label={t('openDetections')}
          value={openDetections}
          description={`${criticalDetections} ${t('criticalIssues')}`}
        />
        <SummaryCard
          icon={<User className="h-4 w-4 text-blue-600" />}
          label={t('assignedDetections')}
          value={assignedDetections}
          description={t('assignedToEngineers')}
        />
        <SummaryCard
          icon={<Activity className="h-4 w-4 text-yellow-600" />}
          label={t('inProgressDetections')}
          value={inProgressDetections}
          description={t('currentlyBeingRepaired')}
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          label={t('completedDetections')}
          value={completedDetections}
          description={t('successfullyResolved')}
        />
      </div>

      {/* Engineer Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<Users className="h-4 w-4 text-blue-600" />}
          label={t('totalEngineers')}
          value={totalEngineers}
          description={t('registeredEngineers')}
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          label={t('availableEngineers')}
          value={availableEngineers}
          description={t('readyForAssignment')}
        />
        <SummaryCard
          icon={<Clock className="h-4 w-4 text-purple-600" />}
          label={t('avgSlaCompliance')}
          value={`${avgSlaCompliance}%`}
          description={t('engineerPerformance')}
        />
      </div>

      {/* Module Tabs */}
      
      <Card>
        <CardHeader>
          <CardTitle>Asset Locations</CardTitle>
          <CardDescription>Interactive map showing all infrastructure assets</CardDescription>
        </CardHeader>
        <CardContent>
          <AssetMap assets={mockAssets} height="500px" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentDetections')}</CardTitle>
            <CardDescription>{t('latestAiDetected')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDetections.slice(0, 3).map((detection) => (
                <div key={detection.detection_id} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{detection.defect_type.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">{detection.asset_id}</p>
                    {detection.assigned_engineer_name && (
                      <p className="text-xs text-blue-600">Assigned to: {detection.assigned_engineer_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={getStatusColor(detection.status).variant} 
                      className={`capitalize text-xs ${getStatusColor(detection.status).className}`} 
                      size="status"
                    >
                      {detection.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('engineerAssignments')}</CardTitle>
            <CardDescription>{t('currentEngineerWorkload')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEngineers.filter(e => e.current_assignments > 0).slice(0, 3).map((engineer) => (
                <div key={engineer.engineer_id} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{engineer.name}</p>
                    <p className="text-sm text-muted-foreground">{engineer.specialization[0].replace(/_/g, ' ')}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={engineer.status === 'available' ? 'default' : engineer.status === 'busy' ? 'secondary' : 'outline'} className="capitalize" size="status">
                      {engineer.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {engineer.current_assignments}/{engineer.max_assignments} assignments
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('assetHealthOverview')}</CardTitle>
          <CardDescription>{t('assetStatusSummary')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
              label={t('operational')}
              value={mockAssets.filter(a => a.status === 'operational').length}
              description="Assets running normally"
            />
            <SummaryCard
              icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
              label={t('maintenanceRequired')}
              value={mockAssets.filter(a => a.status === 'maintenance_required').length}
              description="Scheduled maintenance needed"
            />
            <SummaryCard
              icon={<Wrench className="h-4 w-4 text-blue-600" />}
              label={t('underMaintenance')}
              value={mockAssets.filter(a => a.status === 'under_maintenance').length}
              description="Currently being serviced"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
