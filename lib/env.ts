import { z } from 'zod';

const envSchema = z.object({
  basePath: z.string().default(``),
  repositoryUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  renderingLibraries: z
    .string()
    .default(`docxjs,mammoth.js`)
    .transform((value) => {
      return value?.split(',').map((item) => item.trim());
    }),
});

export const env = envSchema.parse({
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL,
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL,
  renderingLibraries: process.env.NEXT_PUBLIC_RENDERING_LIBRARIES,
});
