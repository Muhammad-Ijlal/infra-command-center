import { NextRequest, NextResponse } from 'next/server'
import { gdbProcessor } from '@/lib/gis/gdb-processor'
import { assetConverter } from '@/lib/gis/asset-converter'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const action = formData.get('action') as string
    const layerName = formData.get('layerName') as string
    const file = formData.get('file') as File

    if (!action || !layerName || !file) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    if (action !== 'convert-to-assets') {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const zipBuffer = Buffer.from(await file.arrayBuffer())

    try {
      // Process ZIP file and get GDB path
      const { gdbPath, cleanup } = await gdbProcessor.processZipFile(zipBuffer, file.name)
      
      // Import the layer to get features
      const importResult = await gdbProcessor.importLayer(gdbPath, layerName)
      
      if (!importResult.success || !importResult.layer_id) {
        await cleanup()
        return NextResponse.json(
          { success: false, error: 'Failed to import layer' },
          { status: 500 }
        )
      }

      // Get features from the imported layer
      const { data: features, error: featuresError } = await supabaseAdmin
        .from('gis_features')
        .select('*')
        .eq('layer_id', importResult.layer_id)

      if (featuresError || !features) {
        await cleanup()
        return NextResponse.json(
          { success: false, error: 'Failed to fetch features' },
          { status: 500 }
        )
      }

      if (features.length === 0) {
        await cleanup()
        return NextResponse.json(
          { success: false, error: 'No features found in layer' },
          { status: 400 }
        )
      }

      // Convert features to assets with integrated passport data
      const assets = await assetConverter.convertGdbFeaturesToAssets(
        layerName,
        features
      )

      // Save to database
      const saveResult = await assetConverter.saveAssetsToDatabase(
        assets,
        importResult.layer_id
      )

      await cleanup() // Clean up extracted files

      return NextResponse.json({
        success: saveResult.success,
        data: {
          layer_id: importResult.layer_id,
          features_processed: features.length,
          assets_created: saveResult.assetIds.length,
          asset_ids: saveResult.assetIds,
          errors: saveResult.errors
        }
      })

    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Failed to process file' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Asset conversion error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
