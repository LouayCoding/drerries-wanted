'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#202225]">
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#5865f2] to-[#7289da] rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Welkom bij Drerries Database
            </h1>
            <p className="text-xl text-[#b9bbbe] max-w-2xl mx-auto">
              Gebruik het menu aan de linkerkant om door de verschillende secties te navigeren
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 max-w-2xl mx-auto">
            <a
              href="/deleted-messages"
              className="p-6 bg-[#2f3136] hover:bg-[#40444b] rounded-xl transition-colors border border-[#202225] group"
            >
              <div className="text-3xl mb-3">🗑️</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#5865f2] transition-colors">
                Verwijderde Berichten
              </h3>
              <p className="text-sm text-[#b9bbbe]">
                Bekijk alle verwijderde berichten
              </p>
            </a>

            <a
              href="/edited-messages"
              className="p-6 bg-[#2f3136] hover:bg-[#40444b] rounded-xl transition-colors border border-[#202225] group"
            >
              <div className="text-3xl mb-3">✏️</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#5865f2] transition-colors">
                Aangepaste Berichten
              </h3>
              <p className="text-sm text-[#b9bbbe]">
                Bekijk alle aangepaste berichten
              </p>
            </a>

            <a
              href="/user-history"
              className="p-6 bg-[#2f3136] hover:bg-[#40444b] rounded-xl transition-colors border border-[#202225] group"
            >
              <div className="text-3xl mb-3">📜</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#5865f2] transition-colors">
                Gebruikersgeschiedenis
              </h3>
              <p className="text-sm text-[#b9bbbe]">
                Bekijk username en avatar wijzigingen
              </p>
            </a>

            <a
              href="/voice-activity"
              className="p-6 bg-[#2f3136] hover:bg-[#40444b] rounded-xl transition-colors border border-[#202225] group"
            >
              <div className="text-3xl mb-3">🎤</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#5865f2] transition-colors">
                Voice Activiteit
              </h3>
              <p className="text-sm text-[#b9bbbe]">
                Bekijk voice channel activiteit
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
