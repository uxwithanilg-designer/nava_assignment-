import type { ReactNode } from 'react';
import { ReviewStoreProvider } from '@/store/reviewStore';

export function Providers({ children }: { children: ReactNode }) {
  return <ReviewStoreProvider>{children}</ReviewStoreProvider>;
}
