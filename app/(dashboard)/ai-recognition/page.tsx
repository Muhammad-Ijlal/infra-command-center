"use client"

import { useState } from "react"
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
import { mockDetections } from "@/src/data/mock-detections"
import { AIDetection } from "@/src/types/detection"

export default function AIRecognitionPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">AI Recognition</h1>
        <p className="text-muted-foreground mt-1">
          AI-detected infrastructure defects and anomalies
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Needs monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully addressed</p>
          </CardContent>
        </Card>
      </div>

      {/* Detections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Records</CardTitle>
          <CardDescription>
            AI-powered infrastructure anomaly detection with confidence scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detection ID</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Defect Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
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
                        Validate
                      </Button>
                    )}
                    {detection.status === 'validated' && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Validated
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
          <CardTitle>Detection Workflow</CardTitle>
          <CardDescription>How AI detections flow through the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <p className="text-sm font-medium">AI Detection</p>
              <p className="text-xs text-muted-foreground">Automated scanning</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xl font-bold text-orange-600">2</span>
              </div>
              <p className="text-sm font-medium">Validation</p>
              <p className="text-xs text-muted-foreground">Human verification</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <p className="text-sm font-medium">Asset Linking</p>
              <p className="text-xs text-muted-foreground">Connect to asset</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">4</span>
              </div>
              <p className="text-sm font-medium">Contract Creation</p>
              <p className="text-xs text-muted-foreground">Automated response</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

