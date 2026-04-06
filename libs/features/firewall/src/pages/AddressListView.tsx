/**
 * AddressListView Page Component
 *
 * Main page for managing MikroTik firewall address lists.
 * Orchestrates the AddressListManager pattern component with data fetching and dialogs.
 *
 * Layer 3 Domain Component - Fetches data and manages state
 *
 * Features:
 * - View all address lists with entry counts
 * - Add new entries via form dialog
 * - Import bulk entries via CSV
 * - Export address lists
 * - Delete lists and entries
 * - Loading, error, and empty states
 *
 * @see NAS-7.3: Implement Address Lists - Task 7
 * @module @nasnet/features/firewall/pages
 */

import { useState, useCallback, memo } from 'react';
import { useConnectionStore } from '@nasnet/state/stores';
import { usePlatform } from '@nasnet/ui/patterns';
import { useAddressLists, useCreateAddressListEntry, useDeleteAddressListEntry, useBulkCreateAddressListEntries } from '@nasnet/api-client/queries/firewall';
import { AddressListManager } from '@nasnet/ui/patterns/address-list-manager';
import { AddressListEntryForm } from '../components/AddressListEntryForm';
import { AddressListImportDialog } from '../components/AddressListImportDialog';
import { AddressListExportDialog } from '../components/AddressListExportDialog';
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Card, CardContent, CardDescription, CardHeader, CardTitle, Alert, AlertDescription } from '@nasnet/ui/primitives';
import { Plus, Upload, AlertCircle } from 'lucide-react';
import { cn } from '@nasnet/ui/utils';
import type { AddressListEntryFormData } from '../schemas/addressListSchemas';
import type { BulkAddressInput } from '@nasnet/api-client/queries/firewall';

// ============================================================================
// Empty State Component
// ============================================================================

/**
 * EmptyState Component
 * @description Displays when no address lists are available
 */
interface EmptyStateProps {
  onAddEntry: () => void;
  onImport: () => void;
}
const EmptyState = memo(function EmptyState({
  onAddEntry,
  onImport
}: EmptyStateProps) {
  return <Card className="border-dashed">
      <CardHeader className="text-center">
        <CardTitle>{"No Address Lists"}</CardTitle>
        <CardDescription>{"Get started by creating your first address list for use in firewall rules, rate limiting, and access control."}</CardDescription>
      </CardHeader>
      <CardContent className="gap-component-sm flex justify-center">
        <Button onClick={onAddEntry} aria-label={"Add First Entry"}>
          <Plus className="mr-component-sm h-4 w-4" aria-hidden="true" />
          {"Add First Entry"}
        </Button>
        <Button variant="outline" onClick={onImport} aria-label={"Import from File"}>
          <Upload className="mr-component-sm h-4 w-4" aria-hidden="true" />
          {"Import from File"}
        </Button>
      </CardContent>
    </Card>;
});

// ============================================================================
// Loading Skeleton Component
// ============================================================================

/**
 * LoadingSkeleton Component
 * @description Skeleton loader for address list content
 */
const LoadingSkeleton = memo(function LoadingSkeleton() {
  return <div className="space-y-component-md">
      <div className="space-y-component-md animate-pulse">
        <div className="bg-muted h-16 rounded" />
        <div className="bg-muted h-16 rounded" />
        <div className="bg-muted h-16 rounded" />
      </div>
    </div>;
});

// ============================================================================
// Main Component
// ============================================================================

/**
 * AddressListView Component
 * @description Main page for address list management with CRUD operations
 *
 * @returns Address list view page component
 */
