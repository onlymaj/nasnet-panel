import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const OverviewTab = lazy(() => import('@/app/routes/router-panel/tabs').then(m => ({ default: m.OverviewTab })));

export const Route = createFileRoute('/router/$id/')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <OverviewTab />
    </Suspense>
  ),
});
