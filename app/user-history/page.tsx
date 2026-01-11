'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { UserHistory } from '@/types/wanted';
import { User, Search, Filter, Image as ImageIcon } from 'lucide-react';

export default function UserHistoryPage() {
  const [history, setHistory] = useState<UserHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch user history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data, error } = await supabase
          .from('user_history')
          .select('*')
          .order('changed_at', { ascending: false });

        if (error) {
          console.error('Error fetching user history:', error);
          return;
        }

        setHistory(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('user_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_history',
        },
        (payload) => {
          console.log('User history change received!', payload);
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter history
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.user_id.includes(searchQuery) ||
        item.old_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.new_value.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || 
        item.change_type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [history, searchQuery, selectedType]);

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get icon for change type
  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'AVATAR':
        return <ImageIcon className="w-5 h-5 text-[#5865f2]" />;
      case 'USERNAME':
      case 'DISCRIMINATOR':
      case 'NICKNAME':
        return <User className="w-5 h-5 text-[#5865f2]" />;
      default:
        return <User className="w-5 h-5 text-[#5865f2]" />;
    }
  };

  // Get color for change type
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'AVATAR':
        return 'text-[#5865f2]';
      case 'USERNAME':
        return 'text-[#43b581]';
      case 'DISCRIMINATOR':
        return 'text-[#faa61a]';
      case 'NICKNAME':
        return 'text-[#f04747]';
      default:
        return 'text-[#b9bbbe]';
    }
  };

  // Get label for change type
  const getChangeLabel = (type: string) => {
    switch (type) {
      case 'AVATAR':
        return 'Avatar Gewijzigd';
      case 'USERNAME':
        return 'Gebruikersnaam Gewijzigd';
      case 'DISCRIMINATOR':
        return 'Discriminator Gewijzigd';
      case 'NICKNAME':
        return 'Nickname Gewijzigd';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#202225]">
        <Header />
        <div className="container mx-auto py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#b9bbbe]">Laden van gebruikershistorie...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202225]">
      <Header />

      <div className="container mx-auto py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-[#5865f2]" />
            <h1 className="text-4xl font-bold text-white">Gebruikershistorie</h1>
          </div>
          <p className="text-[#b9bbbe]">
            Track alle username, avatar, discriminator en nickname wijzigingen
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#292b2f] p-4 rounded-lg border border-[#202225]">
            <div className="text-2xl font-bold text-white mb-1">{history.length}</div>
            <div className="text-xs text-[#72767d]">Totaal Wijzigingen</div>
          </div>
          <div className="bg-[#292b2f] p-4 rounded-lg border border-[#202225]">
            <div className="text-2xl font-bold text-[#43b581] mb-1">
              {history.filter(h => h.change_type === 'USERNAME').length}
            </div>
            <div className="text-xs text-[#72767d]">Username</div>
          </div>
          <div className="bg-[#292b2f] p-4 rounded-lg border border-[#202225]">
            <div className="text-2xl font-bold text-[#5865f2] mb-1">
              {history.filter(h => h.change_type === 'AVATAR').length}
            </div>
            <div className="text-xs text-[#72767d]">Avatar</div>
          </div>
          <div className="bg-[#292b2f] p-4 rounded-lg border border-[#202225]">
            <div className="text-2xl font-bold text-[#f04747] mb-1">
              {history.filter(h => h.change_type === 'NICKNAME').length}
            </div>
            <div className="text-xs text-[#72767d]">Nickname</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#292b2f] p-6 rounded-lg mb-8 border border-[#202225]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                Zoeken
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#72767d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Zoek op user ID of naam..."
                  className="w-full pl-10 pr-4 py-2 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                Type Filter
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#72767d]" />
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">Alle Types</option>
                  <option value="USERNAME">Username</option>
                  <option value="AVATAR">Avatar</option>
                  <option value="DISCRIMINATOR">Discriminator</option>
                  <option value="NICKNAME">Nickname</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-[#72767d]">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'wijziging' : 'wijzigingen'} gevonden
          </div>
        </div>

        {/* History Timeline */}
        {paginatedHistory.length > 0 ? (
          <div className="space-y-4">
            {paginatedHistory.map((item) => (
              <div
                key={item.id}
                className="bg-[#292b2f] rounded-lg p-6 border border-[#202225] hover:border-[#2f3136] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-[#2f3136] rounded-full flex items-center justify-center flex-shrink-0">
                    {getChangeIcon(item.change_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`font-semibold ${getChangeColor(item.change_type)}`}>
                        {getChangeLabel(item.change_type)}
                      </span>
                      <span className="text-xs text-[#72767d]">•</span>
                      <span className="text-sm text-[#72767d]">
                        {formatDate(item.changed_at)}
                      </span>
                    </div>

                    {/* Changes */}
                    <div className="space-y-2">
                      {item.change_type === 'AVATAR' ? (
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-xs text-[#72767d] mb-1">Oud</div>
                            <img 
                              src={item.old_value || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                              alt="Old avatar" 
                              className="w-12 h-12 rounded-full"
                            />
                          </div>
                          <div className="text-[#72767d]">→</div>
                          <div>
                            <div className="text-xs text-[#72767d] mb-1">Nieuw</div>
                            <img 
                              src={item.new_value || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                              alt="New avatar" 
                              className="w-12 h-12 rounded-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-3 py-1 bg-[#2f3136] text-[#f04747] rounded">
                            {item.old_value || '(leeg)'}
                          </span>
                          <span className="text-[#72767d]">→</span>
                          <span className="px-3 py-1 bg-[#2f3136] text-[#43b581] rounded">
                            {item.new_value || '(leeg)'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User ID */}
                    <div className="mt-2 text-xs text-[#72767d]">
                      User ID: {item.user_id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <User className="w-16 h-16 text-[#72767d] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Geen Wijzigingen Gevonden
            </h3>
            <p className="text-[#b9bbbe]">
              {history.length === 0
                ? 'Er zijn nog geen gebruikerswijzigingen gelogd'
                : 'Probeer andere zoekfilters'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#292b2f] text-white rounded-lg border border-[#202225] hover:bg-[#2f3136] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Vorige
            </button>
            <span className="text-white px-4">
              Pagina {currentPage} van {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#292b2f] text-white rounded-lg border border-[#202225] hover:bg-[#2f3136] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Volgende
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

