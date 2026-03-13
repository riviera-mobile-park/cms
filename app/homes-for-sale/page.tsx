// page.tsx (homes-for-sale)
// Displays spaces marked as for-sale

'use client';

import { HomesForSale } from '@/components/pages/HomesForSale';
import { useSpaces } from '@/lib/hooks/useSpaces';

export default function HomesForSalePage() {
  const { spaces, updateSpace } = useSpaces('all');

  return <HomesForSale spaces={spaces} onUpdateSpace={updateSpace} />;
}
