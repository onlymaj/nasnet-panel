/**
 * Mangle Rules Table Component (Mobile)
 *
 * Domain component for displaying mangle rules on mobile devices.
 * Mobile presenter with card layout and swipe actions.
 *
 * Features:
 * - Card-based layout optimized for touch
 * - Swipe actions (Edit, Delete)
 * - Inline enable/disable toggle
 * - Compact counter display
 * - Disabled rules styling
 * - Unused rules badge
 *
 * @see NAS-7.5: Implement Mangle Rules - Task 7
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useConnectionStore } from '@nasnet/state/stores';
import { cn } from '@nasnet/ui/utils';
import { useMangleRules, useDeleteMangleRule, useToggleMangleRule } from '@nasnet/api-client/queries/firewall';
import { useMangleRuleTable } from '@nasnet/ui/patterns/mangle-rule-table';
import { MangleRuleEditor } from '@nasnet/ui/patterns/mangle-rule-editor';
import type { MangleRule } from '@nasnet/core/types';
import { Card, CardContent, CardHeader, Button, Badge, Switch, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@nasnet/ui/primitives';
import { Pencil, Copy, Trash2 } from 'lucide-react';

// ============================================================================
// Action Badge Component
// ============================================================================

/**
 * ActionBadge Component
 * Displays mangle action type with semantic color coding
 */
const ActionBadge = React.memo(function ActionBadgeComponent({
  action
}: {
  action: string;
}) {
  ActionBadge.displayName = 'ActionBadge';
  const ACTION_COLORS: Record<string, string> = {
    'mark-connection': 'bg-info/10 text-info',
    'mark-packet': 'bg-primary/10 text-primary',
    'mark-routing': 'bg-success/10 text-success',
    'change-dscp': 'bg-warning/10 text-warning',
    'change-ttl': 'bg-info/10 text-info',
    'change-mss': 'bg-primary/10 text-primary',
    accept: 'bg-success/10 text-success',
    drop: 'bg-error/10 text-error',
    jump: 'bg-primary/10 text-primary',
    log: 'bg-muted text-muted-foreground'
  };
  const colorClass = ACTION_COLORS[action] || 'bg-muted text-muted-foreground';
  return <Badge variant="outline" className={cn(colorClass, 'text-xs')}>
      {action}
    </Badge>;
});

// ============================================================================
// Rule Card Component
// ============================================================================

interface RuleCardProps {
  rule: MangleRule;
  onEdit: (rule: MangleRule) => void;
  onDuplicate: (rule: MangleRule) => void;
  onDelete: (rule: MangleRule) => void;
  onToggle: (rule: MangleRule) => void;
  className?: string;
}

/**
 * RuleCard Component
 * Mobile-optimized card for displaying a single mangle rule
 */
const RuleCard = React.memo(function RuleCardComponent({
  rule,
  onEdit,
  onDuplicate,
  onDelete,
  onToggle,
  className
}: RuleCardProps) {
  RuleCard.displayName = 'RuleCard';
  const isUnused = useMemo(() => (rule.packets ?? 0) === 0, [rule.packets]);
  const markValue = useMemo(() => rule.newConnectionMark || rule.newPacketMark || rule.newRoutingMark, [rule.newConnectionMark, rule.newPacketMark, rule.newRoutingMark]);
  const matchers: string[] = [];
  if (rule.protocol) matchers.push(`${rule.protocol}`);
  if (rule.srcAddress) matchers.push(`${rule.srcAddress}`);
  if (rule.dstAddress) matchers.push(`→ ${rule.dstAddress}`);
  if (rule.srcPort) matchers.push(`:${rule.srcPort}`);
  return <Card className={rule.disabled ? 'opacity-50' : ''}>
      <CardHeader className="pb-component-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="gap-component-sm mb-component-xs flex items-center">
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                #{rule.position}
              </span>
              <Badge variant="secondary" className="font-mono text-xs">
                {rule.chain}
              </Badge>
              <ActionBadge action={rule.action} />
            </div>
            {markValue && <div className="mt-component-xs font-mono text-sm font-semibold tabular-nums">
                {markValue}
              </div>}
          </div>
          <Switch checked={!rule.disabled} onCheckedChange={() => onToggle(rule)} aria-label={rule.disabled ? 'Enable rule' : 'Disable rule'} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Matchers */}
        {matchers.length > 0 && <div className="text-muted-foreground mb-component-md text-sm">{matchers.join(' ')}</div>}

        {/* Counters */}
        <div className="gap-component-lg text-muted-foreground mb-component-md flex items-center text-xs">
          <div className="gap-component-xs flex items-center">
            <span className="font-semibold">{"Packets"}:</span>
            {isUnused ? <Badge variant="outline" className="text-muted-foreground text-xs">
                {"Unused (0 hits)"}
              </Badge> : <span className="font-mono tabular-nums">{(rule.packets ?? 0).toLocaleString()}</span>}
          </div>
          <div className="gap-component-xs flex items-center">
            <span className="font-semibold">{"Bytes"}:</span>
            <span className="font-mono tabular-nums">{(rule.bytes ?? 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Comment */}
        {rule.comment && <div className="text-muted-foreground mb-component-md text-sm italic">{rule.comment}</div>}

        {/* Actions - 44px minimum touch targets */}
        <div className="gap-component-sm flex">
          <Button variant="outline" size="sm" onClick={() => onEdit(rule)} className="min-h-[44px] flex-1" aria-label={`Edit rule ${rule.position}`}>
            <Pencil className="mr-component-sm h-4 w-4" aria-hidden="true" />
            {"Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDuplicate(rule)} className="px-component-md min-h-[44px]" aria-label={`Duplicate rule ${rule.position}`}>
            <Copy className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(rule)} className="px-component-md text-error hover:text-error/80 min-h-[44px]" aria-label={`Delete rule ${rule.position}`}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>;
});

