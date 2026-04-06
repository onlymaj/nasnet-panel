/**
 * Service Ports Table Component (Desktop Presenter)
 *
 * @description Desktop-optimized service ports management with dense data table layout,
 * sortable columns, advanced filtering, and bulk actions. Built-in services are read-only;
 * custom services support edit and delete operations with professional UI.
 *
 * @example
 * ```tsx
 * <ServicePortsTableDesktop
 *   className="p-4"
 * />
 * ```
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useCustomServices } from '../hooks/useCustomServices';
import type {
  ServicePortDefinition,
  ServicePortProtocol,
  ServicePortCategory,
} from '@nasnet/core/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@nasnet/ui/primitives';
import { Pencil, Trash2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@nasnet/ui/utils';

function getProtocolLabel(protocol: ServicePortProtocol) {
  return protocol === 'both' ? 'TCP/UDP' : protocol.toUpperCase();
}

function getTypeLabel(isBuiltIn: boolean) {
  return isBuiltIn ? 'Built-in' : 'Custom';
}

// ============================================================================
// Protocol Badge Component
// ============================================================================

interface ProtocolBadgeProps {
  protocol: ServicePortProtocol;
}
const ProtocolBadge = React.memo(function ProtocolBadge({ protocol }: ProtocolBadgeProps) {
  const variantMap: Record<ServicePortProtocol, 'default' | 'info' | 'success'> = {
    tcp: 'info',
    udp: 'success',
    both: 'default',
  };
  const variant = variantMap[protocol];
  return (
    <Badge
      variant={variant}
      className="text-xs uppercase"
    >
      {getProtocolLabel(protocol)}
    </Badge>
  );
});
ProtocolBadge.displayName = 'ProtocolBadge';

// ============================================================================
// Type Badge Component
// ============================================================================

interface TypeBadgeProps {
  isBuiltIn: boolean;
}
const TypeBadge = React.memo(function TypeBadge({ isBuiltIn }: TypeBadgeProps) {
  return (
    <Badge
      variant={isBuiltIn ? 'default' : 'warning'}
      className="text-xs"
    >
      {getTypeLabel(isBuiltIn)}
    </Badge>
  );
});
TypeBadge.displayName = 'TypeBadge';

// ============================================================================
// Loading State Component
// ============================================================================

const LoadingState = React.memo(function LoadingState() {
  return (
    <div className="space-y-component-sm">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="space-x-component-md flex items-center"
        >
          <Skeleton className="h-12 flex-1" />
        </div>
      ))}
    </div>
  );
});
LoadingState.displayName = 'LoadingState';

// ============================================================================
// Empty State Component
// ============================================================================

interface EmptyStateProps {
  message: string;
  description?: string;
}
const EmptyState = React.memo(function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground text-lg font-medium">{message}</p>
      {description && (
        <p className="mt-component-sm text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

// ============================================================================
// Main Component
// ============================================================================

export interface ServicePortsTableDesktopProps {
  /** Optional CSS class name */
  className?: string;
}
type SortField = 'name' | 'port';
type SortDirection = 'asc' | 'desc';
export const ServicePortsTableDesktop = React.memo(function ServicePortsTableDesktop({
  className,
}: ServicePortsTableDesktopProps) {
  const { services, deleteService } = useCustomServices();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServicePortDefinition | null>(null);
  const [isLoading] = useState(false);

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let result = [...services];

    // Search filter (by name or port)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.service.toLowerCase().includes(query) ||
          service.port.toString().includes(query) ||
          service.description?.toLowerCase().includes(query)
      );
    }

    // Protocol filter
    if (protocolFilter !== 'all') {
      result = result.filter((service) => service.protocol === protocolFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((service) => service.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.service.localeCompare(b.service);
      } else if (sortField === 'port') {
        comparison = a.port - b.port;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [services, searchQuery, protocolFilter, categoryFilter, sortField, sortDirection]);

  // Handlers
  const handleSort = useCallback((field: SortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
      return prevField === field ? prevField : field;
    });
  }, []);
  const handleDeleteClick = useCallback((service: ServicePortDefinition) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  }, []);
  const handleDeleteConfirm = useCallback(() => {
    if (serviceToDelete) {
      try {
        deleteService(serviceToDelete.port);
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  }, [serviceToDelete, deleteService]);
  const handleEditClick = useCallback((service: ServicePortDefinition) => {
    // TODO: Open edit dialog (Task 6)
    console.log('Edit service:', service);
  }, []);

  // Categories for filter dropdown (constant)
  const CATEGORIES: ServicePortCategory[] = useMemo(
    () => [
      'web',
      'secure',
      'database',
      'messaging',
      'mail',
      'network',
      'system',
      'containers',
      'mikrotik',
      'custom',
    ],
    []
  );
  return (
    <div className={cn('space-y-component-md', className)}>
      {/* Search and Filters */}
      <div className="gap-component-md flex items-center">
        <div className="relative flex-1">
          <Search
            className="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            placeholder={'Search by name or port...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label={'Service Name'}
          />
        </div>

        <Select
          value={protocolFilter}
          onValueChange={setProtocolFilter}
        >
          <SelectTrigger className="min-h-[44px] w-[150px]">
            <SelectValue placeholder={'Protocol'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{'All Protocols'}</SelectItem>
            <SelectItem value="tcp">{'TCP'}</SelectItem>
            <SelectItem value="udp">{'UDP'}</SelectItem>
            <SelectItem value="both">{'TCP & UDP'}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="min-h-[44px] w-[150px]">
            <SelectValue placeholder={'Category'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{'All Categories'}</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem
                key={category}
                value={category}
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ?
        <LoadingState />
      : filteredAndSortedServices.length === 0 ?
        <EmptyState
          message={
            searchQuery || protocolFilter !== 'all' || categoryFilter !== 'all' ?
              'No custom services defined'
            : 'No custom services defined'
          }
          description={
            searchQuery || protocolFilter !== 'all' || categoryFilter !== 'all' ?
              'Add custom services to use in firewall rules'
            : undefined
          }
        />
      : <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                  role="button"
                  tabIndex={0}
                  aria-label={`${'Service Name'} - ${sortField === 'name' ? `sorted ${sortDirection}` : 'not sorted'}`}
                >
                  {'Service Name'}
                  {sortField === 'name' && (
                    <span
                      className="ml-1"
                      aria-hidden="true"
                    >
                      {sortDirection === 'asc' ?
                        <ChevronUp className="inline h-4 w-4" />
                      : <ChevronDown className="inline h-4 w-4" />}
                    </span>
                  )}
                </TableHead>
                <TableHead>{'Protocol'}</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('port')}
                  role="button"
                  tabIndex={0}
                  aria-label={`${'Port'} - ${sortField === 'port' ? `sorted ${sortDirection}` : 'not sorted'}`}
                >
                  {'Port'}
                  {sortField === 'port' && (
                    <span
                      className="ml-1"
                      aria-hidden="true"
                    >
                      {sortDirection === 'asc' ?
                        <ChevronUp className="inline h-4 w-4" />
                      : <ChevronDown className="inline h-4 w-4" />}
                    </span>
                  )}
                </TableHead>
                <TableHead>{'Type'}</TableHead>
                <TableHead className="text-right">{'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedServices.map((service) => (
                <TableRow key={`${service.port}-${service.protocol}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{service.service}</p>
                      {service.description && (
                        <p className="text-muted-foreground text-xs">{service.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProtocolBadge protocol={service.protocol} />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm tabular-nums">{service.port}</span>
                  </TableCell>
                  <TableCell>
                    <TypeBadge isBuiltIn={service.isBuiltIn} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="gap-component-sm flex items-center justify-end">
                      {service.isBuiltIn ?
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="gap-component-sm flex items-center justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled
                                className="cursor-not-allowed opacity-50"
                                aria-label={'Edit Service'}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled
                                className="cursor-not-allowed opacity-50"
                                aria-label={'Delete Service'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {'Built-in services cannot be edited or deleted'}
                          </TooltipContent>
                        </Tooltip>
                      : <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[44px] w-[44px]"
                            onClick={() => handleEditClick(service)}
                            aria-label={'Edit Service'}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[44px] w-[44px]"
                            onClick={() => handleDeleteClick(service)}
                            aria-label={'Delete Service'}
                          >
                            <Trash2 className="text-error h-4 w-4" />
                          </Button>
                        </>
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Delete this service?'}</DialogTitle>
            <DialogDescription>
              {'This action cannot be undone. The service will be removed from your custom list.'}
              {serviceToDelete && (
                <div className="mt-component-md bg-muted p-component-sm rounded-md">
                  <p className="font-medium">
                    {serviceToDelete.service} (Port {serviceToDelete.port})
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="min-h-[44px]"
            >
              {'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="min-h-[44px]"
            >
              {'Delete Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
ServicePortsTableDesktop.displayName = 'ServicePortsTableDesktop';
