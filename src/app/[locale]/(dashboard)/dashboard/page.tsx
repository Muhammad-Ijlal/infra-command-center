"use client"

import { useTranslations } from 'next-intl'
import { Badge } from "@/components/ui/badge"
import { mockAssets } from "@/data/mock-assets"
import { AssetMap } from "@/components/asset-map"
import { mockContracts } from "@/data/mock-contracts"
import { mockDetections } from "@/data/mock-detections"
import { mockContractors } from "@/data/mock-contractors"
import { Brain, Users, FileText, AlertTriangle, CheckCircle2, Clock, Wrench, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCard } from "@/components/summary-card"

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  // Calculate summary statistics
  const openDetections = 9 //mockDetections.filter(d => d.status === 'pending' || d.status === 'validated').length
  const criticalDetections = mockDetections.filter(d => d.severity === 'critical').length
  const activeContracts = 16 //mockContracts.filter(c => c.status === 'active' || c.status === 'commissioned').length
  const pendingTenders = 9 //mockContracts.filter(c => c.status === 'draft' || c.status === 'pending_approval').length
  
  // Calculate SLA compliance (mock calculation)
  const totalContractors = mockContractors.length
  const excellentCompliance = mockContractors.filter(c => c.sla_compliance === 'excellent').length
  const slaCompliancePercent = 80 //Math.round((excellentCompliance / totalContractors) * 100)

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
          icon={<FileText className="h-4 w-4 text-green-600" />}
          label={t('activeContracts')}
          value={activeContracts}
          description={t('inProgress')}
        />
        <SummaryCard
          icon={<Clock className="h-4 w-4 text-orange-600" />}
          label={t('pendingTenders')}
          value={pendingTenders}
          description={t('awaitingApproval')}
        />
        <SummaryCard
          icon={<Users className="h-4 w-4 text-green-600" />}
          label={t('slaCompliance')}
          value={`${slaCompliancePercent}%`}
          description={t('contractorPerformance')}
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
                    <p className="text-sm font-medium leading-none">{detection.defect_type.toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">{detection.asset_id}</p>
                  </div>
                  <Badge variant={detection.severity === 'critical' ? 'destructive' : detection.severity === 'warning' ? 'default' : 'secondary'} className="capitalize" size="status">
                    {detection.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('activeContractsTitle')}</CardTitle>
            <CardDescription>{t('contractsInProgress')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockContracts.filter(c => 
                c.status === 'active' || c.status === 'commissioned'
              ).slice(0, 3).map((contract) => (
                <div key={contract.contract_id} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{contract.title}</p>
                    <p className="text-sm text-muted-foreground">{contract.contractor_name}</p>
                  </div>
                  <Badge variant="outline" className="capitalize" size="status">
                    {contract.status.replace(/_/g, ' ')}
                  </Badge>
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
