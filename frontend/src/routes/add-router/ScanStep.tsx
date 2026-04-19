import { useEffect, useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Progress,
  Stack,
} from '@nasnet/ui';
import { api, type DiscoveredDevice } from '../../api';
import { ScanToolbar } from './ScanToolbar';

interface Props {
  onSelect: (device: DiscoveredDevice) => void;
}

const SCAN_COLUMNS = [
  { key: 'ip', header: 'IP', render: (d: DiscoveredDevice) => d.ip, width: '150px' },
  { key: 'mac', header: 'MAC', render: (d: DiscoveredDevice) => d.mac, width: '180px' },
  { key: 'model', header: 'Model', render: (d: DiscoveredDevice) => d.model },
  {
    key: 'version',
    header: 'RouterOS',
    render: (d: DiscoveredDevice) => d.version,
    width: '100px',
  },
];

export function ScanStep({ onSelect }: Props) {
  const [subnet, setSubnet] = useState('192.168.1.0/24');
  const [scanning, setScanning] = useState(false);
  const [percent, setPercent] = useState(0);
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);

  const startScan = async () => {
    setScanning(true);
    setPercent(0);
    setDevices([]);
    for await (const event of api.scanner.start(subnet)) {
      setPercent(event.percent);
      setDevices(event.found);
      if (event.done) break;
    }
    setScanning(false);
  };

  useEffect(() => {
    void startScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan your subnet</CardTitle>
        <CardDescription>
          Probing for MikroTik devices. Pick a result to continue with credentials.
        </CardDescription>
      </CardHeader>
      <Stack>
        <ScanToolbar
          subnet={subnet}
          scanning={scanning}
          onSubnetChange={setSubnet}
          onStart={startScan}
        />
        {scanning || percent > 0 ? (
          <Progress value={percent} label={`Scanning ${subnet}`} tone="success" />
        ) : null}
        <DataTable
          columns={SCAN_COLUMNS}
          rows={devices}
          rowKey={(d) => d.mac}
          onRowClick={onSelect}
          emptyMessage={scanning ? 'Scanning…' : 'No devices yet. Start a scan.'}
        />
      </Stack>
    </Card>
  );
}
