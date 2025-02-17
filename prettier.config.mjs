/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import('prettier').Config}
 */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  importOrder: [
    '^react$',
    '^jest$',
    '^next(.*)$',
    '^lucide-react$',
    '<THIRD_PARTY_MODULES>',
    '^@/app/(.*)$',
    '^@/components/(.*)$',
    '^@/workers/(.*)$',
    '^@/hooks/(.*)$',
    '^@/store/(.*)$',
    '^@/lib/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  plugins: [
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
};

export default config;
