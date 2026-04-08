import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const RouterNetworkTab = lazy(() => import('@/app/routes/router-panel/tabs').then(m => ({ default: m.NetworkTab })));

export const Route = createFileRoute('/router/$id/network')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <RouterNetworkTab />
    </Suspense>
  ),
});
