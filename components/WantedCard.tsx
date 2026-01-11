'use client';

import { useState } from 'react';
import { WantedPerson } from '@/types/wanted';
import Link from 'next/link';
import Image from 'next/image';
import AdminControls from './AdminControls';
import CardDropdownMenu from './CardDropdownMenu';
import DeleteConfirmModal from './DeleteConfirmModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface WantedCardProps {
  person: WantedPerson;
}

export default function WantedCard({ person }: WantedCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const statusColors = {
    ACTIVE: 'bg-[#f04747]/20 text-[#f04747]',
    CAPTURED: 'bg-[#43b581]/20 text-[#43b581]',
    INACTIVE: 'bg-[#72767d]/20 text-[#72767d]',
  };

  const severityColors = {
    LOW: '#5865f2',
    MEDIUM: '#faa61a',
    HIGH: '#f97316',
    CRITICAL: '#f04747',
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/wanted?id=${person.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  return (
    <>
      <Link href={`/wanted/${person.id}`}>
        <article className="group cursor-pointer relative">
          {/* Admin Controls - Top Right */}
          <AdminControls>
            <div className="absolute top-2 right-2 z-10">
              <CardDropdownMenu
                personId={person.id}
                personName={person.username}
                onDelete={() => setShowDeleteModal(true)}
              />
            </div>
          </AdminControls>

          {/* Avatar */}
          <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
            <Image
              src={person.avatar}
              alt={person.username}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
            
            {/* Status Badge - Top Left */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${statusColors[person.status as keyof typeof statusColors]}`}>
                {person.status}
              </span>
            </div>
            
            {/* Severity Indicator - Bottom Bar */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: severityColors[person.severity as keyof typeof severityColors] }}
            />
          </div>

          {/* Info */}
          <div className="space-y-1">
            {/* Username */}
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-[#5865f2] transition-colors truncate">
              {person.username}
            </h3>
            
            {/* Tag */}
            <p className="text-xs text-[#72767d] font-mono truncate">
              {person.drerriesTag}
            </p>
            
            {/* Description Preview - Hidden on mobile */}
            {person.description && (
              <p className="hidden sm:block text-xs text-[#b9bbbe] line-clamp-2">
                {person.description}
              </p>
            )}
            
            {/* View Details CTA */}
            <div className="pt-1">
              <span className="text-xs text-[#5865f2] group-hover:underline">
                Details →
              </span>
            </div>
          </div>
        </article>
      </Link>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        person={person}
        onConfirm={handleDelete}
      />
    </>
  );
}
