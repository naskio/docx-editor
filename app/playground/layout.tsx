import React from 'react';
import { DocumentsStoreProvider } from '@/store/documents-store-provider';
import { PreviewStoreProvider } from '@/store/preview-store-provider';
import { SettingsStoreProvider } from '@/store/settings-store-provider';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='h-screen'>
      <SettingsStoreProvider>
        <PreviewStoreProvider>
          <DocumentsStoreProvider>{children}</DocumentsStoreProvider>
        </PreviewStoreProvider>
      </SettingsStoreProvider>
    </section>
  );
}
