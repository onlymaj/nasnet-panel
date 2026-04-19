import { RefreshCw, Wifi } from 'lucide-react';
import { Button, Card, CardDescription, CardHeader, CardTitle } from '@nasnet/ui';
import type { Interface, WirelessSettings } from '../../api';
import styles from '../WirelessPage.module.scss';
import { InterfaceRow } from './InterfaceRow';

interface Props {
  interfaces: Interface[];
  settings: WirelessSettings | null;
  restarting: boolean;
  onRestart: () => void;
  onToggle: (ifaceName: string, running: boolean) => void;
  onEdit: () => void;
}

export function InterfacesCard({
  interfaces,
  settings,
  restarting,
  onRestart,
  onToggle,
  onEdit,
}: Props) {
  const total = interfaces.length;
  return (
    <Card>
      <CardHeader className={styles.cardHeaderRow}>
        <div>
          <CardTitle>Wireless Interfaces</CardTitle>
          <CardDescription>SSID, password, band, and security.</CardDescription>
        </div>
        <Button variant="secondary" onClick={onRestart} disabled={restarting}>
          <RefreshCw size={14} aria-hidden /> Restart WiFi
        </Button>
      </CardHeader>
      {settings && total > 0 ? (
        <div className={styles.interfaceGrid}>
          {interfaces.map((iface) => (
            <InterfaceRow
              key={iface.name}
              iface={iface}
              settings={settings}
              onToggle={(running) => onToggle(iface.name, running)}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyBlock}>
          <Wifi size={28} aria-hidden />
          <span>No wireless interfaces found</span>
        </div>
      )}
    </Card>
  );
}
