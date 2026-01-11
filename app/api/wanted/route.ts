import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET - Fetch all wanted persons or single by ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Fetch single person
      const { data, error } = await supabase
        .from('wanted_persons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return NextResponse.json({ person: data });
    } else {
      // Fetch all persons
      const { data, error } = await supabase
        .from('wanted_persons')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ persons: data });
    }
  } catch (error: any) {
    console.error('GET wanted persons error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wanted persons' },
      { status: 500 }
    );
  }
}

// POST - Create new wanted person (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      drerries_tag,
      discord_id,
      avatar,
      status,
      severity,
      charges,
      description,
      last_seen,
      reward,
      date_issued,
      evidence,
      aliases,
      media_urls,
      media_types,
    } = body;

    // Validate required fields
    if (!username || !drerries_tag || !status || !severity || !charges || charges.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate new ID
    const { data: maxIdData } = await supabase
      .from('wanted_persons')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    const newId = maxIdData && maxIdData.length > 0 
      ? (parseInt(maxIdData[0].id) + 1).toString()
      : '1';

    // Insert new person
    const { data, error } = await supabase
      .from('wanted_persons')
      .insert([{
        id: newId,
        username: username.trim(),
        drerries_tag: drerries_tag.trim(),
        discord_id: discord_id || null,
        avatar: avatar || '',
        status,
        severity,
        charges,
        description: description?.trim() || '',
        last_seen: last_seen?.trim() || 'Onbekend',
        reward: reward?.trim() || '0 Server Credits',
        date_issued: date_issued || new Date().toISOString().split('T')[0],
        evidence: evidence || [],
        aliases: aliases || [],
        media_urls: media_urls || [],
        media_types: media_types || [],
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, person: data }, { status: 201 });
  } catch (error: any) {
    console.error('POST wanted person error:', error);
    return NextResponse.json(
      { error: 'Failed to create wanted person' },
      { status: 500 }
    );
  }
}

// PUT - Update existing wanted person (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Person ID is required' },
        { status: 400 }
      );
    }

    // Sanitize and prepare updates
    const sanitizedUpdates: any = {};
    
    if (updates.username) sanitizedUpdates.username = updates.username.trim();
    if (updates.drerries_tag) sanitizedUpdates.drerries_tag = updates.drerries_tag.trim();
    if (updates.discord_id !== undefined) sanitizedUpdates.discord_id = updates.discord_id;
    if (updates.avatar !== undefined) sanitizedUpdates.avatar = updates.avatar;
    if (updates.status) sanitizedUpdates.status = updates.status;
    if (updates.severity) sanitizedUpdates.severity = updates.severity;
    if (updates.charges) sanitizedUpdates.charges = updates.charges;
    if (updates.description !== undefined) sanitizedUpdates.description = updates.description.trim();
    if (updates.last_seen !== undefined) sanitizedUpdates.last_seen = updates.last_seen.trim();
    if (updates.reward !== undefined) sanitizedUpdates.reward = updates.reward.trim();
    if (updates.date_issued) sanitizedUpdates.date_issued = updates.date_issued;
    if (updates.evidence !== undefined) sanitizedUpdates.evidence = updates.evidence;
    if (updates.aliases !== undefined) sanitizedUpdates.aliases = updates.aliases;
    if (updates.media_urls !== undefined) sanitizedUpdates.media_urls = updates.media_urls;
    if (updates.media_types !== undefined) sanitizedUpdates.media_types = updates.media_types;

    // Update in database
    const { data, error } = await supabase
      .from('wanted_persons')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, person: data });
  } catch (error: any) {
    console.error('PUT wanted person error:', error);
    return NextResponse.json(
      { error: 'Failed to update wanted person' },
      { status: 500 }
    );
  }
}

// DELETE - Remove wanted person (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Person ID is required' },
        { status: 400 }
      );
    }

    // Delete from database
    const { error } = await supabase
      .from('wanted_persons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Person deleted successfully' });
  } catch (error: any) {
    console.error('DELETE wanted person error:', error);
    return NextResponse.json(
      { error: 'Failed to delete wanted person' },
      { status: 500 }
    );
  }
}

