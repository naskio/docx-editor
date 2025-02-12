import React from 'react';
import { GlobalStoreProvider } from '@/lib/store-provider';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='h-screen'>
      <GlobalStoreProvider>{children}</GlobalStoreProvider>
    </section>
  );
}
