'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PocketBaseProvider } from '@/lib/Pocketbase';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/Auth';

const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PocketBaseProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </PocketBaseProvider>
  );
}
