import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ reports: data || [] });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { reports: [], error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      reported_user_id,
      reported_username,
      reported_tag,
      reported_avatar,
      reporter_id,
      reason,
      media_urls
    } = body;

    // Validate required fields
    if (!reported_user_id || !reported_username || !reported_tag || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert report into database
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        reported_user_id,
        reported_username,
        reported_tag,
        reported_avatar: reported_avatar || '',
        reporter_id: reporter_id || null,
        reason,
        media_urls: media_urls || [],
        status: 'PENDING'
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, report: data });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