// ============================================================================
// Main Component
// ============================================================================

export interface MangleRulesTableMobileProps {
  className?: string;
  chain?: string;
}

/**
 * MangleRulesTableMobile Component
 *
 * @description Mobile-optimized card-based layout for mangle rules
 * with touch-friendly interactions and 44px minimum touch targets.
 *
 * Features:
 * - Touch-friendly card layout
 * - Inline actions (Edit, Duplicate, Delete)
 * - Enable/disable toggle
 * - Compact counter display
 *
 * @example
 * ```tsx
 * <MangleRulesTableMobile
 *   chain="forward"
 *   className="space-y-3"
 * />
 * ```
 */
export const MangleRulesTableMobile = React.memo(function MangleRulesTableMobileComponent({
  className,
  chain
}: MangleRulesTableMobileProps) {
  MangleRulesTableMobile.displayName = 'MangleRulesTableMobile';
  const routerIp = useConnectionStore(state => state.currentRouterIp) || '';
  const {
    data: rules,
    isLoading,
    error
  } = useMangleRules(routerIp, chain ? {
    chain: chain as any
  } : undefined);
  const deleteMangleRule = useDeleteMangleRule(routerIp);
  const toggleMangleRule = useToggleMangleRule(routerIp);
  const [editingRule, setEditingRule] = useState<MangleRule | null>(null);
  const [deleteConfirmRule, setDeleteConfirmRule] = useState<MangleRule | null>(null);

  // Use the headless hook
  const {
    data: sortedRules
  } = useMangleRuleTable({
    data: rules || [],
    initialSortBy: 'position',
    initialSortDirection: 'asc',
    initialFilters: chain ? {
      chain
    } : {}
  });

  // Handlers
  const handleEdit = (rule: MangleRule) => {
    setEditingRule(rule);
  };
  const handleDuplicate = (rule: MangleRule) => {
    const duplicatedRule = {
      ...rule,
      id: undefined,
      position: undefined
    };
    setEditingRule(duplicatedRule);
  };
  const handleDelete = (rule: MangleRule) => {
    setDeleteConfirmRule(rule);
  };
  const handleToggle = (rule: MangleRule) => {
    toggleMangleRule.mutate({
      ruleId: rule.id!,
      disabled: !rule.disabled
    });
  };
  const confirmDelete = () => {
    if (deleteConfirmRule) {
      deleteMangleRule.mutate(deleteConfirmRule.id!);
      setDeleteConfirmRule(null);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className={cn('p-component-md space-y-component-md', className)}>
        <div className="space-y-component-md animate-pulse">
          <div className="bg-muted h-32 rounded" />
          <div className="bg-muted h-32 rounded" />
          <div className="bg-muted h-32 rounded" />
        </div>
      </div>;
  }

  // Error state
  if (error) {
    return <div className={cn('p-component-md text-error', className)} role="alert">
        <p className="mb-component-xs font-semibold">{"Failed to load mangle rules"}</p>
        <p className="text-sm">{error.message}</p>
      </div>;
  }

  // Empty state
  if (!rules || rules.length === 0) {
    return <div className={cn('p-component-lg text-center', className)}>
        <p className="text-muted-foreground">
          {chain ? "No rules in this chain" : "No mangle rules configured"}
        </p>
      </div>;
  }
  return <>
      <div className={cn('space-y-component-md', className)}>
        {sortedRules.map(rule => <RuleCard key={rule.id} rule={rule} onEdit={handleEdit} onDuplicate={handleDuplicate} onDelete={handleDelete} onToggle={handleToggle} />)}
      </div>

      {/* Edit/Create Sheet */}
      <Sheet open={!!editingRule} onOpenChange={open => !open && setEditingRule(null)}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingRule?.id ? "Edit Mangle Rule" : "Add Mangle Rule"}
            </SheetTitle>
            <SheetDescription>
              {editingRule?.id ? "Modify existing mangle rule configuration" : "Create a new mangle rule for traffic marking and QoS"}
            </SheetDescription>
          </SheetHeader>
          {editingRule && <MangleRuleEditor routerId={routerIp} initialRule={editingRule} open={!!editingRule} onClose={() => setEditingRule(null)} onSave={async () => setEditingRule(null)} />}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmRule} onOpenChange={open => !open && setDeleteConfirmRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"Delete Mangle Rule"}</DialogTitle>
            <DialogDescription>{"Are you sure you want to delete this mangle rule?"}</DialogDescription>
          </DialogHeader>
          <div className="py-component-md">
            <p className="mb-component-sm text-sm font-semibold">
              {"This action cannot be undone."}
            </p>
            <ul className="text-muted-foreground space-y-component-xs list-inside list-disc text-sm">
              {(["Traffic marks will no longer be applied", "QoS queues depending on this mark may stop working", "Policy routing rules using this mark may be affected", "Firewall rules matching this mark will not trigger"] as string[]).map((consequence, i) => <li key={i}>{consequence}</li>)}
            </ul>
          </div>
          <DialogFooter className="gap-component-sm">
            <Button variant="outline" onClick={() => setDeleteConfirmRule(null)} className="min-h-[44px]">
              {"Cancel"}
            </Button>
            <Button onClick={confirmDelete} className="bg-error hover:bg-error/90 min-h-[44px]">
              {"Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
});