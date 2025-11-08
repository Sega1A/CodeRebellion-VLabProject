'use client';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from './Toast/providers/ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}