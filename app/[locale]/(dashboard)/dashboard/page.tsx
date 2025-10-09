"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, FileText, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { mockDetections } from "@/src/data/mock-detections"
import { mockAssets } from "@/src/data/mock-assets"
import { mockContractors } from "@/src/data/mock-contractors"
import { mockContracts } from "@/src/data/mock-contracts"
import { AssetMap } from "@/components/asset-map"

export default function DashboardPage() {
  // Calculate summary statistics
  const openDetections = mockDetections.filter(d => d.status === 'pending' || d.status === 'validated').length
  const criticalDetections = mockDetections.filter(d => d.severity === 'critical').length
  const activeContracts = mockContracts.filter(c => c.status === 'active' || c.status === 'sent_to_contractor').length
  const pendingTenders = mockContracts.filter(c => c.status === 'draft' || c.status === 'pending_approval').length
  
  // Calculate SLA compliance (mock calculation)
  const totalContractors = mockContractors.length
  const excellentCompliance = mockContractors.filter(c => c.sla_compliance === 'excellent').length
  const slaCompliancePercent = Math.round((excellentCompliance / totalContractors) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Infrastructure Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage infrastructure assets, detections, contractors, and contracts
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Detections</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openDetections}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
              {criticalDetections} critical issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tenders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTenders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slaCompliancePercent}%</div>
            <p className="text-xs text-muted-foreground">
              Contractor performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Module Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai">AI Recognition</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Asset Map */}
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
                <CardTitle>Recent Detections</CardTitle>
                <CardDescription>Latest AI-detected infrastructure issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDetections.slice(0, 3).map((detection) => (
                    <div key={detection.detection_id} className="flex items-start justify-between border-b pb-3 last:border-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{detection.defect_type.toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{detection.asset_id}</p>
                      </div>
                      <Badge variant={detection.severity === 'critical' ? 'destructive' : detection.severity === 'warning' ? 'default' : 'secondary'}>
                        {detection.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
                <CardDescription>Contracts currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockContracts.filter(c => c.status === 'active' || c.status === 'sent_to_contractor').slice(0, 3).map((contract) => (
                    <div key={contract.contract_id} className="flex items-start justify-between border-b pb-3 last:border-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{contract.title}</p>
                        <p className="text-sm text-muted-foreground">{contract.contractor_name}</p>
                      </div>
                      <Badge variant="outline">
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
              <CardTitle>Asset Health Overview</CardTitle>
              <CardDescription>Infrastructure asset status summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-muted-foreground">Operational</span>
                  <span className="text-2xl font-bold text-green-600">
                    {mockAssets.filter(a => a.status === 'operational').length}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-muted-foreground">Maintenance Required</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {mockAssets.filter(a => a.status === 'maintenance_required').length}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-muted-foreground">Under Maintenance</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {mockAssets.filter(a => a.status === 'under_maintenance').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Detection Module</CardTitle>
              <CardDescription>
                Access detailed AI recognition features from the sidebar navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigate to <strong>AI Recognition</strong> in the sidebar to view all detections, validate issues, and manage detection workflows.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management Module</CardTitle>
              <CardDescription>
                Access detailed asset management features from the sidebar navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigate to <strong>Assets</strong> in the sidebar to view asset passports, maintenance history, and compliance information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractors">
          <Card>
            <CardHeader>
              <CardTitle>Contractor Management Module</CardTitle>
              <CardDescription>
                Access contractor matching and management features from the sidebar navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigate to <strong>Contractors</strong> in the sidebar to view contractor profiles, performance metrics, and AI matching capabilities.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contract & Tender Module</CardTitle>
              <CardDescription>
                Access contract creation and tender management from the sidebar navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigate to <strong>Contracts</strong> in the sidebar to create contracts, manage tenders, and track approval workflows.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

