import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const VPNClientsPage = lazy(() => import('@/app/pages/vpn').then(m => ({ default: m.VPNClientsPage })));

export const Route = createFileRoute('/router/$id/vpn/clients')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <VPNClientsPage />
    </Suspense>
  ),
});
