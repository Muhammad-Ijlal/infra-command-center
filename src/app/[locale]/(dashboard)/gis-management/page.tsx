'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Layers, MapPin } from 'lucide-react'
import { GdbUploader } from '@/components/gis/gdb-uploader'
import { GisLayersList } from '@/components/gis/gis-layers-list'

export default function GisManagementPage() {
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">GIS Data Management</h1>
        <p className="text-muted-foreground">
          Upload, process, and manage GIS data from .GDB files in your Supabase database
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload .GDB Files
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Manage Layers
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
                Upload ESRI File Geodatabase (.gdb) files and import them into your Supabase database with PostGIS support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1</div>
                    <div className="text-sm font-medium">Upload File</div>
                    <div className="text-xs text-muted-foreground">Select your .gdb file</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-sm font-medium">Analyze Layers</div>
                    <div className="text-xs text-muted-foreground">Review available layers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm font-medium">Import Data</div>
                    <div className="text-xs text-muted-foreground">Store in Supabase</div>
                  </div>
                </div>
                
                <GdbUploader />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>PostGIS extension enabled in Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>GDAL library installed on server</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>ESRI File Geodatabase (.gdb) format</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Large files may take time to process</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layers" className="space-y-6">
          <GisLayersList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
