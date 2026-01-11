'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface AdminControlsProps {
  children: ReactNode;
}

export default function AdminControls({ children }: AdminControlsProps) {
  const { data: session, status } = useSession();
  
  // Don't render anything while loading or if not authenticated
  if (status === 'loading' || !session) {
    return null;
  }
  
  return <>{children}</>;
}



