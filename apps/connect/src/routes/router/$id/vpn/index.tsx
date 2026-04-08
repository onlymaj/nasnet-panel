import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const VPNDashboard = lazy(() => import('@/app/pages/vpn').then(m => ({ default: m.VPNDashboard })));

export const Route = createFileRoute('/router/$id/vpn/')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <VPNDashboard />
    </Suspense>
  ),
});
