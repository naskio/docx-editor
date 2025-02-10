import { Metadata } from 'next';
import { Panels } from '@/components/playground/panels';

export default function PlaygroundPage() {
  return <Panels />;
}

export const metadata: Metadata = {
  title: 'Playground',
};
