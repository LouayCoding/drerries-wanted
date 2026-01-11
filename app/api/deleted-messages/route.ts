import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authorId = searchParams.get('author_id');
    const channelId = searchParams.get('channel_id');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('deleted_messages')
      .select('*')
      .order('deleted_at', { ascending: false });

    if (authorId) {
      query = query.eq('author_id', authorId);
    }

    if (channelId) {
      query = query.eq('channel_id', channelId);
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ messages: data || [] });
  } catch (error) {
    console.error('Get deleted messages error:', error);
    return NextResponse.json(
      { messages: [], error: 'Failed to fetch deleted messages' },
      { status: 500 }
    );
  }
}



