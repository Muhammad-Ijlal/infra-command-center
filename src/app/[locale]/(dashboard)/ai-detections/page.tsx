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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, AlertTriangle, Clock, Eye, MapPin, Activity, FileText, ArrowRight, Image as ImageIcon, ExternalLink, User, Upload, Camera, Loader2 } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { Asset } from "@/types/asset"
import { mockDetections } from "@/data/mock-detections"
import { fetchAssetById } from "@/lib/assets/asset-fetcher"
import { mockAssets } from "@/data/mock-assets"
import { mockEngineers } from "@/data/mock-engineers"
import { AIDetection } from "@/types/detection"
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
  const [linkedAsset, setLinkedAsset] = useState<Asset | null>(null)
  const [assetLoading, setAssetLoading] = useState(false)
  const [, setValidatedDetections] = useState<Set<string>>(new Set())
  const [showEngineerModal, setShowEngineerModal] = useState(false)
  const [selectedEngineer, setSelectedEngineer] = useState<string>('')
  const [showRepairProofModal, setShowRepairProofModal] = useState(false)
  const [repairImage, setRepairImage] = useState<File | null>(null)
  const [repairComment, setRepairComment] = useState('')

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
    // Track that this detection has been validated to show assign buttons
    setValidatedDetections(prev => new Set(prev).add(detectionId))
  }

  const handleAssignEngineer = () => {
    setShowEngineerModal(true)
  }

  const handleConfirmAssignment = () => {
    if (selectedDetection && selectedEngineer) {
      const engineer = mockEngineers.find(e => e.engineer_id === selectedEngineer)
      if (engineer) {
        // Update the detection with assigned engineer
        setDetections(prev =>
          prev.map(d =>
            d.detection_id === selectedDetection.detection_id
              ? { 
                  ...d, 
                  status: 'assigned' as const,
                  assigned_engineer_id: selectedEngineer,
                  assigned_engineer_name: engineer.name,
                  assignment_timestamp: new Date().toISOString()
                }
              : d
          )
        )
        // Update selected detection
        setSelectedDetection({
          ...selectedDetection,
          status: 'assigned' as const,
          assigned_engineer_id: selectedEngineer,
          assigned_engineer_name: engineer.name,
          assignment_timestamp: new Date().toISOString()
        })
        // Close modal and reset selection
        setShowEngineerModal(false)
        setSelectedEngineer('')
      }
    }
  }

  const handleCloseEngineerModal = () => {
    setShowEngineerModal(false)
    setSelectedEngineer('')
  }

  const handleUploadRepairProof = () => {
    setShowRepairProofModal(true)
  }

  const handleRepairImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setRepairImage(file)
    }
  }

  const handleSubmitRepairProof = () => {
    if (selectedDetection && repairImage) {
      // Create a mock URL for the uploaded image
      const imageUrl = URL.createObjectURL(repairImage)
      
      // Update the detection with repair completion
      setDetections(prev =>
        prev.map(d =>
          d.detection_id === selectedDetection.detection_id
            ? {
                ...d,
                status: 'completed' as const,
                repair_image_url: imageUrl,
                repair_completed_at: new Date().toISOString(),
                ai_validation_result: 'approved' as const,
                validation_confidence: 0.95
              }
            : d
        )
      )
      
      // Update selected detection if it's the same one
      if (selectedDetection) {
        setSelectedDetection({
          ...selectedDetection,
          status: 'completed' as const,
          repair_image_url: imageUrl,
          repair_completed_at: new Date().toISOString(),
          ai_validation_result: 'approved' as const,
          validation_confidence: 0.95
        })
      }
      
      // Close modal and reset form
      setShowRepairProofModal(false)
      setRepairImage(null)
      setRepairComment('')
    }
  }

  const handleCloseRepairProofModal = () => {
    setShowRepairProofModal(false)
    setRepairImage(null)
    setRepairComment('')
  }

  const handleViewEngineer = () => {
    if (selectedDetection?.assigned_engineer_id) {
      // Navigate to engineers page with engineer ID parameter
      router.push(`/${locale}/engineers?engineer=${selectedDetection.assigned_engineer_id}`)
    }
  }

  const handleCloseDetection = () => {
    setSelectedDetection(null)
    // Clear query parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('detection')
    router.replace(url.pathname + url.search)
  }

  // Fetch asset details when detection is selected
  useEffect(() => {
    if (selectedDetection) {
      const fetchAsset = async () => {
        setAssetLoading(true)
        try {
          const asset = await fetchAssetById(selectedDetection.asset_id)
          setLinkedAsset(asset)
        } catch (error) {
          console.error('Error fetching asset:', error)
          // Fallback to mock asset if fetch fails
          const mockAsset = mockAssets.find(a => a.asset_id === selectedDetection.asset_id)
          setLinkedAsset(mockAsset || null)
        } finally {
          setAssetLoading(false)
        }
      }
      fetchAsset()
    }
  }, [selectedDetection])

  const getLinkedAsset = () => {
    return linkedAsset
  }

  const getStatusColor = (status: AIDetection['status']) => {
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
                <TableHead>{t('assignedEngineer')}</TableHead>
                <TableHead>{t('slaDeadline')}</TableHead>
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
                    {detection.assigned_engineer_name ? (
                      <div className="text-sm">
                        <p className="font-medium">{detection.assigned_engineer_name}</p>
                        <p className="text-muted-foreground text-xs">{detection.assigned_engineer_id}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {t('unassigned')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {detection.sla_deadline ? (
                      <div className="text-sm">
                        <p className="font-medium">
                          {new Date(detection.sla_deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {detection.sla_hours}h SLA
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
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
              <p className="text-sm font-medium">{t('engineerAssignment')}</p>
              <p className="text-xs text-muted-foreground">{t('automaticAssignment')}</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">4</span>
              </div>
              <p className="text-sm font-medium">{t('repairExecution')}</p>
              <p className="text-xs text-muted-foreground">{t('engineerRepair')}</p>
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
                  {selectedDetection.status === 'validated' && !selectedDetection.assigned_engineer_id && (
                    <Button
                      onClick={() => handleAssignEngineer()}
                      className="gap-2"
                      variant="default"
                    >
                      <User className="h-4 w-4" />
                      {t('assignEngineer')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  {selectedDetection.status === 'in_progress' && selectedDetection.assigned_engineer_id && (
                    <Button
                      onClick={() => handleUploadRepairProof()}
                      className="gap-2"
                      variant="default"
                    >
                      <Camera className="h-4 w-4" />
                      Upload Repair Proof
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  {selectedDetection.status === 'assigned' && selectedDetection.assigned_engineer_id && (
                      <Button
                        onClick={() => handleViewEngineer()}
                        className="gap-2"
                        variant="default"
                      >
                      <User className="h-4 w-4" />
                      {t('assignedEngineer')}
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

              {/* Engineer Assignment Information */}
              {selectedDetection.assigned_engineer_name && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t('engineerAssignment')}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEngineer()}
                        className="h-6 w-6 p-0 hover:bg-muted"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('assignedEngineer')}</p>
                        <p className="font-medium">{selectedDetection.assigned_engineer_name}</p>
                        <p className="text-xs text-muted-foreground">{selectedDetection.assigned_engineer_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('assignmentDate')}</p>
                        <p className="font-medium">
                          {selectedDetection.assignment_timestamp ? 
                            new Date(selectedDetection.assignment_timestamp).toLocaleString() : 
                            '-'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('slaDeadline')}</p>
                        <p className="font-medium">
                          {selectedDetection.sla_deadline ? 
                            new Date(selectedDetection.sla_deadline).toLocaleString() : 
                            '-'
                          }
                        </p>
                        {selectedDetection.sla_hours && (
                          <p className="text-xs text-muted-foreground">{selectedDetection.sla_hours}h SLA</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('repairStatus')}</p>
                        <p className="font-medium capitalize">
                          {selectedDetection.repair_started_at ? 'In Progress' : 'Not Started'}
                        </p>
                        {selectedDetection.repair_started_at && (
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(selectedDetection.repair_started_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}


              {/* Repair Validation */}
              {selectedDetection.repair_image_url && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      {t('repairValidation')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('repairCompleted')}</p>
                        <p className="font-medium">
                          {selectedDetection.repair_completed_at ? 
                            new Date(selectedDetection.repair_completed_at).toLocaleString() : 
                            '-'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('aiValidation')}</p>
                        <Badge 
                          variant={selectedDetection.ai_validation_result === 'approved' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {selectedDetection.ai_validation_result || 'pending'}
                        </Badge>
                        {selectedDetection.validation_confidence && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Confidence: {Math.round(selectedDetection.validation_confidence * 100)}%
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Repair Image Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">{t('beforeRepair')}</h4>
                        <div className="rounded-lg overflow-hidden border">
                          <Image 
                            src={selectedDetection.baseline_image_url || selectedDetection.image_url || ''} 
                            alt="Before repair"
                            width={300}
                            height={200}
                            className="w-full h-[200px] object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('afterRepair')}</h4>
                        <div className="rounded-lg overflow-hidden border">
                          <Image 
                            src={selectedDetection.repair_image_url} 
                            alt="After repair"
                            width={300}
                            height={200}
                            className="w-full h-[200px] object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

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
                const linkedAsset = getLinkedAsset()
                return assetLoading ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('linkedAsset')}
                    </h3>
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading asset details...</span>
                      </div>
                    </div>
                  </div>
                ) : linkedAsset ? (
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
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t('assetName')}</p>
                          <p className="font-semibold text-lg">{linkedAsset.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{t('assetCategory')}</p>
                          <Badge 
                            variant="outline" 
                            className="capitalize text-sm px-3 py-1"
                          >
                            {linkedAsset.category.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('assetStatus')}</p>
                            <p className="font-medium capitalize">{linkedAsset.status.replace(/_/g, ' ')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('lastMaintenance')}</p>
                            <p className="font-medium">
                              {linkedAsset.last_updated_date ? 
                                new Date(linkedAsset.last_updated_date).toLocaleDateString() : 
                                'Not available'
                              }
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
                      Detection has been validated and is ready for further action.
                    </p>
                  </div>
                </div>
              )}

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

      {/* Engineer Assignment Modal */}
      <Dialog open={showEngineerModal} onOpenChange={setShowEngineerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('assignEngineer')}
            </DialogTitle>
            <DialogDescription>
              Select an engineer to assign to this detection
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Engineer Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Engineer
              </label>
              <Select value={selectedEngineer} onValueChange={setSelectedEngineer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an engineer..." />
                </SelectTrigger>
                <SelectContent>
                  {mockEngineers.map((engineer) => (
                    <SelectItem key={engineer.engineer_id} value={engineer.engineer_id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          engineer.status === 'available' ? 'bg-green-500' : 
                          engineer.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        {engineer.name} ({engineer.engineer_id})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Engineer Details */}
            {selectedEngineer && (
              <div className="border rounded-lg p-4 bg-muted/50">
                {(() => {
                  const engineer = mockEngineers.find(e => e.engineer_id === selectedEngineer)
                  if (!engineer) return null
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{engineer.name}</p>
                          <p className="text-sm text-muted-foreground">{engineer.engineer_id}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge 
                            variant={engineer.status === 'available' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {engineer.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Assignments</p>
                          <p className="font-medium">{engineer.current_assignments}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">SLA Compliance</p>
                          <p className="font-medium">{engineer.sla_compliance_rate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completed</p>
                          <p className="font-medium">{engineer.completed_assignments}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Specializations</p>
                        <div className="flex flex-wrap gap-1">
                          {engineer.specialization.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleConfirmAssignment}
                disabled={!selectedEngineer}
                className="flex-1"
              >
                <User className="h-4 w-4 mr-2" />
                Confirm Assignment
              </Button>
              <Button
                onClick={handleCloseEngineerModal}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Repair Proof Upload Modal */}
      <Dialog open={showRepairProofModal} onOpenChange={setShowRepairProofModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Repair Proof
            </DialogTitle>
            <DialogDescription>
              Upload an image showing the completed repair work
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <Label htmlFor="repair-image" className="text-sm font-medium mb-2 block">
                Repair Image
              </Label>
              <Input
                id="repair-image"
                type="file"
                accept="image/*"
                onChange={handleRepairImageChange}
                className="cursor-pointer"
              />
              {repairImage && (
                <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Selected: {repairImage.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(repairImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="repair-comment" className="text-sm font-medium mb-2 block">
                Repair Notes (Optional)
              </Label>
              <Textarea
                id="repair-comment"
                placeholder="Describe the repair work completed..."
                value={repairComment}
                onChange={(e) => setRepairComment(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmitRepairProof}
                disabled={!repairImage}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Repair Proof
              </Button>
              <Button
                onClick={handleCloseRepairProofModal}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

