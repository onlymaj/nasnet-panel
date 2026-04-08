import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const RouterDiscoveryPage = lazy(() => import('@/app/pages/router-discovery').then(m => ({ default: m.RouterDiscoveryPage })));

export const Route = createFileRoute('/')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <RouterDiscoveryPage />
    </Suspense>
  ),
});
