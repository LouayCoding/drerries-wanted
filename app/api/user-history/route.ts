import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const changeType = searchParams.get('change_type');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('user_history')
      .select('*')
      .order('changed_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (changeType) {
      query = query.eq('change_type', changeType);
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ history: data || [] });
  } catch (error) {
    console.error('Get user history error:', error);
    return NextResponse.json(
      { history: [], error: 'Failed to fetch user history' },
      { status: 500 }
    );
  }
}

