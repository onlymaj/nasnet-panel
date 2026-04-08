/**
 * Service Instance Detail Route (NAS-8.1)
 *
 * Displays detailed information for a specific service instance including
 * overview, configuration, traffic, logs, and diagnostics.
 *
 * Route: /router/:id/services/:instanceId
 */

import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const ServiceDetailPage = lazy(() => import('@nasnet/features/services').then(m => ({ default: m.ServiceDetailPage })));

export const Route = createFileRoute('/router/$id/services/$instanceId')({
  component: ServiceDetailRoute,
});

export function ServiceDetailRoute() {
  const { id: routerId, instanceId } = Route.useParams();

  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <ServiceDetailPage
        routerId={routerId}
        instanceId={instanceId}
      />
    </Suspense>
  );
}
