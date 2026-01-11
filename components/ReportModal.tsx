'use client';

import { useState, useEffect } from 'react';
import { X, Search, Upload, Check, AlertCircle } from 'lucide-react';
import { GuildMember } from '@/types/wanted';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GuildMember[]>([]);
  const [selectedUser, setSelectedUser] = useState<GuildMember | null>(null);
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Search users
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search-users?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectUser = (user: GuildMember) => {
    setSelectedUser(user);
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedUser || !reason.trim()) {
      setError('Vul alle verplichte velden in');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Upload files first if any
      let mediaUrls: string[] = [];
      
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const uploadResponse = await fetch('/api/upload-media', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload media');
        }

        const uploadData = await uploadResponse.json();
        mediaUrls = uploadData.urls || [];
      }

      // Create report
      const reportResponse = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reported_user_id: selectedUser.id,
          reported_username: selectedUser.username,
          reported_tag: selectedUser.tag,
          reported_avatar: selectedUser.avatar,
          reporter_id: session?.user?.id || 'anonymous',
          reason: reason,
          media_urls: mediaUrls,
        }),
      });

      if (!reportResponse.ok) {
        throw new Error('Failed to create report');
      }

      setSuccess(true);
      toast.success('Melding succesvol verstuurd!');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Submit error:', error);
      setError('Er is iets misgegaan bij het versturen van de melding');
      toast.error('Fout bij versturen melding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
    setReason('');
    setFiles([]);
    setError('');
    setSuccess(false);
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#292b2f] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#202225]">
          <h2 className="text-2xl font-bold text-white">
            {success ? 'Melding Verstuurd!' : 'Gebruiker Melden'}
          </h2>
          <button
            onClick={handleClose}
            className="text-[#b9bbbe] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-[#43b581] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Melding Succesvol Verstuurd!</h3>
            <p className="text-[#b9bbbe]">Je melding is ontvangen en zal worden behandeld.</p>
          </div>
        )}

        {/* Step 1: Search User */}
        {!success && step === 1 && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                Zoek Gebruiker
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#72767d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek op username..."
                  className="w-full pl-10 pr-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isSearching && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              )}

              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="text-center py-8 text-[#72767d]">
                  Geen gebruikers gevonden
                </div>
              )}

              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-4 p-4 bg-[#2f3136] hover:bg-[#40444b] rounded-lg transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="text-left">
                    <div className="text-white font-medium">{user.username}</div>
                    <div className="text-sm text-[#72767d]">{user.tag}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Reason & Media */}
        {!success && step === 2 && (
          <div className="p-6 space-y-6">
            {/* Selected User */}
            <div className="flex items-center gap-4 p-4 bg-[#2f3136] rounded-lg">
              <img
                src={selectedUser?.avatar}
                alt={selectedUser?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="text-white font-medium">{selectedUser?.username}</div>
                <div className="text-sm text-[#72767d]">{selectedUser?.tag}</div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="ml-auto text-[#5865f2] hover:underline text-sm"
              >
                Wijzigen
              </button>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                Reden <span className="text-[#f04747]">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Beschrijf de reden voor deze melding..."
                rows={5}
                className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                Foto&apos;s / Video&apos;s (Optioneel)
              </label>
              <label className="flex items-center justify-center gap-2 p-6 bg-[#40444b] border-2 border-dashed border-[#202225] rounded-lg cursor-pointer hover:border-[#5865f2] transition-colors">
                <Upload className="w-5 h-5 text-[#72767d]" />
                <span className="text-[#b9bbbe]">Klik om bestanden te uploaden</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#2f3136] rounded-lg"
                    >
                      <span className="text-white text-sm truncate">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-[#f04747] hover:text-[#ff6b6b] ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-[#f04747]/10 border border-[#f04747] rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#f04747]" />
                <span className="text-[#f04747]">{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 bg-[#2f3136] text-white rounded-lg hover:bg-[#40444b] transition-colors"
                disabled={isSubmitting}
              >
                Terug
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !reason.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5865f2] to-[#7289da] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Versturen...' : 'Melding Versturen'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

