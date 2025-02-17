'use client';

import React, { useCallback, useState } from 'react';
import { FilePlusIcon } from 'lucide-react';
import { DocumentFormDialogContentMemoized } from '@/components/playground/document-form-dialog-content';
import { DocumentMenuItemMemoized } from '@/components/playground/document-menu-item';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { useDocumentsStore } from '@/store/documents-store-provider';
import type { TextFile } from '@/lib/types';

export function DocumentSidebar({ templates }: { templates: TextFile[] }) {
  const documents = useDocumentsStore((state) => state.documents);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return (
    <Sidebar collapsible='none'>
      <SidebarHeader>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              autoFocus
              className='text-sidebar-foreground w-full py-3'
              variant='ghost'
              size='lg'
            >
              <FilePlusIcon className='mr-1' />
              New Document...
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DocumentFormDialogContentMemoized
              mode='create'
              shouldReset={!dialogOpen}
              postSubmit={closeDialog}
              templates={templates}
            />
          </DialogContent>
        </Dialog>
      </SidebarHeader>
      <SidebarContent className='h-full'>
        <SidebarGroup hidden={!documents?.length}>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documents.map((doc, index) => (
                <DocumentMenuItemMemoized key={index} name={doc.name} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
