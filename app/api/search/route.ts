import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search in Supabase with fuzzy matching
    const { data, error } = await supabase
      .from('wanted_persons')
      .select('id, username, drerries_tag, avatar, status, severity')
      .or(`username.ilike.%${query}%,drerries_tag.ilike.%${query}%,discord_id.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ results: [], error: error.message }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const results = (data || []).map((person: any) => ({
      id: person.id,
      username: person.username,
      drerriesTag: person.drerries_tag,
      avatar: person.avatar,
      status: person.status,
      severity: person.severity,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ results: [], error: 'Internal server error' }, { status: 500 });
  }
}

