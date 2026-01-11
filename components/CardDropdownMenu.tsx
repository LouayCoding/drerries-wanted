'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CardDropdownMenuProps {
  personId: string;
  personName: string;
  onDelete: () => void;
}

export default function CardDropdownMenu({ personId, personName, onDelete }: CardDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  return (
    <div ref={dropdownRef} className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="p-1.5 rounded-lg bg-[#2f3136]/80 hover:bg-[#2f3136] text-[#b9bbbe] hover:text-white transition-colors backdrop-blur-sm"
        aria-label="Options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-[#2f3136] rounded-lg shadow-2xl border border-[#202225] overflow-hidden z-50">
          <Link
            href={`/admin/edit/${personId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#5865f2] transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Bewerken</span>
          </Link>
          
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#f04747] hover:bg-[#f04747]/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Verwijderen</span>
          </button>
        </div>
      )}
    </div>
  );
}



