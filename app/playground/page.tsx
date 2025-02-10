import { Metadata } from 'next';
import { Panels } from '@/components/playground/panels';

export function PlaygroundPage() {
  return <Panels />;
}

export default PlaygroundPage;

export const metadata: Metadata = {
  title: 'Playground',
};
