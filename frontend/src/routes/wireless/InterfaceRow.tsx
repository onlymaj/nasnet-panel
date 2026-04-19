import { Wifi } from 'lucide-react';
import { Badge, Button, Inline, Switch } from '@nasnet/ui';
import type { Interface, WirelessSettings } from '../../api';
import styles from '../WirelessPage.module.scss';
import { cx, toneClass } from './utils';

interface Props {
  iface: Interface;
  settings: WirelessSettings;
  onToggle: (running: boolean) => void;
  onEdit: () => void;
}

export function InterfaceRow({ iface, settings, onToggle, onEdit }: Props) {
  return (
    <div className={styles.interfaceRow}>
      <div className={cx(styles.iconTone, toneClass('primary'))}>
        <Wifi size={14} />
      </div>
      <div>
        <strong>{settings.ssid}</strong>{' '}
        <span className={styles.interfaceName}>({iface.name})</span>
        <div>
          <Badge tone={iface.running ? 'success' : 'neutral'}>
            {iface.running ? 'enabled' : 'disabled'}
          </Badge>{' '}
          <Badge tone="neutral">{settings.security}</Badge>{' '}
          <Badge tone="neutral">{settings.band.toUpperCase()}</Badge>{' '}
          <Badge tone="neutral">{settings.countryCode}</Badge>
        </div>
      </div>
      <Inline $gap="12px">
        <Switch
          aria-label={`Enable ${iface.name}`}
          checked={iface.running}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <Button size="sm" variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </Inline>
    </div>
  );
}
