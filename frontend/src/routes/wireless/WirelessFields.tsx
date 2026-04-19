import { FieldRow, FieldStack, Input, Label, PasswordInput, Select, Switch } from '@nasnet/ui';
import type { WirelessSettings } from '../../api';
import styles from '../WirelessPage.module.scss';

const SECURITY_OPTIONS = [
  { value: 'WPA2-PSK', label: 'WPA2-PSK' },
  { value: 'WPA3-PSK', label: 'WPA3-PSK' },
  { value: 'open', label: 'Open' },
];

const BAND_OPTIONS = [
  { value: '2.4ghz', label: '2.4 GHz' },
  { value: '5ghz', label: '5 GHz' },
];

interface Props {
  draft: WirelessSettings;
  onPatch: <K extends keyof WirelessSettings>(key: K, value: WirelessSettings[K]) => void;
}

export function WirelessFields({ draft, onPatch }: Props) {
  return (
    <FieldStack>
      <FieldRow>
        <Label>
          <span>SSID</span>
          <Input
            value={draft.ssid}
            onChange={(e) => onPatch('ssid', e.target.value)}
            aria-label="SSID"
          />
        </Label>
        <Label>
          <span>Password</span>
          <PasswordInput
            value={draft.password}
            onChange={(e) => onPatch('password', e.target.value)}
            aria-label="Password"
          />
        </Label>
      </FieldRow>
      <FieldRow>
        <Label>
          <span>Security</span>
          <Select
            aria-label="Security"
            value={draft.security}
            onChange={(v) => onPatch('security', v as WirelessSettings['security'])}
            options={SECURITY_OPTIONS}
          />
        </Label>
        <Label>
          <span>Band</span>
          <Select
            aria-label="Band"
            value={draft.band}
            onChange={(v) => onPatch('band', v as WirelessSettings['band'])}
            options={BAND_OPTIONS}
          />
        </Label>
        <Label>
          <span>Country code</span>
          <Input
            value={draft.countryCode}
            onChange={(e) => onPatch('countryCode', e.target.value)}
            aria-label="Country code"
          />
        </Label>
        <Label as="div" className={styles.hiddenToggle}>
          <span>Hide network</span>
          <Switch
            aria-label="Hide network from broadcast"
            checked={draft.hidden}
            onChange={(e) => onPatch('hidden', e.target.checked)}
          />
        </Label>
      </FieldRow>
    </FieldStack>
  );
}
