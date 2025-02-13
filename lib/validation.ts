import { z } from 'zod';
import { templates } from '@/lib/constants';
import { Document } from '@/lib/store';

export type Mode = 'create' | 'update' | 'delete';

export function isNewDocumentName(
  name: string,
  documents: Document[],
  skipName?: string
) {
  return documents
    .filter((doc) => doc.name !== skipName)
    .every((doc) => doc.name !== name);
}

export function getDocumentSchema(
  mode: Mode,
  isNewName: (value: string) => boolean
) {
  const shape = {};
  if (mode !== 'delete') {
    shape['name'] = z
      .string()
      .min(1, `Name can't be empty`)
      .max(40, `Name can't be longer than 40 characters`)
      .regex(
        /^[a-zA-Z0-9-_ ]+$/,
        `Name can only contain letters, numbers, spaces, hyphens, and underscores`
      )
      .transform((val, ctx) => {
        const trimmed = val.trim();
        if (!trimmed) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Name can't be empty`,
          });
          return z.NEVER;
        }
        return trimmed;
      })
      .refine(isNewName, `Document with this name already exists`);
  }
  if (mode === 'create') {
    shape['template'] = z
      .string()
      .refine(
        (value) => templates.some((template) => template.title === value),
        `You must select a template`
      );
  }
  return z.object(
    shape as {
      name: z.ZodOptional<z.ZodString>;
      template: z.ZodOptional<z.ZodString>;
    }
  );
}

export function getDocumentFormDefaultValues(
  mode: Mode,
  selectedName?: string
) {
  if (mode === 'create')
    return {
      name: 'Untitled Document',
      template: templates[0].title,
    };
  if (mode === 'update') return { name: selectedName };
  return {};
}
