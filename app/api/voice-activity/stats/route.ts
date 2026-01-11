import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all completed voice activities (with duration)
    const { data: activities, error } = await supabase
      .from('voice_activity')
      .select('*')
      .not('duration_seconds', 'is', null)
      .not('left_at', 'is', null);

    if (error) {
      throw error;
    }

    if (!activities || activities.length === 0) {
      return NextResponse.json({
        total_hours: 0,
        top_users: [],
        peak_hours: [],
        channel_stats: []
      });
    }

    // Calculate total hours
    const totalSeconds = activities.reduce((sum, a) => sum + (a.duration_seconds || 0), 0);
    const total_hours = Math.round((totalSeconds / 3600) * 10) / 10;

    // Calculate top users
    const userMap = new Map<string, { user_id: string; username: string; total_seconds: number }>();
    activities.forEach(a => {
      const existing = userMap.get(a.user_id);
      if (existing) {
        existing.total_seconds += a.duration_seconds || 0;
      } else {
        userMap.set(a.user_id, {
          user_id: a.user_id,
          username: a.username,
          total_seconds: a.duration_seconds || 0
        });
      }
    });
    const top_users = Array.from(userMap.values())
      .sort((a, b) => b.total_seconds - a.total_seconds)
      .slice(0, 10);

    // Calculate peak hours (0-23)
    const hourMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
      hourMap.set(i, 0);
    }
    activities.forEach(a => {
      const hour = new Date(a.joined_at).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });
    const peak_hours = Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate channel stats
    const channelMap = new Map<string, number>();
    activities.forEach(a => {
      channelMap.set(a.channel_name, (channelMap.get(a.channel_name) || 0) + 1);
    });
    const channel_stats = Array.from(channelMap.entries())
      .map(([channel_name, total_sessions]) => ({ channel_name, total_sessions }))
      .sort((a, b) => b.total_sessions - a.total_sessions);

    return NextResponse.json({
      total_hours,
      top_users,
      peak_hours,
      channel_stats
    });
  } catch (error) {
    console.error('Get voice stats error:', error);
    return NextResponse.json(
      { 
        total_hours: 0,
        top_users: [],
        peak_hours: [],
        channel_stats: [],
        error: 'Failed to fetch stats'
      },
      { status: 500 }
    );
  }
}



