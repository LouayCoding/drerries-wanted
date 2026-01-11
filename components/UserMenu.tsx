'use client';

import { signOut, useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#2f3136] hover:bg-[#36393e] rounded-lg transition-colors"
      >
        <img
          src={session.user.image || 'https://cdn.discordapp.com/embed/avatars/0.png'}
          alt={session.user.name || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden md:block text-white font-medium">
          {session.user.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#b9bbbe] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#2f3136] rounded-lg shadow-xl border border-[#202225] overflow-hidden z-50">
          <div className="p-4 border-b border-[#202225]">
            <div className="flex items-center gap-3">
              <img
                src={session.user.image || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                alt={session.user.name || 'User'}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">
                  {session.user.name}
                </div>
                <div className="text-xs text-[#72767d] truncate">
                  ID: {session.user.id}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-3 py-2 text-[#f04747] hover:bg-[#36393e] rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Uitloggen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

