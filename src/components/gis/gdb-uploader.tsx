'use client'

import { useState } from 'react'
import { useGis } from '@/hooks/use-gis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, MapPin, CheckCircle, AlertCircle, Loader2, Building } from 'lucide-react'
import { GdbLayerInfo, GdbImportResult } from '@/types/gis'

export function GdbUploader() {
  const { loading, error } = useGis()
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [availableLayers, setAvailableLayers] = useState<GdbLayerInfo[]>([])
  const [selectedLayer, setSelectedLayer] = useState('')
  const [conversionLoading, setConversionLoading] = useState(false)
  const [importOptions, setImportOptions] = useState({
    layer_name: '',
    description: '',
    srid: 4326,
    batch_size: 1000,
    skip_errors: false
  })
  const [importResults, setImportResults] = useState<GdbImportResult[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'select' | 'import' | 'complete'>('upload')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCurrentStep('select')
    }
  }

  const handleListLayers = async () => {
    if (!selectedFile) return
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('action', 'list-layers')
      
      const response = await fetch('/api/gis/zip', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setAvailableLayers(result.data)
        setCurrentStep('select')
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Failed to list layers:', err)
    }
  }

  const handleImportLayer = async () => {
    if (!selectedFile || !selectedLayer) return
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('action', 'import-layer')
      formData.append('layerName', selectedLayer)
      formData.append('options', JSON.stringify(importOptions))
      
      const response = await fetch('/api/gis/zip', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setImportResults([result.data])
        setCurrentStep('complete')
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Failed to import layer:', err)
    }
  }

  const handleImportAllLayers = async () => {
    if (!selectedFile) return
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('action', 'import-all-layers')
      formData.append('options', JSON.stringify(importOptions))
      
      const response = await fetch('/api/gis/zip', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setImportResults(result.data)
        setCurrentStep('complete')
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Failed to import all layers:', err)
    }
  }

  const handleConvertToAssets = async () => {
    if (!selectedFile || !selectedLayer) return

    try {
      setConversionLoading(true)
      
      const formData = new FormData()
      formData.append('action', 'convert-to-assets')
      formData.append('layerName', selectedLayer)
      formData.append('file', selectedFile)
      
      const response = await fetch('/api/gis/convert-to-assets', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setImportResults([{
          success: true,
          layer_id: result.data.layer_id,
          features_imported: result.data.features_processed,
          errors: [],
          warnings: [`Created ${result.data.assets_created} assets from ${selectedLayer} layer`]
        }])
        setCurrentStep('complete')
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Failed to convert to assets:', err)
    } finally {
      setConversionLoading(false)
    }
  }

  const resetUploader = () => {
    setSelectedFile(null)
    setAvailableLayers([])
    setSelectedLayer('')
    setImportResults([])
    setCurrentStep('upload')
    // Reset file input
    const fileInput = document.getElementById('zip-file') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload .GDB File
          </CardTitle>
          <CardDescription>
            Upload and process ESRI File Geodatabase (.gdb) files to store GIS data in Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentStep === 'upload' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zip-file">Upload ZIP File</Label>
                <Input
                  id="zip-file"
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground">
                  Upload a ZIP file containing your .gdb folder
                </p>
                <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                  <strong>Instructions:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Zip your .gdb folder (e.g., AlSaneem_AlWajba.gdb)</li>
                    <li>Upload the ZIP file here</li>
                    <li>The system will extract and process it automatically</li>
                  </ol>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Supported formats: ESRI File Geodatabase (.gdb) in ZIP format</p>
                <p>Note: GDAL must be installed on the server to process .gdb files</p>
              </div>
            </div>
          )}

          {currentStep === 'select' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">File: {selectedFile?.name}</span>
              </div>

              <Button 
                onClick={handleListLayers}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Layers...
                  </>
                ) : (
                  'Analyze Layers'
                )}
              </Button>

              {availableLayers.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="layer-select">Select Layer to Import</Label>
                    <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a layer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLayers.map((layer) => (
                          <SelectItem key={layer.name} value={layer.name}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{layer.name}</span>
                              <span className="text-sm text-muted-foreground">
                                ({layer.feature_count} features)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={handleImportLayer}
                        disabled={!selectedLayer || loading}
                        className="w-full"
                      >
                        Import Selected Layer
                      </Button>
                      <Button 
                        onClick={handleImportAllLayers}
                        disabled={loading}
                        variant="outline"
                        className="w-full"
                      >
                        Import All Layers
                      </Button>
                    </div>
                    
                    {(selectedLayer === 'Guardrail' || selectedLayer === 'Street_Light_Pole') && (
                      <div className="border-t pt-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          Convert to Assets: Create asset records from GDB features
                        </div>
                        <Button 
                          onClick={handleConvertToAssets}
                          disabled={!selectedLayer || loading}
                          variant="secondary"
                          className="w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Converting to Assets...
                            </>
                          ) : (
                            <>
                              <Building className="mr-2 h-4 w-4" />
                              Convert {selectedLayer} to Assets
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'import' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layer-name">Layer Name (Optional)</Label>
                <Input
                  id="layer-name"
                  value={importOptions.layer_name}
                  onChange={(e) => setImportOptions(prev => ({ ...prev, layer_name: e.target.value }))}
                  placeholder="Custom layer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={importOptions.description}
                  onChange={(e) => setImportOptions(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Layer description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="srid">SRID</Label>
                  <Input
                    id="srid"
                    type="number"
                    value={importOptions.srid}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, srid: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={importOptions.batch_size}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, batch_size: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="skip-errors"
                  checked={importOptions.skip_errors}
                  onChange={(e) => setImportOptions(prev => ({ ...prev, skip_errors: e.target.checked }))}
                />
                <Label htmlFor="skip-errors">Skip errors and continue</Label>
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Import Complete!</span>
              </div>

              {importResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {result.success ? 'Success' : 'Failed'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>Features imported: {result.features_imported}</p>
                      {result.layer_id && <p>Layer ID: {result.layer_id}</p>}
                      {result.errors.length > 0 && (
                        <div>
                          <p className="font-medium text-red-600">Errors:</p>
                          <ul className="list-disc list-inside">
                            {result.errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.warnings.length > 0 && (
                        <div>
                          <p className="font-medium text-yellow-600">Warnings:</p>
                          <ul className="list-disc list-inside">
                            {result.warnings.map((warning, i) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={resetUploader} className="w-full">
                Upload Another File
              </Button>
            </div>
          )}

          {loading && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Processing...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
