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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <GdbUploader />
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
