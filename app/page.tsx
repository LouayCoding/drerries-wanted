'use client';

import { useState, useMemo, useEffect } from 'react';
import WantedCard from '@/components/WantedCard';
import AdminControls from '@/components/AdminControls';
import { supabase } from '@/lib/supabase';
import { WantedPerson } from '@/types/wanted';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [wantedPersons, setWantedPersons] = useState<WantedPerson[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchWantedPersons() {
      try {
        const { data, error } = await supabase
          .from('wanted_persons')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching wanted persons:', error);
          return;
        }

        // Transform Supabase data to match our WantedPerson type
        const transformedData: WantedPerson[] = (data || []).map((person: any) => ({
          id: person.id,
          drerriesTag: person.drerries_tag,
          username: person.username,
          avatar: person.avatar,
          status: person.status,
          severity: person.severity,
          charges: person.charges || [],
          description: person.description,
          lastSeen: person.last_seen,
          reward: person.reward,
          dateIssued: person.date_issued,
          evidence: person.evidence || [],
          aliases: person.aliases || [],
          mediaUrls: person.media_urls || [],
          mediaTypes: person.media_types || [],
        }));

        setWantedPersons(transformedData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWantedPersons();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('wanted_persons_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wanted_persons',
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchWantedPersons();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: wantedPersons.length,
      active: wantedPersons.filter((p) => p.status === 'ACTIVE').length,
      captured: wantedPersons.filter((p) => p.status === 'CAPTURED').length,
      critical: wantedPersons.filter((p) => p.severity === 'CRITICAL').length,
    };
  }, [wantedPersons]);

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#b9bbbe]">Laden van wanted persons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202225]">

      {/* Stats Section */}
      <section className="container mx-auto py-8">
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-[#72767d]">Totaal</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#f04747]">{stats.active}</div>
            <div className="text-sm text-[#72767d]">Actief</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#43b581]">{stats.captured}</div>
            <div className="text-sm text-[#72767d]">Gevangen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#f04747]">{stats.critical}</div>
            <div className="text-sm text-[#72767d]">Kritiek</div>
          </div>
        </div>

        {/* Wanted Cards Grid */}
        {wantedPersons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {wantedPersons.map((person) => (
              <WantedCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-[#72767d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Geen Wanted Persons Gevonden</h3>
            <p className="text-[#b9bbbe]">Gebruik !addwanted in Discord om personen toe te voegen</p>
          </div>
        )}
      </section>

      {/* Floating Action Button - Admin Only */}
      <AdminControls>
        <Link
          href="/admin/add"
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#5865f2] to-[#7289da] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-40"
          title="Nieuwe Persoon Toevoegen"
        >
          <Plus className="w-8 h-8 text-white" />
        </Link>
      </AdminControls>

      {/* Footer */}
      <footer className="mt-24 py-12">
        <div className="container mx-auto">
          <div className="text-center space-y-2">
            <p className="text-[#b9bbbe]">
              © 2025 Drerries Wanted Database. Alle rechten voorbehouden.
            </p>
            <p className="text-sm text-[#72767d]">
              Dit is een roleplay database voor entertainment doeleinden.
            </p>
            <p className="text-xs text-[#43b581]">
              Real-time sync met Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
