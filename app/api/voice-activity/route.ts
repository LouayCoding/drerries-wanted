import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const channelId = searchParams.get('channel_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('voice_activity')
      .select('*')
      .order('joined_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (channelId) {
      query = query.eq('channel_id', channelId);
    }

    if (dateFrom) {
      query = query.gte('joined_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('joined_at', dateTo);
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ activity: data || [] });
  } catch (error) {
    console.error('Get voice activity error:', error);
    return NextResponse.json(
      { activity: [], error: 'Failed to fetch voice activity' },
      { status: 500 }
    );
  }
}



