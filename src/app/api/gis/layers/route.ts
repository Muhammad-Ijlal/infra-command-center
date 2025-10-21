import { NextRequest, NextResponse } from 'next/server'
import { gdbProcessor } from '@/lib/gis/gdb-processor'

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
