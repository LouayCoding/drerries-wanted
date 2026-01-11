'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, DollarSign, MapPin, Bell } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { WantedPerson } from '@/types/wanted';

export default function WantedDetailPage({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<WantedPerson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerson() {
      try {
        const { data, error } = await supabase
          .from('wanted_persons')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error || !data) {
          console.error('Error fetching person:', error);
          setPerson(null);
          return;
        }

        const transformedPerson: WantedPerson = {
          id: data.id,
          drerriesTag: data.drerries_tag,
          username: data.username,
          avatar: data.avatar,
          status: data.status,
          severity: data.severity,
          charges: data.charges || [],
          description: data.description,
          lastSeen: data.last_seen,
          reward: data.reward,
          dateIssued: data.date_issued,
          evidence: data.evidence || [],
          aliases: data.aliases || [],
        };

        setPerson(transformedPerson);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPerson();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#202225]">
        <Header />
        <div className="container mx-auto py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#b9bbbe]">Laden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-[#202225]">
        <Header />
        <div className="container mx-auto py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Persoon niet gevonden</h2>
            <Link href="/" className="text-[#5865f2] hover:underline text-lg">
              Terug naar database
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    ACTIVE: { bg: 'bg-[#f04747]/20', text: 'text-[#f04747]' },
    CAPTURED: { bg: 'bg-[#43b581]/20', text: 'text-[#43b581]' },
    INACTIVE: { bg: 'bg-[#72767d]/20', text: 'text-[#72767d]' },
  };

  const severityColors = {
    LOW: { color: '#5865f2', label: 'LAAG' },
    MEDIUM: { color: '#faa61a', label: 'GEMIDDELD' },
    HIGH: { color: '#f04747', label: 'HOOG' },
    CRITICAL: { color: '#f04747', label: 'KRITIEK' },
  };

  const currentStatus = statusColors[person.status as keyof typeof statusColors];
  const currentSeverity = severityColors[person.severity as keyof typeof severityColors];

  return (
    <div className="min-h-screen bg-[#202225]">
      <Header />

      <div className="container mx-auto py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#b9bbbe] hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Terug naar Database
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative w-full md:w-64 aspect-square rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={person.avatar}
                alt={person.username}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{ backgroundColor: currentSeverity.color }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              {/* Name & Status */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {person.username}
                  </h1>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${currentStatus.bg} ${currentStatus.text}`}>
                    {person.status}
                  </span>
                </div>
                <p className="text-xl text-[#72767d] font-mono">{person.drerriesTag}</p>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-[#72767d] mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Dreiging
                  </div>
                  <div className="text-2xl font-bold" style={{ color: currentSeverity.color }}>
                    {currentSeverity.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#72767d] mb-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Beloning
                  </div>
                  <div className="text-2xl font-bold text-[#43b581]">
                    {person.reward}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#72767d] mb-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Laatst Gezien
                  </div>
                  <div className="text-lg text-white">
                    {person.lastSeen}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="px-8 py-4 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold rounded-xl transition-colors text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Meld Waarneming
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Beschrijving</h2>
          <p className="text-lg text-[#b9bbbe] leading-relaxed">
            {person.description}
          </p>
        </section>

        {/* Charges */}
        {person.charges && person.charges.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Aanklachten</h2>
            <div className="space-y-3">
              {person.charges.map((charge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#f04747]/10"
                >
                  <div className="w-2 h-2 bg-[#f04747] rounded-full flex-shrink-0"></div>
                  <span className="text-lg text-white">{charge}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Aliases */}
        {person.aliases && person.aliases.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Bekende Aliassen</h2>
            <div className="flex flex-wrap gap-3">
              {person.aliases.map((alias, index) => (
                <span
                  key={index}
                  className="px-6 py-3 rounded-xl bg-[#5865f2]/10 text-[#5865f2] font-mono text-lg"
                >
                  {alias}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Evidence */}
        {person.evidence && person.evidence.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Bewijs</h2>
            <div className="space-y-3">
              {person.evidence.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4">
                  <CheckCircle2 className="w-6 h-6 text-[#43b581] mt-1 flex-shrink-0" />
                  <span className="text-lg text-[#b9bbbe]">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Warning */}
        <section className="p-8 rounded-2xl bg-[#f04747]/10">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-[#f04747]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#f04747]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f04747] mb-2">
                Community Waarschuwing
              </h3>
              <p className="text-[#b9bbbe] leading-relaxed">
                Als je deze persoon tegenkomt, ga dan niet direct in gesprek. Meld hun aanwezigheid
                onmiddellijk aan de server moderators. Deel geen persoonlijke informatie en klik
                niet op links die zij verstrekken.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
