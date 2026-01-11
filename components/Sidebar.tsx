'use client';

import { Home, Trash2, Edit3, History, Mic, LayoutDashboard, Flag, Plus, AlertTriangle, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import UserMenu from './UserMenu';
import ReportModal from './ReportModal';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/deleted-messages', label: 'Verwijderd', icon: Trash2 },
    { href: '/edited-messages', label: 'Aangepast', icon: Edit3 },
    { href: '/user-history', label: 'Historie', icon: History },
    { href: '/voice-activity', label: 'Voice', icon: Mic },
  ];

  const adminItems = [
    { href: '/reports', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/add', label: 'Toevoegen', icon: Plus },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#292b2f] border-b border-[#202225]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5865f2] to-[#7289da] rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Drerries Wanted</h1>
              <p className="text-xs text-[#72767d]">Roleplay Database</p>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#b9bbbe] hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#2f3136] border-r border-[#202225] z-50
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Desktop Only */}
          <div className="hidden lg:block p-4 border-b border-[#202225]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5865f2] to-[#7289da] rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Drerries Wanted</h1>
                <p className="text-xs text-[#72767d]">Roleplay Database</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* Main Menu Items */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium
                      ${active
                        ? 'bg-[#5865f2] text-white shadow-lg shadow-[#5865f2]/20'
                        : 'text-[#b9bbbe] hover:bg-[#40444b] hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Admin Section */}
            {session && (
              <>
                <div className="h-px bg-[#202225] my-3"></div>
                <div className="px-2 py-1 text-xs font-semibold text-[#72767d] uppercase tracking-wider">
                  Admin
                </div>
                <div className="space-y-1">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium
                          ${active
                            ? 'bg-[#5865f2] text-white shadow-lg shadow-[#5865f2]/20'
                            : 'text-[#b9bbbe] hover:bg-[#40444b] hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {/* Report Button */}
            <div className="h-px bg-[#202225] my-3"></div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsReportModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-[#f04747] to-[#ff6b6b] text-white rounded-lg hover:shadow-lg hover:shadow-[#f04747]/20 transition-all font-medium"
            >
              <Flag className="w-5 h-5 flex-shrink-0" />
              <span>Melden</span>
            </button>
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-[#202225]">
            {status === 'loading' ? (
              <div className="h-14 bg-[#40444b] rounded-lg animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3 p-2 bg-[#202225] rounded-lg">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate text-sm">
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
                className="w-full px-4 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg transition-colors font-medium"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
}

