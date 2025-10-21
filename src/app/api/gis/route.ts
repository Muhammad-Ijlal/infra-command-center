import { NextRequest, NextResponse } from 'next/server'
import { gdbProcessor } from '@/lib/gis/gdb-processor'
import { GdbImportOptions } from '@/types/gis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'layers':
        const layers = await gdbProcessor.getLayers()
        return NextResponse.json({ success: true, data: layers })

      case 'layer-features':
        const layerId = searchParams.get('layerId')
        const limit = parseInt(searchParams.get('limit') || '1000')
        const offset = parseInt(searchParams.get('offset') || '0')

        if (!layerId) {
          return NextResponse.json(
            { success: false, error: 'Layer ID is required' },
            { status: 400 }
          )
        }

        const features = await gdbProcessor.getLayerFeatures(layerId, limit, offset)
        return NextResponse.json({ success: true, data: features })

      case 'layer-with-features':
        const layerWithFeaturesId = searchParams.get('layerId')
        
        if (!layerWithFeaturesId) {
          return NextResponse.json(
            { success: false, error: 'Layer ID is required' },
            { status: 400 }
          )
        }

        const layerWithFeatures = await gdbProcessor.getLayerWithFeatures(layerWithFeaturesId)
        return NextResponse.json({ success: true, data: layerWithFeatures })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('GIS API error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, gdbPath, layerName, options } = body

    switch (action) {
      case 'list-layers':
        if (!gdbPath) {
          return NextResponse.json(
            { success: false, error: 'GDB path is required' },
            { status: 400 }
          )
        }

        const layers = await gdbProcessor.listLayers(gdbPath)
        return NextResponse.json({ success: true, data: layers })

      case 'import-layer':
        if (!gdbPath || !layerName) {
          return NextResponse.json(
            { success: false, error: 'GDB path and layer name are required' },
            { status: 400 }
          )
        }

        const importResult = await gdbProcessor.importLayer(
          gdbPath,
          layerName,
          options as GdbImportOptions
        )
        return NextResponse.json({ success: true, data: importResult })

      case 'import-all-layers':
        if (!gdbPath) {
          return NextResponse.json(
            { success: false, error: 'GDB path is required' },
            { status: 400 }
          )
        }

        const importResults = await gdbProcessor.importAllLayers(
          gdbPath,
          options as GdbImportOptions
        )
        return NextResponse.json({ success: true, data: importResults })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('GIS API error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
