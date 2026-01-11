'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { VoiceActivity, VoiceStats } from '@/types/wanted';
import { Mic, Clock, Users, TrendingUp, LogIn, LogOut, Filter, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function VoiceActivityPage() {
  const [activity, setActivity] = useState<VoiceActivity[]>([]);
  const [stats, setStats] = useState<VoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [filterChannel, setFilterChannel] = useState('');
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  // Calculate live users
  const liveUsers = useMemo(() => {
    return activity.filter(a => !a.left_at);
  }, [activity]);

  // Calculate longest sessions
  const longestSessions = useMemo(() => {
    return [...activity]
      .filter(a => a.duration_seconds)
      .sort((a, b) => (b.duration_seconds || 0) - (a.duration_seconds || 0))
      .slice(0, 10);
  }, [activity]);

  // Fetch voice activity
  useEffect(() => {
    async function fetchVoiceActivity() {
      try {
        // Build query with filters
        let query = supabase
          .from('voice_activity')
          .select('*')
          .order('joined_at', { ascending: false })
          .limit(100);

        if (filterUser) {
          query = query.ilike('username', `%${filterUser}%`);
        }
        if (filterChannel) {
          query = query.ilike('channel_name', `%${filterChannel}%`);
        }
        if (showLiveOnly) {
          query = query.is('left_at', null);
        }

        const { data: activityData, error: activityError } = await query;

        if (activityError) {
          console.error('Error fetching voice activity:', activityError);
        } else {
          setActivity(activityData || []);
        }

        // Fetch stats
        try {
          const response = await fetch('/api/voice-activity/stats');
          if (response.ok) {
            const statsData = await response.json();
            setStats(statsData);
          } else {
            console.error('Stats fetch failed:', response.status);
            setStats({
              total_hours: 0,
              top_users: [],
              peak_hours: [],
              channel_stats: []
            });
          }
        } catch (statsError) {
          console.error('Stats error:', statsError);
          setStats({
            total_hours: 0,
            top_users: [],
            peak_hours: [],
            channel_stats: []
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVoiceActivity();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('voice_activity_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_activity',
        },
        (payload) => {
          console.log('Voice activity change received!', payload);
          fetchVoiceActivity();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterUser, filterChannel, showLiveOnly]);

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Live';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}u ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  // Get heatmap color
  const getHeatmapColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-[#2f3136]';
    const intensity = count / maxCount;
    if (intensity > 0.75) return 'bg-[#5865f2]';
    if (intensity > 0.5) return 'bg-[#5865f2]/70';
    if (intensity > 0.25) return 'bg-[#5865f2]/40';
    return 'bg-[#5865f2]/20';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#b9bbbe]">Laden van voice activiteit...</p>
        </div>
      </div>
    );
  }

  const maxPeakCount = stats?.peak_hours.reduce((max, h) => Math.max(max, h.count), 0) || 1;

  return (
    <div className="min-h-screen bg-[#202225]">

      <div className="container mx-auto py-8 px-4">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mic className="w-8 h-8 text-[#5865f2]" />
            <h1 className="text-4xl font-bold text-white">Voice Activiteit</h1>
          </div>
          <p className="text-[#b9bbbe]">
            Real-time voice tracking met joins, leaves en statistieken
          </p>
        </div>

        {/* Stats Overview - Simpel en Clean */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-[#202225] p-4 rounded hover:border-[#5865f2] transition-colors">
            <div className="text-sm text-[#72767d] mb-1">Totale Uren</div>
            <div className="text-2xl font-bold text-white">{stats ? Math.round(stats.total_hours) : 0}u</div>
          </div>

          <div className="border border-[#202225] p-4 rounded hover:border-[#5865f2] transition-colors">
            <div className="text-sm text-[#72767d] mb-1">Actieve Users</div>
            <div className="text-2xl font-bold text-white">{stats?.top_users.length || 0}</div>
          </div>

          <div className="border border-[#202225] p-4 rounded hover:border-[#5865f2] transition-colors">
            <div className="text-sm text-[#72767d] mb-1">Kanalen</div>
            <div className="text-2xl font-bold text-white">{stats?.channel_stats.length || 0}</div>
          </div>
        </div>

        {/* Filters - Compacter */}
        <div className="border border-[#202225] p-4 rounded mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Zoek gebruiker..."
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#40444b] text-white text-sm rounded border border-[#202225] focus:border-[#5865f2] outline-none"
            />
            <input
              type="text"
              placeholder="Zoek kanaal..."
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#40444b] text-white text-sm rounded border border-[#202225] focus:border-[#5865f2] outline-none"
            />
            <button
              onClick={() => setShowLiveOnly(!showLiveOnly)}
              className={`px-4 py-2 text-sm rounded border transition-colors whitespace-nowrap ${
                showLiveOnly 
                  ? 'border-[#43b581] text-[#43b581] bg-[#43b581]/10' 
                  : 'border-[#202225] text-[#72767d] hover:text-white'
              }`}
            >
              {showLiveOnly ? '✓ ' : ''}Alleen Live
            </button>
          </div>
        </div>

        {/* Two Column Layout voor Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Longest Sessions */}
          {longestSessions.length > 0 && (
            <div className="border border-[#202225] p-6 rounded">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#faa61a]" />
                <h2 className="text-xl font-bold text-white">Langste Sessies</h2>
              </div>
              <div className="space-y-2">
                {longestSessions.slice(0, 5).map((session, index) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-3 hover:bg-[#2f3136] transition-colors rounded"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`text-sm font-mono flex-shrink-0 w-8 ${
                        index === 0 ? 'text-[#faa61a]' : 
                        index === 1 ? 'text-[#b9bbbe]' : 
                        index === 2 ? 'text-[#cd7f32]' : 
                        'text-[#72767d]'
                      }`}>
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm truncate">{session.username}</div>
                        <div className="text-xs text-[#72767d]">#{session.channel_name}</div>
                      </div>
                    </div>
                    <div className="text-[#43b581] font-bold text-sm flex-shrink-0 ml-3">
                      {formatDuration(session.duration_seconds)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Users */}
          {stats && stats.top_users.length > 0 && (
            <div className="border border-[#202225] p-6 rounded">
              <h2 className="text-xl font-bold text-white mb-4">Top Voice Users</h2>
              <div className="space-y-2">
                {stats.top_users.slice(0, 5).map((user, index) => (
                  <div 
                    key={user.user_id}
                    className="flex items-center justify-between p-3 hover:bg-[#2f3136] transition-colors rounded"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`text-sm font-mono flex-shrink-0 w-8 ${
                        index === 0 ? 'text-[#faa61a]' : 
                        index === 1 ? 'text-[#b9bbbe]' : 
                        index === 2 ? 'text-[#cd7f32]' : 
                        'text-[#72767d]'
                      }`}>
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm truncate">{user.username}</div>
                        <div className="text-xs text-[#72767d]">
                          {Math.round(user.total_seconds / 3600 * 10) / 10}u totaal
                        </div>
                      </div>
                    </div>
                    <div className="text-[#43b581] font-bold text-sm flex-shrink-0 ml-3">
                      {formatDuration(user.total_seconds)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Peak Hours - Compacter */}
        {stats && stats.peak_hours.length > 0 && (
          <div className="border border-[#202225] p-6 rounded mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Peak Uren</h2>
            <div className="grid grid-cols-12 md:grid-cols-24 gap-1">
              {stats.peak_hours.slice(0, 24).map((hour) => (
                <div key={hour.hour} className="text-center">
                  <div 
                    className={`h-16 md:h-20 rounded ${getHeatmapColor(hour.count, maxPeakCount)} transition-colors cursor-help`}
                    title={`${hour.hour}:00 - ${hour.count} joins`}
                  ></div>
                  <div className="text-[10px] text-[#72767d] mt-1">{hour.hour}u</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Users - verwijderd, zit al in two-column layout */}

        {/* Channel Stats - Compacter */}
        {stats && stats.channel_stats.length > 0 && (
          <div className="border border-[#202225] p-6 rounded mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Kanalen</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stats.channel_stats.map((channel) => (
                <div 
                  key={channel.channel_name}
                  className="flex items-center justify-between p-3 border border-[#202225] rounded hover:border-[#5865f2] transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="text-white text-sm font-medium truncate">#{channel.channel_name}</div>
                    <div className="text-xs text-[#72767d]">{channel.total_sessions}x</div>
                  </div>
                  <Mic className="w-4 h-4 text-[#5865f2] flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline - Compacter */}
        <div className="border border-[#202225] p-6 rounded">
          <h2 className="text-xl font-bold text-white mb-4">
            Timeline <span className="text-[#72767d] text-sm font-normal">({activity.length})</span>
          </h2>
          {activity.length > 0 ? (
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {activity.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-2 border-l-2 border-[#202225] hover:border-[#5865f2] hover:bg-[#2f3136] transition-colors rounded-r"
                >
                  <div className="flex-shrink-0">
                    {item.left_at ? (
                      <LogOut className="w-3.5 h-3.5 text-[#f04747]" />
                    ) : (
                      <LogIn className="w-3.5 h-3.5 text-[#43b581]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white font-medium truncate">{item.username}</span>
                      <span className="text-[#72767d] flex-shrink-0">{item.left_at ? 'left' : 'joined'}</span>
                      <span className="text-[#5865f2] truncate">#{item.channel_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {item.duration_seconds && (
                      <span className="text-xs text-[#72767d]">
                        {formatDuration(item.duration_seconds)}
                      </span>
                    )}
                    <span className="text-xs text-[#72767d] hidden md:block">
                      {new Date(item.joined_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mic className="w-12 h-12 text-[#72767d] mx-auto mb-3 opacity-50" />
              <p className="text-[#b9bbbe]">Geen activiteit gevonden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
