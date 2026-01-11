'use client';

import { Menu, AlertTriangle, Flag, Plus, X } from 'lucide-react';
import SearchAutocomplete from './SearchAutocomplete';
import ReportModal from './ReportModal';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
              
              {/* Admin Add Button - only for authenticated users */}
              {session && (
                <Link
                  href="/admin/add"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5865f2] to-[#7289da] text-white rounded-lg hover:shadow-lg hover:shadow-[#5865f2]/20 transition-all font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Toevoegen
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
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#b9bbbe] hover:text-white flex-shrink-0 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-[#2f3136] border-t border-[#202225] shadow-2xl">
              <nav className="container mx-auto py-4 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#b9bbbe] hover:bg-[#40444b] hover:text-white transition-colors rounded-lg font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/deleted-messages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#b9bbbe] hover:bg-[#40444b] hover:text-white transition-colors rounded-lg font-medium"
                >
                  Verwijderd
                </Link>
                <Link
                  href="/edited-messages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#b9bbbe] hover:bg-[#40444b] hover:text-white transition-colors rounded-lg font-medium"
                >
                  Aangepast
                </Link>
                <Link
                  href="/user-history"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#b9bbbe] hover:bg-[#40444b] hover:text-white transition-colors rounded-lg font-medium"
                >
                  Historie
                </Link>
                <Link
                  href="/voice-activity"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#b9bbbe] hover:bg-[#40444b] hover:text-white transition-colors rounded-lg font-medium"
                >
                  Voice
                </Link>
                
                {/* Dashboard - alleen voor admins */}
                {session && (
                  <Link
                    href="/reports"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-[#b9bbbe] hover:bg-[#40444b] hover:text-white transition-colors rounded-lg font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                
                {/* Divider */}
                <div className="h-px bg-[#202225] my-2"></div>
                
                {/* Admin Add - alleen voor admins */}
                {session && (
                  <Link
                    href="/admin/add"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5865f2] to-[#7289da] text-white rounded-lg font-medium mx-2"
                  >
                    <Plus className="w-4 h-4" />
                    Toevoegen
                  </Link>
                )}
                
                {/* Melden button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsReportModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#f04747] to-[#ff6b6b] text-white rounded-lg font-medium mx-2"
                >
                  <Flag className="w-4 h-4" />
                  Melden
                </button>
                
                {/* User info / Login */}
                <div className="px-4 py-3">
                  {status === 'loading' ? (
                    <div className="h-8 bg-[#40444b] rounded-lg animate-pulse"></div>
                  ) : session ? (
                    <div className="flex items-center gap-3 p-3 bg-[#40444b] rounded-lg">
                      {session.user?.image && (
                        <img 
                          src={session.user.image} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {session.user?.name}
                        </div>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            window.location.href = '/api/auth/signout';
                          }}
                          className="text-xs text-[#f04747] hover:underline"
                        >
                          Uitloggen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = '/api/auth/signin';
                      }}
                      className="w-full px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg transition-colors font-medium"
                    >
                      Admin Login
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
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
