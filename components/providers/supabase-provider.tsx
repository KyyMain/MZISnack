'use client';

import { createContext, useContext, useMemo } from 'react';
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react';
import type { Session } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/supabase/browser';
import type { Database } from '@/lib/supabase/database.types';

type SupabaseContextValue = {
  client: SupabaseClient<Database>;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  initialSession: Session | null;
};

export function SupabaseProvider({ children, initialSession }: Props) {
  const supabaseClient = useMemo(() => createBrowserClient(), []);

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <SupabaseContext.Provider value={{ client: supabaseClient }}>
        {children}
      </SupabaseContext.Provider>
    </SessionContextProvider>
  );
}

export function useSupabase() {
  const value = useContext(SupabaseContext);
  if (!value) {
    throw new Error('useSupabase harus dipanggil di dalam SupabaseProvider');
  }
  return value.client;
}

export function useSupabaseSession() {
  const { session } = useSessionContext();
  return session;
}
