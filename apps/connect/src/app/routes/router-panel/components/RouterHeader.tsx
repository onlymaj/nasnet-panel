import React from 'react';
import { useRouterStore, useConnectionStore } from '@nasnet/state/stores';
import { BackButton, StatusIndicator } from '@nasnet/ui/patterns';
export interface RouterHeaderProps {
  /**
   * Router ID from URL params
   */
  routerId: string;
}

/**
 * RouterHeader Component
 *
 * Enhanced header for the router panel displaying:
 * - Back button to router list
 * - Router name/ID
 * - Connection status indicator
 * - IP address
 * - Optional router model/info
 *
 * Features:
 * - Responsive design (compact on mobile, expanded on desktop)
 * - Card-based styling with elevation
 * - Status indicator with color-coded visual feedback
 * - Accessible with proper ARIA labels and heading hierarchy
 *
 * Usage:
 * ```tsx
 * <RouterHeader routerId={id} />
 * ```
 */
export const RouterHeader = React.memo(function RouterHeader({ routerId }: RouterHeaderProps) {
  const getRouter = useRouterStore((state) => state.getRouter);
  const connectionState = useConnectionStore((state) => state.state);
  const router = getRouter(routerId);

  // Determine connection status
  const isConnected = connectionState === 'connected';
  const status = isConnected ? 'online' : 'offline';
  const statusLabel =
    connectionState === 'reconnecting' ? 'Reconnecting'
    : isConnected ? 'Connected'
    : 'Disconnected';
  return null;
});
RouterHeader.displayName = 'RouterHeader';
