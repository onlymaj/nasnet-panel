import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@nasnet/ui';
import { api, type VPNClient, type VPNPeer, type VPNProtocol, type VPNServer } from '../api';
import { StatsStrip } from './vpn/StatsStrip';
import { ClientsSection } from './vpn/sections/ClientsSection';
import { ServersSection } from './vpn/sections/ServersSection';
import { PeersSection } from './vpn/sections/PeersSection';

export function VPNPage() {
  const { id } = useParams<{ id: string }>();
  const [clients, setClients] = useState<VPNClient[]>([]);
  const [servers, setServers] = useState<VPNServer[]>([]);
  const [peers, setPeers] = useState<VPNPeer[]>([]);

  const reload = useCallback(async () => {
    if (!id) return;
    const [c, s, p] = await Promise.all([
      api.vpn.listClients(id),
      api.vpn.listServers(id),
      api.vpn.listPeers(id),
    ]);
    setClients(c);
    setServers(s);
    setPeers(p);
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const protocols = useMemo(() => {
    const set = new Set<VPNProtocol>();
    clients.forEach((c) => set.add(c.protocol));
    servers.forEach((s) => set.add(s.protocol));
    return [...set];
  }, [clients, servers]);

  return (
    <Stack>
      <StatsStrip clients={clients} servers={servers} peers={peers} protocols={protocols} />
      <ClientsSection routerId={id!} clients={clients} onChanged={reload} />
      <ServersSection routerId={id!} servers={servers} onChanged={reload} />
      <PeersSection routerId={id!} peers={peers} servers={servers} onChanged={reload} />
    </Stack>
  );
}
