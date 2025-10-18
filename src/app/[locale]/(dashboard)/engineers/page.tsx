"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
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
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Phone, 
  Mail,
  Award,
  Activity,
  Users
} from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockEngineers } from "@/data/mock-engineers"
import { mockDetections } from "@/data/mock-detections"
import { Engineer } from "@/types/engineer"

export default function EngineersPage() {
  const t = useTranslations('engineers')
  const tCommon = useTranslations('common')
  const searchParams = useSearchParams()
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null)

  // Handle engineer parameter from URL
  useEffect(() => {
    const engineerId = searchParams.get('engineer')
    if (engineerId) {
      const engineer = mockEngineers.find(e => e.engineer_id === engineerId)
      if (engineer) {
        setSelectedEngineer(engineer)
      }
    }
  }, [searchParams])

  // Calculate summary statistics
  const totalEngineers = mockEngineers.length
  const availableEngineers = mockEngineers.filter(e => e.status === 'available').length
  const busyEngineers = mockEngineers.filter(e => e.status === 'busy').length
  const offlineEngineers = mockEngineers.filter(e => e.status === 'offline').length
  
  // Calculate average SLA compliance
  const avgSlaCompliance = Math.round(
    mockEngineers.reduce((sum, e) => sum + e.sla_compliance_rate, 0) / totalEngineers
  )

  // Get engineer assignments from detections
  const getEngineerAssignments = (engineerId: string) => {
    return mockDetections.filter(d => d.assigned_engineer_id === engineerId)
  }

  const getStatusColor = (status: Engineer['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800'
      case 'offline':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSlaComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-title tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          icon={<Activity className="h-4 w-4 text-yellow-600" />}
          label={t('busyEngineers')}
          value={busyEngineers}
          description={t('currentlyWorking')}
        />
        <SummaryCard
          icon={<Award className="h-4 w-4 text-purple-600" />}
          label={t('avgSlaCompliance')}
          value={`${avgSlaCompliance}%`}
          description={t('slaPerformance')}
        />
      </div>

      {/* Engineer Directory */}
      <Card>
        <CardHeader>
          <CardTitle>{t('engineerDirectory')}</CardTitle>
          <CardDescription>{t('engineerDirectoryDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('specialization')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('assignments')}</TableHead>
                <TableHead>{t('slaCompliance')}</TableHead>
                <TableHead>{t('avgResponseTime')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEngineers.map((engineer) => {
                const assignments = getEngineerAssignments(engineer.engineer_id)
                return (
                  <TableRow key={engineer.engineer_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{engineer.name}</p>
                          <p className="text-sm text-muted-foreground">{engineer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {engineer.specialization.slice(0, 2).map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {engineer.specialization.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{engineer.specialization.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(engineer.status)}>
                        {engineer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{engineer.current_assignments}</span>
                        <span className="text-muted-foreground">/{engineer.max_assignments}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getSlaComplianceColor(engineer.sla_compliance_rate)}`}>
                        {engineer.sla_compliance_rate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {engineer.average_response_time_hours}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEngineer(engineer)}
                      >
                        {t('viewDetails')}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Engineer Details Dialog */}
      <Dialog open={!!selectedEngineer} onOpenChange={() => setSelectedEngineer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedEngineer?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedEngineer?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEngineer && (
            <div className="space-y-6">
              {/* Engineer Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">{t('contactInfo')}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {selectedEngineer.email}
                    </div>
                    {selectedEngineer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {selectedEngineer.phone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">{t('performance')}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{t('slaCompliance')}:</span>
                      <span className={getSlaComplianceColor(selectedEngineer.sla_compliance_rate)}>
                        {selectedEngineer.sla_compliance_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('avgResponseTime')}:</span>
                      <span>{selectedEngineer.average_response_time_hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('currentAssignments')}:</span>
                      <span>{selectedEngineer.current_assignments}/{selectedEngineer.max_assignments}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="font-medium mb-2">{t('specializations')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEngineer.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium mb-2">{t('skills')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEngineer.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Current Assignments */}
              <div>
                <h4 className="font-medium mb-2">{t('currentAssignments')}</h4>
                {getEngineerAssignments(selectedEngineer.engineer_id).length > 0 ? (
                  <div className="space-y-2">
                    {getEngineerAssignments(selectedEngineer.engineer_id).map((detection) => (
                      <div key={detection.detection_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{detection.defect_type.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-muted-foreground">{detection.asset_id}</p>
                        </div>
                        <Badge variant={detection.severity === 'critical' ? 'destructive' : 'default'}>
                          {detection.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">{t('noCurrentAssignments')}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
