/**
 * Logs Tab Component
 *
 * Displays system logs with filtering options.
 * Epic 0.8: System Logs - Story 0.8.1: Log Viewer
 */

import { LogViewer } from '@nasnet/features/dashboard';
export function LogsTab() {
  return <div className="p-component-md md:p-component-lg animate-fade-in-up flex h-full flex-col">
      <div className="mb-component-md px-component-sm">
        <h2 className="font-display text-lg font-semibold md:text-xl">{"Recent Logs"}</h2>
        <p className="text-muted-foreground text-sm">{"recentLogs.description"}</p>
      </div>

      <div className="min-h-0 flex-1">
        <LogViewer limit={100} />
      </div>
    </div>;
}
LogsTab.displayName = 'LogsTab';