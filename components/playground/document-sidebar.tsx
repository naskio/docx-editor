'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { FilePlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DocumentFormDialogContent } from '@/components/playground/document-form-dialog-content';
import React, { useState } from 'react';
import type { TextFile } from '@/lib/types';
import { useDocumentsStore } from '@/store/documents-store-provider';
import { DocumentMenuItem } from '@/components/playground/document-menu-item';

const MemoizedDocumentMenuItem = React.memo(DocumentMenuItem);

export function DocumentSidebar({ templates }: { templates: TextFile[] }) {
  const documents = useDocumentsStore((state) => state.documents);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
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
            <DocumentFormDialogContent
              mode='create'
              shouldReset={!dialogOpen}
              postSubmit={() => setDialogOpen(false)}
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
                <MemoizedDocumentMenuItem key={index} name={doc.name} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
