'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Toegang Geweigerd',
          message: 'Je account staat niet op de whitelist. Neem contact op met een admin voor toegang.',
          icon: <XCircle className="w-16 h-16 text-[#f04747]" />,
        };
      case 'Configuration':
        return {
          title: 'Configuratiefout',
          message: 'Er is een probleem met de Discord OAuth configuratie. Neem contact op met support.',
          icon: <AlertCircle className="w-16 h-16 text-[#faa61a]" />,
        };
      default:
        return {
          title: 'Authenticatiefout',
          message: 'Er is iets misgegaan tijdens het inloggen. Probeer het opnieuw.',
          icon: <AlertCircle className="w-16 h-16 text-[#f04747]" />,
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen bg-[#202225] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#292b2f] rounded-2xl p-8 shadow-2xl border border-[#202225] text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">{errorInfo.icon}</div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-3">{errorInfo.title}</h1>
          
          {/* Message */}
          <p className="text-[#b9bbbe] mb-8">{errorInfo.message}</p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg transition-colors font-medium"
            >
              Terug naar Home
            </Link>
            <Link
              href="/login"
              className="block w-full px-6 py-3 bg-[#2f3136] hover:bg-[#40444b] text-white rounded-lg transition-colors"
            >
              Probeer Opnieuw
            </Link>
          </div>

          {/* Additional info for access denied */}
          {error === 'AccessDenied' && (
            <div className="mt-6 p-4 bg-[#f04747]/10 rounded-lg border border-[#f04747]">
              <p className="text-sm text-[#f04747]">
                Niet op de whitelist? Stuur je Discord ID naar een administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