export const AddressListView = memo(function AddressListView() {
  const platform = usePlatform();
  const isMobile = platform === 'mobile';
  const routerIp = useConnectionStore(state => state.currentRouterIp) || '';

  // Dialog state
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);

  // Fetch address lists
  const {
    data: lists,
    isLoading,
    error
  } = useAddressLists(routerIp);

  // Mutation hooks
  const createEntry = useCreateAddressListEntry(routerIp);
  const deleteEntry = useDeleteAddressListEntry(routerIp);
  const bulkCreate = useBulkCreateAddressListEntries(routerIp);

  // ========================================
  // Event Handlers
  // ========================================

  const handleAddEntry = useCallback(() => {
    setShowAddEntry(true);
  }, []);
  const handleImport = useCallback(() => {
    setShowImport(true);
  }, []);
  const handleExport = useCallback(() => {
    setShowExport(true);
  }, []);
  const handleCreateEntry = useCallback(async (data: AddressListEntryFormData) => {
    await createEntry.mutateAsync({
      list: data.list,
      address: data.address,
      comment: data.comment,
      timeout: data.timeout
    });
    setShowAddEntry(false);
  }, [createEntry]);
  const handleDeleteEntry = useCallback(async (entryId: string, listName: string) => {
    await deleteEntry.mutateAsync({
      id: entryId,
      listName
    });
  }, [deleteEntry]);
  const handleBulkImport = useCallback(async (listName: string, entries: BulkAddressInput[]) => {
    const result = await bulkCreate.mutateAsync({
      listName,
      entries
    });
    setShowImport(false);
    return result;
  }, [bulkCreate]);

  // Extract unique list names for the form
  const existingLists = lists?.map(list => list.name) || [];

  // ========================================
  // Render
  // ========================================

  return <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="p-component-md gap-component-md flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {"Address Lists"}
            </h1>
            <p className="text-muted-foreground text-sm">{"Manage firewall address lists and entries"}</p>
          </div>
          <div className="gap-component-sm flex">
            <Button variant="outline" onClick={handleImport} aria-label={"Import"}>
              <Upload className="mr-component-sm h-4 w-4" aria-hidden="true" />
              {"Import"}
            </Button>
            <Button onClick={handleAddEntry} aria-label={"Add Entry"}>
              <Plus className="mr-component-sm h-4 w-4" aria-hidden="true" />
              {"Add Entry"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-component-md flex-1 overflow-y-auto" role="main" aria-label="Address lists content">
        {/* Error State */}
        {error && <Alert variant="destructive" className="mb-component-md">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>
              {"Failed to load address lists"}: {error.message}
            </AlertDescription>
          </Alert>}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && !error && (!lists || lists.length === 0) && <EmptyState onAddEntry={handleAddEntry} onImport={handleImport} />}

        {/* Address List Manager */}
        {!isLoading && !error && lists && lists.length > 0 && <AddressListManager lists={lists as any} isLoading={isLoading} error={error} onDeleteEntry={(entryId: string) => handleDeleteEntry(entryId, '')} showBulkActions={true} enableVirtualization={true} />}
      </div>

      {/* Add Entry Sheet */}
      <Sheet open={showAddEntry} onOpenChange={setShowAddEntry}>
        <SheetContent side={isMobile ? 'bottom' : 'right'} className={isMobile ? 'h-[90vh]' : 'w-full sm:max-w-2xl'}>
          <SheetHeader>
            <SheetTitle className="font-display">
              {"Add Address List Entry"}
            </SheetTitle>
            <SheetDescription>{"Add a new IP address, subnet, or range to an address list"}</SheetDescription>
          </SheetHeader>
          <div className="mt-component-lg">
            <AddressListEntryForm existingLists={existingLists} onSubmit={handleCreateEntry} onCancel={() => setShowAddEntry(false)} isLoading={createEntry.isPending} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {"Import Address List"}
            </DialogTitle>
            <DialogDescription>{"Import IP addresses from CSV or text file"}</DialogDescription>
          </DialogHeader>
          <div className="mt-component-md">
            <AddressListImportDialog routerId={routerIp} existingLists={existingLists} onImport={handleBulkImport as any} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {"Export Address Lists"}
            </DialogTitle>
            <DialogDescription>{"Export address lists to CSV format"}</DialogDescription>
          </DialogHeader>
          <div className="mt-component-md">
            <AddressListExportDialog listName={selectedList || ''} entries={[]} />
          </div>
        </DialogContent>
      </Dialog>
    </div>;
});
AddressListView.displayName = 'AddressListView';