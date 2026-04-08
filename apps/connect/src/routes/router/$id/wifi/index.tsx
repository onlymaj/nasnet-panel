import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const WiFiTab = lazy(() => import('@/app/routes/router-panel/tabs').then(m => ({ default: m.WiFiTab })));

export const Route = createFileRoute('/router/$id/wifi/')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <WiFiTab />
    </Suspense>
  ),
});
