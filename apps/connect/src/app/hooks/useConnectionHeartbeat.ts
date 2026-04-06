/**
 * Connection Heartbeat Hook
 * Keeps the shared connection store aligned with the router resource query.
 */

import { useEffect, useRef } from 'react';

import { useRouterResource } from '@nasnet/api-client/queries';
import { useConnectionStore } from '@nasnet/state/stores';

/**
 * Connection Heartbeat Hook
 *
 * Uses the same resource query that powers the dashboard to derive a single
 * router reachability signal for the app shell.
 *
 * Features:
 * - Shares the TanStack Query cache with router pages
 * - Marks the shell connected when router resource data is available
 * - Marks the shell disconnected on query errors
 * - Uses reconnecting while the first request is in flight
 *
 * @example
 * ```tsx
 * function App() {
 *   // Enable heartbeat monitoring
 *   useConnectionHeartbeat();
 *
 *   return <Router />
 * }
 * ```
 */
export function useConnectionHeartbeat() {
  const currentRouterIp = useConnectionStore((s) => s.currentRouterIp) || '';
  const { data, error, isLoading, isFetching } = useRouterResource(currentRouterIp);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    hasConnectedRef.current = false;
  }, [currentRouterIp]);

  useEffect(() => {
    if (!currentRouterIp) {
      useConnectionStore.getState().setDisconnected();
      return;
    }

    const store = useConnectionStore.getState();

    if (error) {
      if (hasConnectedRef.current) {
        if (store.state !== 'disconnected') {
          store.setDisconnected();
          console.debug('[Heartbeat] Connection lost', error);
        }
      } else if (store.state !== 'reconnecting') {
        store.setReconnecting();
      }
      return;
    }

    if (data) {
      hasConnectedRef.current = true;
      if (store.state !== 'connected') {
        store.setConnected();
        console.debug('[Heartbeat] Connection restored');
      }
      return;
    }

    if ((isLoading || isFetching) && store.state === 'disconnected') {
      store.setReconnecting();
    }
  }, [currentRouterIp, data, error, isFetching, isLoading]);
}
