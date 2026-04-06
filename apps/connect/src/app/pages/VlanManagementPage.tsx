/**
 * VLAN Management Page
 *
 * Comprehensive page for managing VLANs with multiple views:
 * - List view (create, edit, delete)
 * - Topology view (visualize VLAN hierarchy)
 *
 * Story: NAS-6.7 - Implement VLAN Management
 */

import React, { useState } from 'react';
import { Plus, List, Network } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateVlan } from '@nasnet/api-client/queries';
import { VlanList, VlanTopology, VlanForm } from '@nasnet/features/network';
import { Tabs, TabsContent, TabsList, TabsTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@nasnet/ui/primitives';
export interface VlanManagementPageProps {
  routerId: string;
}
export const VlanManagementPage = React.memo(function VlanManagementPage({
  routerId
}: VlanManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'topology'>('list');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const {
    createVlan,
    loading
  } = useCreateVlan(routerId);
  const handleCreateVlan = async (values: {
    name: string;
    vlanId: number;
    interface: string;
    mtu?: number | null;
    comment?: string | null;
    disabled?: boolean;
  }) => {
    try {
      const sanitized = {
        ...values,
        mtu: values.mtu ?? undefined,
        comment: values.comment ?? undefined
      };
      const result = (await createVlan(sanitized)) as any;
      if (result?.vlan) {
        toast.success("VLAN created successfully", {
          description: `${values.name} (VLAN ID: ${values.vlanId})`
        });
        setCreateDialogOpen(false);
      } else {
        const errors = result?.errors || [];
        errors.forEach((err: {
          message: string;
        }) => toast.error(err.message));
      }
    } catch (err) {
      toast.error("Failed to create VLAN");
    }
  };
  return <div className="px-page-mobile md:px-page-tablet lg:px-page-desktop animate-fade-in-up mx-auto space-y-6 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display category-header category-header-networking text-3xl font-bold tracking-tight">
            {"VLAN Management"}
          </h1>
          <p className="text-muted-foreground mt-2">{"Create and manage VLAN interfaces for network segmentation"}</p>
        </div>

        <Button onClick={() => setCreateDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          {"Create VLAN"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'list' | 'topology')}>
        <TabsList>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            {"List View"}
          </TabsTrigger>
          <TabsTrigger value="topology">
            <Network className="mr-2 h-4 w-4" />
            {"Topology View"}
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mt-6">
          <VlanList routerId={routerId} />
        </TabsContent>

        {/* Topology View */}
        <TabsContent value="topology" className="mt-6">
          <VlanTopology routerId={routerId} />
        </TabsContent>
      </Tabs>

      {/* Create VLAN Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{"Create VLAN Interface"}</DialogTitle>
          </DialogHeader>
          <VlanForm routerId={routerId} mode="create" onSubmit={handleCreateVlan} onCancel={() => setCreateDialogOpen(false)} isLoading={loading} />
        </DialogContent>
      </Dialog>
    </div>;
});
VlanManagementPage.displayName = 'VlanManagementPage';