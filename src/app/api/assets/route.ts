import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const statsOnly = searchParams.get('stats') === 'true'

    // If only stats are requested, return status counts
    if (statsOnly) {
      const { data: statusCounts, error } = await supabaseAdmin
        .from('assets')
        .select('status')
        .not('status', 'is', null)

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      const counts = {
        operational: statusCounts?.filter(a => a.status === 'operational').length || 0,
        maintenance_required: statusCounts?.filter(a => a.status === 'maintenance_required').length || 0,
        under_maintenance: statusCounts?.filter(a => a.status === 'under_maintenance').length || 0,
        decommissioned: statusCounts?.filter(a => a.status === 'decommissioned').length || 0,
        total: statusCounts?.length || 0
      }

      return NextResponse.json({
        success: true,
        stats: counts
      })
    }

    let query = supabaseAdmin
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (status) {
      query = query.eq('status', status)
    }

    const { data: assets, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabaseAdmin
      .from('assets')
      .select('*', { count: 'exact', head: true })

    if (category) {
      countQuery = countQuery.eq('category', category)
    }
    
    if (status) {
      countQuery = countQuery.eq('status', status)
    }

    const { count } = await countQuery

    return NextResponse.json({
      success: true,
      data: assets || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    })

  } catch (error) {
    console.error('Assets fetch error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { asset_id, name, category, status, location_lat, location_lng, location_address } = body

    if (!asset_id || !name || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('assets')
      .insert({
        asset_id,
        name,
        category,
        status: status || 'operational',
        location_lat,
        location_lng,
        location_address,
        impact_score: 50 // Default score
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Asset creation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
