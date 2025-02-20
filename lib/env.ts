import { z } from 'zod';

export const renderingLibraryOptions = [
  'docxjs',
  'mammoth.js',
  'Office',
  'Docs',
];

const envSchema = z.object({
  basePath: z
    .string()
    .default(``)
    .refine(
      (value) => !value || (value.startsWith(`/`) && !value.endsWith(`/`))
    ),
  repositoryUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  renderingLibraries: z
    .string()
    .default(`docxjs,mammoth.js`)
    .transform((value) => {
      return value?.split(',').map((item) => item.trim()) ?? [];
    })
    .refine(
      (arr) =>
        arr.length > 0 &&
        arr.every((value) => renderingLibraryOptions.includes(value))
    ),
  output: z.enum([`export`, ``]).default(``),
});

export const env = envSchema.parse({
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL,
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL,
  renderingLibraries: process.env.NEXT_PUBLIC_RENDERING_LIBRARIES,
  output: process.env.OUTPUT,
});
