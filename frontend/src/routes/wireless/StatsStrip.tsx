import { Radio, SignalHigh, Users as UsersIcon, Wifi } from 'lucide-react';
import { Inline, Progress, SectionGrid } from '@nasnet/ui';
import type { Interface, WirelessClient, WirelessSettings } from '../../api';
import styles from '../WirelessPage.module.scss';
import { StatCard } from './StatCard';

interface Props {
  clients: WirelessClient[];
  interfaces: Interface[];
  settings: WirelessSettings | null;
}

export function StatsStrip({ clients, interfaces, settings }: Props) {
  const clientCount = clients.length;
  const running = interfaces.filter((i) => i.running).length;
  const total = interfaces.length;
  const avgSignal = clientCount
    ? Math.round(clients.reduce((sum, c) => sum + c.signalDbm, 0) / clientCount)
    : null;

  return (
    <SectionGrid>
      <StatCard icon={<UsersIcon size={18} />} tone="info" label="Clients">
        <span className={styles.statValue}>{clientCount}</span>
        <span className={styles.statHint}>Connected devices</span>
      </StatCard>

      <StatCard icon={<Wifi size={18} />} tone="success" label="Active">
        <Inline $gap="6px">
          <span className={styles.statValue}>{running}</span>
          <span className={styles.statAside}>/{total}</span>
        </Inline>
        <Progress value={running} max={total || 1} tone="success" />
      </StatCard>

      <StatCard icon={<SignalHigh size={18} />} tone="warning" label="Signal">
        <span className={styles.statValue}>
          {avgSignal !== null ? `${avgSignal} dBm` : <span className={styles.signalEmpty}>—</span>}
        </span>
        <span className={styles.statHint}>
          {avgSignal !== null ? 'Average RSSI' : 'No clients'}
        </span>
      </StatCard>

      <StatCard icon={<Radio size={18} />} tone="info" label="Bands">
        <span className={styles.statValue}>
          {total > 0 ? (
            settings?.band?.toUpperCase()
          ) : (
            <span className={styles.signalEmpty}>—</span>
          )}
        </span>
        <span className={styles.statHint}>
          {total > 0 ? `${total} interface${total === 1 ? '' : 's'}` : 'No interfaces'}
        </span>
      </StatCard>
    </SectionGrid>
  );
}
