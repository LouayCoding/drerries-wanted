'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { ReportWithDetails } from '@/types/wanted';
import { Flag, Search, Filter, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const reportsPerPage = 12;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Fetch reports
  useEffect(() => {
    async function fetchReports() {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reports:', error);
          toast.error('Fout bij ophalen reports');
          return;
        }

        setReports(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Fout bij ophalen reports');
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchReports();

      // Subscribe to real-time changes
      const channel = supabase
        .channel('reports_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reports',
          },
          (payload) => {
            console.log('Report change received!', payload);
            fetchReports();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = searchQuery === '' || 
        report.reported_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reported_tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || 
        report.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    return filteredReports.slice(startIndex, startIndex + reportsPerPage);
  }, [filteredReports, currentPage]);

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

  // Update report status
  const updateStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: newStatus,
          reviewed_by: session?.user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      toast.success(`Status gewijzigd naar ${newStatus}`);
      
      // Refresh reports
      const { data } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false});

      setReports(data || []);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Fout bij updaten status');
    }
  };

  // Open lightbox with media
  const openLightbox = (mediaUrls: string[], startIndex: number = 0) => {
    setLightboxImages(mediaUrls.map(url => ({ src: url })));
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-[#faa61a]/20 text-[#faa61a]';
      case 'REVIEWED':
        return 'bg-[#5865f2]/20 text-[#5865f2]';
      case 'DISMISSED':
        return 'bg-[#72767d]/20 text-[#72767d]';
      default:
        return 'bg-[#b9bbbe]/20 text-[#b9bbbe]';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#202225]">
        <Header />
        <div className="container mx-auto py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#b9bbbe]">Laden van reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#202225]">
      <Header />

      <div className="container mx-auto py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flag className="w-8 h-8 text-[#faa61a]" />
            <h1 className="text-4xl font-bold text-white">Reports Dashboard</h1>
          </div>
          <p className="text-[#b9bbbe]">
            Bekijk en beheer alle gebruikersmeldingen
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#292b2f] p-6 rounded-lg border border-[#202225]">
            <div className="text-3xl font-bold text-white mb-1">{reports.length}</div>
            <div className="text-sm text-[#72767d]">Totaal</div>
          </div>
          <div className="bg-[#292b2f] p-6 rounded-lg border border-[#202225]">
            <div className="text-3xl font-bold text-[#faa61a] mb-1">
              {reports.filter(r => r.status === 'PENDING').length}
            </div>
            <div className="text-sm text-[#72767d]">Pending</div>
          </div>
          <div className="bg-[#292b2f] p-6 rounded-lg border border-[#202225]">
            <div className="text-3xl font-bold text-[#5865f2] mb-1">
              {reports.filter(r => r.status === 'REVIEWED').length}
            </div>
            <div className="text-sm text-[#72767d]">Reviewed</div>
          </div>
          <div className="bg-[#292b2f] p-6 rounded-lg border border-[#202225]">
            <div className="text-3xl font-bold text-[#72767d] mb-1">
              {reports.filter(r => r.status === 'DISMISSED').length}
            </div>
            <div className="text-sm text-[#72767d]">Dismissed</div>
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
                  placeholder="Zoek op gebruiker of reden..."
                  className="w-full pl-10 pr-4 py-2 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                Status Filter
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#72767d]" />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">Alle Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-[#72767d]">
            {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} gevonden
          </div>
        </div>

        {/* Reports Grid */}
        {paginatedReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedReports.map((report) => (
              <div
                key={report.id}
                className="bg-[#292b2f] rounded-lg border border-[#202225] overflow-hidden hover:border-[#2f3136] transition-colors"
              >
                {/* Card Header */}
                <div className="p-6">
                  {/* Reported User */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={report.reported_avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                      alt={report.reported_username}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">
                        {report.reported_username}
                      </div>
                      <div className="text-sm text-[#72767d] truncate">
                        {report.reported_tag}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  {/* Reason Preview */}
                  <p className="text-sm text-[#b9bbbe] line-clamp-3 mb-4">
                    {report.reason}
                  </p>

                  {/* Media Count */}
                  {report.media_urls && report.media_urls.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-[#5865f2] mb-4">
                      <FileText className="w-4 h-4" />
                      <span>{report.media_urls.length} media bestand(en)</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="text-xs text-[#72767d] mb-4">
                    {formatDate(report.created_at)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                      className="flex-1 px-3 py-2 bg-[#2f3136] text-white rounded hover:bg-[#36393e] transition-colors text-sm"
                    >
                      {expandedId === report.id ? (
                        <>
                          <ChevronUp className="w-4 h-4 inline mr-1" />
                          Verberg
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 inline mr-1" />
                          Details
                        </>
                      )}
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report.id, e.target.value)}
                      className="px-3 py-2 bg-[#2f3136] text-white rounded hover:bg-[#36393e] transition-colors text-sm cursor-pointer border-none outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="DISMISSED">Dismissed</option>
                    </select>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === report.id && (
                  <div className="px-6 pb-6 border-t border-[#202225] pt-4">
                    {/* Full Reason */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-white mb-2">Volledige Reden:</h4>
                      <p className="text-sm text-[#b9bbbe] whitespace-pre-wrap">
                        {report.reason}
                      </p>
                    </div>

                    {/* Media (will be integrated with lightbox next) */}
                    {report.media_urls && report.media_urls.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-white mb-2">Media:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {report.media_urls.map((url, index) => (
                            <button
                              key={index}
                              onClick={() => openLightbox(report.media_urls, index)}
                              className="block group relative overflow-hidden rounded"
                            >
                              <img
                                src={url}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-32 object-cover group-hover:opacity-80 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                  Klik om te vergroten
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Review Info */}
                    {report.reviewed_by && (
                      <div className="text-xs text-[#72767d]">
                        Reviewed door: {report.reviewed_by} op {formatDate(report.reviewed_at!)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Flag className="w-16 h-16 text-[#72767d] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Geen Reports Gevonden
            </h3>
            <p className="text-[#b9bbbe]">
              {reports.length === 0
                ? 'Er zijn nog geen reports ingediend'
                : 'Probeer andere zoekfilters'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
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

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxImages}
        index={lightboxIndex}
        plugins={[Zoom, Thumbnails]}
        carousel={{ finite: true }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />
    </div>
  );
}

