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
      <body>
        <Providers>
          <Header />
          {/* Main content with responsive padding accounting for fixed header and sidebar */}
          <main className="pt-[calc(3.5rem+12px)] lg:pt-6 lg:ml-60 px-4 py-6 sm:px-6 lg:px-12 xl:px-16">
            {children}
          </main>
          {/* Toast notifications positioned at top-right */}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
