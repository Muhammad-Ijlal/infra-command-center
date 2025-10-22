"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
  CheckCircle2, 
  User, 
  Phone, 
  Mail,
  Award,
  Activity,
  Users,
  Plus
} from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockEngineers } from "@/data/mock-engineers"
import { mockDetections } from "@/data/mock-detections"
import { Engineer, EngineerSpecialization } from "@/types/engineer"

export default function EngineersPage() {
  const t = useTranslations('engineers')
  const searchParams = useSearchParams()
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: [] as string[],
    status: 'available' as 'available' | 'busy' | 'offline',
    current_assignments: 0,
    completed_assignments: 0,
    sla_compliance_rate: 100,
    certifications: [] as string[],
  })

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
        return { variant: 'default' as const, className: '' } // Same as resolved - ready to work
      case 'busy':
        return { variant: 'default' as const, className: 'bg-yellow-600 text-white' } // Same as pending - currently working
      case 'offline':
        return { variant: 'secondary' as const, className: '' } // Same as validated - not available
      default:
        return { variant: 'outline' as const, className: '' }
    }
  }

  

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialization: checked 
        ? [...prev.specialization, specialization]
        : prev.specialization.filter(s => s !== specialization)
    }))
  }

  const handleCertificationChange = (certification: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      certifications: checked 
        ? [...prev.certifications, certification]
        : prev.certifications.filter(c => c !== certification)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate new engineer ID
    const newId = `ENG-${String(mockEngineers.length + 1).padStart(3, '0')}`
    
    const newEngineer: Engineer = {
      engineer_id: newId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      specialization: formData.specialization as EngineerSpecialization[],
      status: formData.status,
      current_assignments: formData.current_assignments,
      completed_assignments: formData.completed_assignments,
      sla_compliance_rate: formData.sla_compliance_rate,
      certifications: formData.certifications.length > 0 ? formData.certifications : undefined,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    }
    
    // In a real app, this would be an API call
    console.log('New engineer created:', newEngineer)
    
    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: [],
      status: 'available',
      current_assignments: 0,
      completed_assignments: 0,
      sla_compliance_rate: 100,
      certifications: [],
    })
    setShowAddModal(false)
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('engineerDirectory')}</CardTitle>
              <CardDescription>{t('engineerDirectoryDesc')}</CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('addNewEmployee')}
            </Button>
          </div>
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
                <TableHead>{t('completedAssignments')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEngineers.map((engineer) => {
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
                          <Badge key={spec} variant="outline" className="text-xs capitalize" size="default">
                            {spec.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {engineer.specialization.length > 2 && (
                          <Badge variant="outline" className="text-xs" size="sm">
                            +{engineer.specialization.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusColor(engineer.status).variant}
                        className={`${getStatusColor(engineer.status).className} capitalize`}
                        size="status"
                      >
                        {engineer.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{engineer.current_assignments}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {engineer.sla_compliance_rate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {engineer.completed_assignments}
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
                      <span className="font-medium">
                        {selectedEngineer.sla_compliance_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('currentAssignments')}:</span>
                      <span>{selectedEngineer.current_assignments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('completedAssignments')}:</span>
                      <span>{selectedEngineer.completed_assignments}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="font-medium mb-2">{t('specializations')}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEngineer.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary" className="capitalize">
                      {spec.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills removed as per updated Engineer type */}

              {/* Current Assignments */}
              <div>
                <h4 className="font-medium mb-2">{t('currentAssignments')}</h4>
                {getEngineerAssignments(selectedEngineer.engineer_id).length > 0 ? (
                  <div className="space-y-2">
                    {getEngineerAssignments(selectedEngineer.engineer_id).map((detection) => (
                      <div key={detection.detection_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{detection.defect_type.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-muted-foreground">{detection.asset_id}</p>
                        </div>
                        <Badge variant={detection.severity === 'critical' ? 'destructive' : 'default'} className="capitalize">
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

      {/* Add New Employee Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('addNewEmployee')}
            </DialogTitle>
            <DialogDescription>
              {t('addNewEmployeeDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium">{t('basicInformation')}</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t('status')}</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">{t('available')}</SelectItem>
                      <SelectItem value="busy">{t('busy')}</SelectItem>
                      <SelectItem value="offline">{t('offline')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-4">
              <h4 className="font-medium">{t('specializations')}</h4>
              <div className="space-y-2">
                {['structural_maintenance', 'electrical_systems', 'general_maintenance'].map((spec) => (
                  <div key={spec} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec}
                      checked={formData.specialization.includes(spec)}
                      onCheckedChange={(checked) => handleSpecializationChange(spec, checked as boolean)}
                    />
                    <Label htmlFor={spec} className="text-sm capitalize">
                      {spec.replace(/_/g, ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium">{t('performance')}</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="current_assignments">{t('currentAssignments')}</Label>
                  <Input
                    id="current_assignments"
                    type="number"
                    min="0"
                    value={formData.current_assignments}
                    onChange={(e) => handleInputChange('current_assignments', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completed_assignments">{t('completedAssignments')}</Label>
                  <Input
                    id="completed_assignments"
                    type="number"
                    min="0"
                    value={formData.completed_assignments}
                    onChange={(e) => handleInputChange('completed_assignments', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sla_compliance_rate">{t('slaCompliance')} (%)</Label>
                  <Input
                    id="sla_compliance_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.sla_compliance_rate}
                    onChange={(e) => handleInputChange('sla_compliance_rate', parseInt(e.target.value) || 100)}
                  />
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h4 className="font-medium">{t('certifications')}</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="electrical-safety"
                    checked={formData.certifications.includes('Electrical Safety Certification')}
                    onCheckedChange={(checked) => handleCertificationChange('Electrical Safety Certification', checked as boolean)}
                  />
                  <Label htmlFor="electrical-safety" className="text-sm">
                    Electrical Safety Certification
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structural-engineering"
                    checked={formData.certifications.includes('Structural Engineering Certification')}
                    onCheckedChange={(checked) => handleCertificationChange('Structural Engineering Certification', checked as boolean)}
                  />
                  <Label htmlFor="structural-engineering" className="text-sm">
                    Structural Engineering Certification
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="general-maintenance"
                    checked={formData.certifications.includes('General Maintenance License')}
                    onCheckedChange={(checked) => handleCertificationChange('General Maintenance License', checked as boolean)}
                  />
                  <Label htmlFor="general-maintenance" className="text-sm">
                    General Maintenance License
                  </Label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled>
                Cancel
              </Button>
              <Button type="submit" disabled>
                Create Employee
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
