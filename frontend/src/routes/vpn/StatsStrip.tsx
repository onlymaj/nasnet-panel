import { Layers, Monitor, Server, Shield } from 'lucide-react';
import { Badge, Inline, SectionGrid } from '@nasnet/ui';
import type { VPNClient, VPNPeer, VPNProtocol, VPNServer } from '../../api';
import styles from '../VPNPage.module.scss';
import { StatCard } from './StatCard';

interface Props {
  clients: VPNClient[];
  servers: VPNServer[];
  peers: VPNPeer[];
  protocols: VPNProtocol[];
}

const FALLBACK_PROTOCOLS = ['L2TP', 'PPTP', 'SSTP'] as unknown as VPNProtocol[];

export function StatsStrip({ clients, servers, peers, protocols }: Props) {
  const activeTunnels = clients.filter((c) => c.enabled).length;
  const activeServers = servers.filter((s) => s.running).length;
  const activePeers = peers.filter((p) => p.enabled).length;

  return (
    <SectionGrid>
      <StatCard icon={<Shield size={14} />} tone="warning" label="Active Tunnels">
        <span className={styles.statValue}>{activeTunnels}</span>
        <span className={styles.statHint}>
          {clients.length
            ? `${activeTunnels} of ${clients.length} configured`
            : '0 of 0 configured'}
        </span>
      </StatCard>

      <StatCard icon={<Server size={14} />} tone="success" label="Servers">
        <Inline $gap="6px">
          <span className={styles.statValue}>{activeServers}</span>
          <span className={styles.statAside}>/ {Math.max(servers.length, 3)}</span>
        </Inline>
        <span className={styles.statHint}>Active servers</span>
      </StatCard>

      <StatCard icon={<Monitor size={14} />} tone="info" label="Clients">
        <Inline $gap="6px">
          <span className={styles.statValue}>{activePeers}</span>
          <span className={styles.statAside}>/ {peers.length}</span>
        </Inline>
        <span className={styles.statHint}>Active clients</span>
      </StatCard>

      <StatCard icon={<Layers size={14} />} tone="primary" label="Protocols">
        <span className={styles.statValue}>{protocols.length || 3}</span>
        <Inline $gap="6px">
          {(protocols.length ? protocols : FALLBACK_PROTOCOLS).map((p) => (
            <Badge key={p} tone="info">
              {String(p).toUpperCase()}
            </Badge>
          ))}
        </Inline>
      </StatCard>
    </SectionGrid>
  );
}
