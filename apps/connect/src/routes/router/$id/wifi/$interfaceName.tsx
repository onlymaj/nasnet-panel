import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const WifiDetailPage = lazy(() => import('@/app/pages/wifi/detail').then(m => ({ default: m.WifiDetailPage })));

export const Route = createFileRoute('/router/$id/wifi/$interfaceName')({
  component: () => (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <WifiDetailPage />
    </Suspense>
  ),
});
