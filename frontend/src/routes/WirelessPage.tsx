import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@nasnet/ui';
import type { WirelessSettings } from '../api';
import { StatsStrip } from './wireless/StatsStrip';
import { ClientsCard } from './wireless/ClientsCard';
import { InterfacesCard } from './wireless/InterfacesCard';
import { EditDialog } from './wireless/EditDialog';
import { WirelessSkeleton } from './wireless/WirelessSkeleton';
import { useWireless } from './wireless/useWireless';

export function WirelessPage() {
  const { id } = useParams<{ id: string }>();
  const {
    settings,
    interfaces,
    clients,
    loading,
    restarting,
    reload,
    save,
    toggleInterface,
    restart,
  } = useWireless(id);
  const [editOpen, setEditOpen] = useState(false);

  const onSave = async (next: WirelessSettings) => {
    await save(next);
    setEditOpen(false);
  };

  if (loading && !settings) {
    return <WirelessSkeleton />;
  }

  return (
    <Stack>
      <StatsStrip clients={clients} interfaces={interfaces} settings={settings} />
      <ClientsCard clients={clients} loading={loading} onReload={reload} />
      <InterfacesCard
        interfaces={interfaces}
        settings={settings}
        restarting={restarting}
        onRestart={restart}
        onToggle={toggleInterface}
        onEdit={() => setEditOpen(true)}
      />
      {editOpen && settings ? (
        <EditDialog settings={settings} onSave={onSave} onClose={() => setEditOpen(false)} />
      ) : null}
    </Stack>
  );
}
