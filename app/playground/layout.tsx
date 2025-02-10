export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className='h-screen'>{children}</section>;
}
