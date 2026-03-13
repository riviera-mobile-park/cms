// Providers.tsx
// App-wide context providers (theme, etc.)

'use client';

import { ThemeProvider } from 'next-themes';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  );
}
