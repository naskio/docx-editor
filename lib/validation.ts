import { z } from 'zod';
import type { TextFile, Mode } from '@/lib/types';

export function isNewDocumentName(
  name: string,
  documents: TextFile[],
  skipName?: string
) {
  return documents
    .filter((doc) => doc.name !== skipName)
    .every((doc) => doc.name !== name);
}

export function getDocumentFormSchema(
  mode: Mode,
  isNewDocumentName: (value: string) => boolean,
  templates?: TextFile[]
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
      .refine(isNewDocumentName, `Document with this name already exists`);
  }
  if (mode === 'create' && templates?.length) {
    shape['template'] = z
      .string()
      .refine(
        (v) => templates.some((t) => t.name === v),
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
  defaultTemplate?: string,
  selectedName?: string
) {
  if (mode === 'create')
    return {
      name: 'Untitled Document',
      template: defaultTemplate,
    };
  if (mode === 'update') return { name: selectedName };
  return {};
}
