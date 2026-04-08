/**
 * VLAN Settings Route (NAS-8.18)
 *
 * VLAN pool configuration, allocation monitoring, and orphan cleanup.
 *
 * Route: /router/:id/vlans
 */

import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@nasnet/ui/primitives';

const VLANSettingsPage = lazy(() => import('@nasnet/features/services').then(m => ({ default: m.VLANSettingsPage })));

export const Route = createFileRoute('/router/$id/vlans')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id: routerId } = Route.useParams();
  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <VLANSettingsPage routerID={routerId} />
    </Suspense>
  );
}
