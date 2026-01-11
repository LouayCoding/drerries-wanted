'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaUploader from '@/components/MediaUploader';
import { ArrowLeft, Save, Loader2, Plus, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AddWantedPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form state with defaults
  const [formData, setFormData] = useState({
    username: '',
    drerriesTag: '',
    discordId: '',
    avatar: '',
    status: 'ACTIVE' as 'ACTIVE' | 'CAPTURED' | 'CLEARED',
    severity: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    description: '',
    lastSeen: 'Onbekend',
    reward: '0 Server Credits',
    dateIssued: new Date().toISOString().split('T')[0],
    charges: [''],
    evidence: [''],
    aliases: [''],
    mediaUrls: [] as string[],
    mediaTypes: [] as ('image' | 'video')[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is verplicht';
    }

    if (!formData.drerriesTag.trim()) {
      newErrors.drerriesTag = 'Discord tag is verplicht';
    }

    const validCharges = formData.charges.filter(c => c.trim());
    if (validCharges.length === 0) {
      newErrors.charges = 'Minimaal 1 aanklacht is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Vul alle verplichte velden in');
      return;
    }

    setSaving(true);

    try {
      // Filter out empty values
      const cleanedCharges = formData.charges.filter(c => c.trim());
      const cleanedEvidence = formData.evidence.filter(e => e.trim());
      const cleanedAliases = formData.aliases.filter(a => a.trim());

      const newPersonData = {
        username: formData.username.trim(),
        drerries_tag: formData.drerriesTag.trim(),
        discord_id: formData.discordId.trim() || null,
        avatar: formData.avatar.trim(),
        status: formData.status,
        severity: formData.severity,
        description: formData.description.trim(),
        last_seen: formData.lastSeen.trim(),
        reward: formData.reward.trim(),
        date_issued: formData.dateIssued,
        charges: cleanedCharges,
        evidence: cleanedEvidence,
        aliases: cleanedAliases,
        media_urls: formData.mediaUrls,
        media_types: formData.mediaTypes,
      };

      const response = await fetch('/api/wanted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPersonData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Create failed');
      }

      toast.success('Persoon succesvol toegevoegd');
      router.push('/');
    } catch (error: any) {
      toast.error(`Fout bij opslaan: ${error.message}`);
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Dynamic field handlers
  const addField = (field: 'charges' | 'evidence' | 'aliases') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeField = (field: 'charges' | 'evidence' | 'aliases', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateField = (field: 'charges' | 'evidence' | 'aliases', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <div className="min-h-screen bg-[#202225]">

      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-[#2f3136] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#b9bbbe]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Nieuwe Wanted Person</h1>
              <p className="text-[#72767d]">Voeg een nieuwe persoon toe aan de database</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
          {/* Basic Info */}
          <div className="bg-[#292b2f] rounded-xl p-6 border border-[#202225]">
            <h2 className="text-xl font-bold text-white mb-6">Basis Informatie</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                  Username <span className="text-[#f04747]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border ${
                    errors.username ? 'border-[#f04747]' : 'border-[#202225]'
                  } focus:border-[#5865f2] focus:outline-none`}
                  placeholder="Gebruikersnaam"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-[#f04747] flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Discord Tag */}
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                  Discord Tag <span className="text-[#f04747]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.drerriesTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, drerriesTag: e.target.value }))}
                  className={`w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border ${
                    errors.drerriesTag ? 'border-[#f04747]' : 'border-[#202225]'
                  } focus:border-[#5865f2] focus:outline-none font-mono`}
                  placeholder="username#0000"
                />
                {errors.drerriesTag && (
                  <p className="mt-1 text-sm text-[#f04747] flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.drerriesTag}
                  </p>
                )}
              </div>

              {/* Discord ID (Optional) */}
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                  Discord ID (Optioneel)
                </label>
                <input
                  type="text"
                  value={formData.discordId}
                  onChange={(e) => setFormData(prev => ({ ...prev, discordId: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none font-mono"
                  placeholder="123456789012345678"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                  Avatar URL
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                    placeholder="https://cdn.discordapp.com/avatars/..."
                  />
                  {formData.avatar && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={formData.avatar}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="bg-[#292b2f] rounded-xl p-6 border border-[#202225]">
            <h2 className="text-xl font-bold text-white mb-6">Classificatie</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                  Status <span className="text-[#f04747]">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CAPTURED">CAPTURED</option>
                  <option value="CLEARED">CLEARED</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                  Dreiging <span className="text-[#f04747]">*</span>
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-[#292b2f] rounded-xl p-6 border border-[#202225]">
            <h2 className="text-xl font-bold text-white mb-6">Details</h2>
            
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                  Beschrijving
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none resize-none"
                  placeholder="Beschrijf de persoon en waarom ze gezocht worden..."
                />
                <div className="mt-1 text-xs text-[#72767d] text-right">
                  {formData.description.length} / 500
                </div>
              </div>

              {/* Last Seen, Reward, Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                    Laatst Gezien
                  </label>
                  <input
                    type="text"
                    value={formData.lastSeen}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastSeen: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                    placeholder="Locatie - Tijd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                    Beloning
                  </label>
                  <input
                    type="text"
                    value={formData.reward}
                    onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                    placeholder="1000 Server Credits"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#b9bbbe] mb-2">
                    Datum
                  </label>
                  <input
                    type="date"
                    value={formData.dateIssued}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateIssued: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Charges */}
          <div className="bg-[#292b2f] rounded-xl p-6 border border-[#202225]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Aanklachten <span className="text-[#f04747]">*</span>
                </h2>
                {errors.charges && (
                  <p className="mt-1 text-sm text-[#f04747]">{errors.charges}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => addField('charges')}
                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.charges.map((charge, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={charge}
                    onChange={(e) => updateField('charges', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                    placeholder={`Aanklacht ${index + 1}`}
                  />
                  {formData.charges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField('charges', index)}
                      className="p-3 bg-[#f04747] hover:bg-[#d84040] text-white rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-[#292b2f] rounded-xl p-6 border border-[#202225]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Bewijs (Optioneel)</h2>
              <button
                type="button"
                onClick={() => addField('evidence')}
                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.evidence.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateField('evidence', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none"
                    placeholder={`Bewijs item ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeField('evidence', index)}
                    className="p-3 bg-[#f04747] hover:bg-[#d84040] text-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Aliases */}
          <div className="bg-[#292b2f] rounded-xl p-6 border border-[#202225]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Aliassen (Optioneel)</h2>
              <button
                type="button"
                onClick={() => addField('aliases')}
                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.aliases.map((alias, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => updateField('aliases', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-[#40444b] text-white rounded-lg border border-[#202225] focus:border-[#5865f2] focus:outline-none font-mono"
                    placeholder={`Alias ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeField('aliases', index)}
                    className="p-3 bg-[#f04747] hover:bg-[#d84040] text-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-[#292b2f] rounded-xl p-6 border border-[#202225]">
            <h2 className="text-xl font-bold text-white mb-6">Media (Optioneel)</h2>
            <MediaUploader
              onUploadComplete={(urls, types) => {
                setFormData(prev => ({ ...prev, mediaUrls: urls, mediaTypes: types }));
              }}
              existingMedia={{ urls: formData.mediaUrls, types: formData.mediaTypes }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-8 py-4 bg-[#2f3136] hover:bg-[#40444b] text-white rounded-lg transition-colors font-medium text-center"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-[#5865f2] to-[#7289da] hover:shadow-lg hover:shadow-[#5865f2]/20 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Toevoegen...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Persoon Toevoegen</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

