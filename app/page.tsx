// page.tsx (root)
// Main dashboard with stats and overview

'use client';

import { soldHistory } from '@/data/spaces';
import { Dashboard } from '@/components/pages/Dashboard';
import { useSpaces } from '@/lib/hooks/useSpaces';

export default function DashboardPage() {
  const { spaces } = useSpaces('all');

  return <Dashboard spaces={spaces} soldHistory={soldHistory} />;
}
