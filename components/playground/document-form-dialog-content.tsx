import React, { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDocumentsStore } from '@/store/documents-store-provider';
import type { Mode, TextFile } from '@/lib/types';
import {
  getDocumentFormDefaultValues,
  getDocumentFormSchema,
  isNewDocumentName,
} from '@/lib/validation';

const labels = {
  create: {
    title: 'New Document',
    description: 'Create a new blank document or start from a template.',
    button: 'Create',
    buttonVariant: 'default',
  },
  update: {
    title: 'Rename Document',
    description: 'Give your document a new name.',
    button: 'Save',
    buttonVariant: 'default',
  },
  delete: {
    title: 'Are you absolutely sure?',
    description:
      'This action cannot be undone. Are you sure you want to permanently delete this document?',
    button: 'Confirm',
    buttonVariant: 'destructive',
  },
};

function DocumentFormDialogContent({
  mode,
  shouldReset,
  postSubmit,
  selectedName,
  templates,
}: {
  mode: Mode;
  shouldReset: boolean;
  postSubmit: () => void;
  selectedName?: string;
  templates?: TextFile[];
}) {
  const {
    documents,
    openTabs,
    createDocument,
    renameDocument,
    deleteDocument,
    openDocument,
    closeDocument,
  } = useDocumentsStore((state) => state);

  const schema = useMemo(
    () =>
      getDocumentFormSchema(
        mode,
        (v) => isNewDocumentName(v, documents, selectedName),
        templates
      ),
    [mode, documents, selectedName, templates]
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: getDocumentFormDefaultValues(
      mode,
      templates?.length ? templates[0].name : undefined,
      selectedName
    ),
  });

  // reset form
  useEffect(() => {
    if (shouldReset) form.reset();
  }, [form, shouldReset]);

  const onSubmit = form.handleSubmit(({ name, template }) => {
    if (mode === 'create') {
      const templateObject = templates?.find((t) => t.name === template);
      const content: string =
        templateObject?.text || `import * as docx from 'docx';\n`;
      const newName = name as string;
      createDocument(newName, content);
      openDocument(newName);
    } else if (mode === 'update') {
      const oldName = selectedName as string;
      const newName = name as string;
      const isOpen = openTabs.includes(oldName);
      if (isOpen) closeDocument(oldName);
      renameDocument(oldName, newName);
      if (isOpen) openDocument(newName);
    } else if (mode === 'delete') {
      const oldName = selectedName as string;
      closeDocument(oldName);
      deleteDocument(oldName);
    }
    postSubmit();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{labels[mode].title}</DialogTitle>
          <DialogDescription>{labels[mode].description}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-4'>
          {'name' in schema.shape && (
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' autoComplete='off' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {'template' in schema.shape && (
            <FormField
              control={form.control}
              name='template'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a template' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates?.map((template, index) => (
                        <SelectItem value={template.name} key={index}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            type='submit'
            variant={labels[mode].buttonVariant as 'default' | 'destructive'}
          >
            {labels[mode].button}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export const DocumentFormDialogContentMemoized = React.memo(
  DocumentFormDialogContent
);
