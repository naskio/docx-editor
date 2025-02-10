import { DocumentsStoreProvider } from '@/lib/providers/documents-store-provider';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='h-screen'>
      <DocumentsStoreProvider>{children}</DocumentsStoreProvider>
    </section>
  );
}
