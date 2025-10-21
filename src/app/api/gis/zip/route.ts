import { NextRequest, NextResponse } from 'next/server'
import { gdbProcessor } from '@/lib/gis/gdb-processor'
import { GdbImportOptions } from '@/types/gis'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const action = formData.get('action') as string
    const options = formData.get('options') ? JSON.parse(formData.get('options') as string) : {}

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { success: false, error: 'File must be a ZIP archive' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const zipBuffer = Buffer.from(arrayBuffer)

    switch (action) {
      case 'list-layers':
        try {
          const { gdbPath, cleanup } = await gdbProcessor.processZipFile(zipBuffer, file.name)
          const layers = await gdbProcessor.listLayers(gdbPath)
          await cleanup() // Clean up extracted files
          
          return NextResponse.json({ success: true, data: layers })
        } catch (error) {
          return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to process ZIP file' },
            { status: 500 }
          )
        }

      case 'import-layer':
        const layerName = formData.get('layerName') as string
        if (!layerName) {
          return NextResponse.json(
            { success: false, error: 'Layer name is required' },
            { status: 400 }
          )
        }

        try {
          const { gdbPath, cleanup } = await gdbProcessor.processZipFile(zipBuffer, file.name)
          const result = await gdbProcessor.importLayer(gdbPath, layerName, options as GdbImportOptions)
          await cleanup() // Clean up extracted files
          
          return NextResponse.json({ success: true, data: result })
        } catch (error) {
          return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to import layer' },
            { status: 500 }
          )
        }

      case 'import-all-layers':
        try {
          const { gdbPath, cleanup } = await gdbProcessor.processZipFile(zipBuffer, file.name)
          const results = await gdbProcessor.importAllLayers(gdbPath, options as GdbImportOptions)
          await cleanup() // Clean up extracted files
          
          return NextResponse.json({ success: true, data: results })
        } catch (error) {
          return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to import layers' },
            { status: 500 }
          )
        }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('ZIP upload error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
