/**
 * Status Badge Component
 * Dashboard Pro style with pulse animation for running state
 */

import { memo } from 'react';
import { type InterfaceStatus } from '@nasnet/core/types';
import { cn } from '@nasnet/ui/utils';
interface InterfaceStatusBadgeProps {
  status: InterfaceStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}
export const InterfaceStatusBadge = memo(function InterfaceStatusBadge({
  status,
  size = 'md',
  showLabel = true,
  className
}: InterfaceStatusBadgeProps) {
  const isRunning = status === 'running';
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };
  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2'
  };
  return <span role="status" aria-label={isRunning ? "Running" : "Disabled"} aria-live="polite" className={cn('inline-flex items-center gap-1.5 rounded-full text-xs font-medium', sizeClasses[size], isRunning ? 'bg-success/15 text-success' : 'bg-error/15 text-error', className)}>
      <span className="relative flex flex-shrink-0">
        <span className={cn('rounded-full', dotSizeClasses[size], isRunning ? 'bg-success' : 'bg-error')} aria-hidden="true" />
        {isRunning && <span className={cn('bg-success absolute inset-0 animate-pulse rounded-full opacity-75', dotSizeClasses[size])} aria-hidden="true" />}
      </span>
      {showLabel && <span className="font-medium">
          {isRunning ? "Running" : "Disabled"}
        </span>}
    </span>;
});
InterfaceStatusBadge.displayName = 'InterfaceStatusBadge';