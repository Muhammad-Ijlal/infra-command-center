'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Building, MapPin } from 'lucide-react'
import { GdbUploader } from '@/components/gis/gdb-uploader'
import { ImportedAssetsList } from '@/components/gis/imported-assets-list'

export default function GisManagementPage() {
  const [activeTab, setActiveTab] = useState('upload')
  const [importCompleted, setImportCompleted] = useState(false)

  const handleImportComplete = () => {
    setImportCompleted(true)
    // Switch to assets tab after import
    setActiveTab('assets')
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">GIS Data Management</h1>
        <p className="text-muted-foreground">
          Upload .GDB files and automatically create infrastructure assets
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload .GDB Files
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Imported Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                GIS Data Import
              </CardTitle>
              <CardDescription>
                Upload .GDB files to automatically create infrastructure assets. 
                Each feature in your GIS data will become an asset with full passport information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <GdbUploader onImportComplete={handleImportComplete} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assets" className="space-y-6">
          <ImportedAssetsList onImportComplete={importCompleted ? handleImportComplete : undefined} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
