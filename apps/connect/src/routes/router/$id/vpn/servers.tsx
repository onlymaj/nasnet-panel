import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const VPNServersPage = lazy(() => import('@/app/pages/vpn').then(m => ({ default: m.VPNServersPage })));

export const Route = createFileRoute('/router/$id/vpn/servers')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <VPNServersPage />
    </Suspense>
  ),
});
