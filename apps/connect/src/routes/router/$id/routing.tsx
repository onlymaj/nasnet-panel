/**
 * Device-to-Service Routing Route (NAS-8.3)
 *
 * Route devices through service instances (Tor, Xray, etc.) using Policy-Based Routing.
 * Provides device discovery, service assignment, and real-time routing updates.
 */

import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const DeviceRoutingPage = lazy(() => import('@nasnet/features/services').then(m => ({ default: m.DeviceRoutingPage })));

export const Route = createFileRoute('/router/$id/routing')({
  component: DeviceRoutingPageRoute,
});

/**
 * Route component wrapper
 * Extracts routerId from route params and passes to DeviceRoutingPage
 */
function DeviceRoutingPageRoute() {
  const { id: routerId } = Route.useParams();

  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <DeviceRoutingPage routerId={routerId} />
    </Suspense>
  );
}
