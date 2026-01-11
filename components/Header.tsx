'use client';

import { Menu, AlertTriangle, Flag } from 'lucide-react';
import SearchAutocomplete from './SearchAutocomplete';
import ReportModal from './ReportModal';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#292b2f] border-b border-[#202225]">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-6 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5865f2] to-[#7289da] rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">
                  Drerries Wanted
                </h1>
                <p className="text-xs text-[#72767d]">Roleplay Database</p>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-2xl">
              <SearchAutocomplete />
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <Link
                href="/"
                className="text-[#b9bbbe] hover:text-white transition-colors font-medium text-sm"
              >
                Home
              </Link>
              <Link
                href="/deleted-messages"
                className="text-[#b9bbbe] hover:text-white transition-colors font-medium text-sm"
              >
                Verwijderd
              </Link>
              <Link
                href="/edited-messages"
                className="text-[#b9bbbe] hover:text-white transition-colors font-medium text-sm"
              >
                Aangepast
              </Link>
              <Link
                href="/user-history"
                className="text-[#b9bbbe] hover:text-white transition-colors font-medium text-sm"
              >
                Historie
              </Link>
              <Link
                href="/voice-activity"
                className="text-[#b9bbbe] hover:text-white transition-colors font-medium text-sm"
              >
                Voice
              </Link>
              
              {/* Dashboard link - alleen voor ingelogde admins */}
              {session && (
                <Link
                  href="/reports"
                  className="text-[#b9bbbe] hover:text-white transition-colors font-medium text-sm"
                >
                  Dashboard
                </Link>
              )}
              
              {/* Melden button - altijd tonen */}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f04747] to-[#ff6b6b] text-white rounded-lg hover:shadow-lg hover:shadow-[#f04747]/20 transition-all font-medium text-sm"
              >
                <Flag className="w-4 h-4" />
                Melden
              </button>
              
              {/* User menu of Admin Login - alleen voor admins */}
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full bg-[#2f3136] animate-pulse"></div>
              ) : session ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => window.location.href = '/api/auth/signin'}
                  className="text-xs text-[#72767d] hover:text-[#b9bbbe] transition-colors"
                  title="Admin Login"
                >
                  Admin
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-[#b9bbbe] hover:text-white flex-shrink-0">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </>
  );
}
