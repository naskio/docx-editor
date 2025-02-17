import React from 'react';
import { DocumentsStoreProvider } from '@/store/documents-store-provider';
import { OutputStoreProvider } from '@/store/output-store-provider';
import { SettingsStoreProvider } from '@/store/settings-store-provider';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsStoreProvider>
      <OutputStoreProvider>
        <DocumentsStoreProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </DocumentsStoreProvider>
      </OutputStoreProvider>
    </SettingsStoreProvider>
  );
}
