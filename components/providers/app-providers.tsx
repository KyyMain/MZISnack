import { Suspense } from 'react';
import type { Session } from '@supabase/supabase-js';
import { SupabaseProvider } from '@/components/providers/supabase-provider';

type Props = {
  children: React.ReactNode;
  initialSession: Session | null;
};

export function AppProviders({ children, initialSession }: Props) {
  return (
    <SupabaseProvider initialSession={initialSession}>
      <Suspense fallback={null}>{children}</Suspense>
    </SupabaseProvider>
  );
}
