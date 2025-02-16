import React from 'react';
import { DocumentsStoreProvider } from '@/store/documents-store-provider';
import { OutputStoreProvider } from '@/store/output-store-provider';
import { SettingsStoreProvider } from '@/store/settings-store-provider';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='h-screen'>
      <SettingsStoreProvider>
        <OutputStoreProvider>
          <DocumentsStoreProvider>{children}</DocumentsStoreProvider>
        </OutputStoreProvider>
      </SettingsStoreProvider>
    </section>
  );
}
