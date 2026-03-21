// layout.tsx
// Root layout with providers and header

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/Providers';

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'RMHP Dashboard',
  description: 'Riviera Mobile Home Park Dashboard',
};

// ─────────────────────────────────────────────────────────────────────────────
// Root Layout Component
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          {/* Main content with responsive padding and flexbox layout */}
          <main className="flex-1 pt-[calc(3.5rem+12px)] lg:pt-6 lg:ml-60 px-4 py-6 sm:px-6 lg:px-8 xl:px-12 max-w-full">
            <div className="flex flex-col w-full max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
          {/* Toast notifications positioned at top-right */}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
