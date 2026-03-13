// page.tsx (our-homes)
// RMHP-owned homes for sale

'use client';

import { OurHomes } from '@/components/pages/OurHomes';
import { useSpaces } from '@/lib/hooks/useSpaces';

export default function OurHomesPage() {
  const { spaces, updateSpace } = useSpaces('all');

  return <OurHomes spaces={spaces} onUpdateSpace={updateSpace} />;
}
