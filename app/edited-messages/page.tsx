'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import DiffViewer from '@/components/DiffViewer';
import { supabase } from '@/lib/supabase';
import { EditedMessage } from '@/types/wanted';
import { Edit3, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function EditedMessagesPage() {
  const [messages, setMessages] = useState<EditedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 15;

  // Fetch edited messages
  useEffect(() => {
    async function fetchEditedMessages() {
      try {
        const { data, error } = await supabase
          .from('edited_messages')
          .select('*')
          .order('edited_at', { ascending: false });

        if (error) {
          console.error('Error fetching edited messages:', error);
          return;
        }

        setMessages(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEditedMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('edited_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'edited_messages',
        },
        (payload) => {
          console.log('Edited message change received!', payload);
          fetchEditedMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get unique channels
  const channels = useMemo(() => {
    const channelSet = new Set(messages.map(m => m.channel_name));
    return Array.from(channelSet).sort();
  }, [messages]);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const matchesSearch = searchQuery === '' || 
        message.author_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.old_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.new_content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChannel = selectedChannel === 'all' || 
        message.channel_name === selectedChannel;

      return matchesSearch && matchesChannel;
    });
  }, [messages, searchQuery, selectedChannel]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * messagesPerPage;
    return filteredMessages.slice(startIndex, startIndex + messagesPerPage);
  }, [filteredMessages, currentPage]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#202225]">
        <Header />
        <div className="container mx-auto py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#b9bbbe]">Laden van aangepaste berichten...</p>
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
            <Edit3 className="w-8 h-8 text-[#5865f2]" />
            <h1 className="text-4xl font-bold text-white">Aangepaste Berichten</h1>
          </div>
          <p className="text-[#b9bbbe]">
            Alle aangepaste berichten in de server worden hier gelogd
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#292b2f] p-6 rounded-lg border border-[#202225]">
            <div className="text-3xl font-bold text-white mb-1">{messages.length}</div>
            <div className="text-sm text-[#72767d]">Totaal Aangepast</div>
          </div>
          <div className="bg-[#292b2f] p-6 rounded-lg border border-[#202225]">
            <div className="text-3xl font-bold text-white mb-1">{channels.length}</div>
            <div className="text-sm text-[#72767d]">Kanalen</div>
          </div>
          <div className="bg-[#292b2f] p-6 rounded-lg border border-[#202225]">
            <div className="text-3xl font-bold text-white mb-1">
              {new Set(messages.map(m => m.author_id)).size}
            </div>
            <div className="text-sm text-[#72767d]">Unieke Gebruikers</div>
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
                  placeholder="Zoek op gebruiker of inhoud..."
                  className="w-full pl-10 pr-4 py-2 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                />
              </div>
            </div>

            {/* Channel Filter */}
            <div>
              <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                Kanaal Filter
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#72767d]" />
                <select
                  value={selectedChannel}
                  onChange={(e) => {
                    setSelectedChannel(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">Alle Kanalen</option>
                  {channels.map(channel => (
                    <option key={channel} value={channel}>
                      #{channel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-[#72767d]">
            {filteredMessages.length} {filteredMessages.length === 1 ? 'bericht' : 'berichten'} gevonden
          </div>
        </div>

        {/* Messages List */}
        {paginatedMessages.length > 0 ? (
          <div className="space-y-4">
            {paginatedMessages.map((message) => (
              <div
                key={message.id}
                className="bg-[#292b2f] rounded-lg border border-[#202225] overflow-hidden"
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={message.author_avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                      alt={message.author_username}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-semibold text-white">
                          {message.author_username}
                        </span>
                        <span className="text-sm text-[#72767d]">
                          {message.author_tag}
                        </span>
                        <span className="text-xs text-[#72767d]">•</span>
                        <span className="text-sm text-[#72767d]">
                          #{message.channel_name}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="text-xs text-[#72767d] mb-4">
                        Aangepast: {formatDate(message.edited_at)}
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                        className="flex items-center gap-2 text-sm text-[#5865f2] hover:underline"
                      >
                        {expandedId === message.id ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Verberg diff
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Bekijk wijzigingen
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Diff Content */}
                {expandedId === message.id && (
                  <div className="px-6 pb-6">
                    <DiffViewer 
                      oldText={message.old_content} 
                      newText={message.new_content} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Edit3 className="w-16 h-16 text-[#72767d] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Geen Berichten Gevonden
            </h3>
            <p className="text-[#b9bbbe]">
              {messages.length === 0
                ? 'Er zijn nog geen aangepaste berichten gelogd'
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



