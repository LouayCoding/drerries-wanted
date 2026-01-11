'use client';

import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { WantedPerson } from '@/types/wanted';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: WantedPerson;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({ isOpen, onClose, person, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success('Persoon succesvol verwijderd', { duration: 3000 });
      onClose();
    } catch (error) {
      toast.error('Fout bij verwijderen', { duration: 5000 });
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#292b2f] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-[#202225]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#202225]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f04747]/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-[#f04747]" />
            </div>
            <h2 className="text-xl font-bold text-white">Persoon Verwijderen</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-[#b9bbbe] hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Person Preview */}
          <div className="flex items-center gap-4 p-4 bg-[#2f3136] rounded-lg">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={person.avatar}
                alt={person.username}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{person.username}</h3>
              <p className="text-sm text-[#72767d] font-mono truncate">{person.drerriesTag}</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="p-4 bg-[#f04747]/10 border border-[#f04747] rounded-lg">
            <p className="text-sm text-[#f04747] leading-relaxed">
              <strong>Let op:</strong> Deze actie kan niet ongedaan worden gemaakt. 
              Alle informatie over deze persoon, inclusief uploads, zal permanent worden verwijderd.
            </p>
          </div>

          {/* Person Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-[#2f3136] rounded-lg">
              <div className="text-2xl font-bold text-white">{person.charges.length}</div>
              <div className="text-xs text-[#72767d]">Aanklachten</div>
            </div>
            <div className="p-3 bg-[#2f3136] rounded-lg">
              <div className="text-2xl font-bold text-white">
                {(person.mediaUrls?.length || 0) + (person.evidence?.length || 0)}
              </div>
              <div className="text-xs text-[#72767d]">Bewijs Items</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[#202225]">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-[#2f3136] text-white rounded-lg hover:bg-[#40444b] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuleren
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#f04747] to-[#ff6b6b] text-white rounded-lg hover:shadow-lg hover:shadow-[#f04747]/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verwijderen...</span>
              </>
            ) : (
              <span>Verwijderen</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



