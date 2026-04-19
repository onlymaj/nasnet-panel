import { Badge, DataTable } from '@nasnet/ui';
import type { VPNServer } from '../../../api';

interface Props {
  rows: VPNServer[];
  totalRows: number;
}

export function ServersTable({ rows, totalRows }: Props) {
  return (
    <DataTable
      columns={[
        { key: 'name', header: 'Name', render: (s: VPNServer) => s.name },
        {
          key: 'protocol',
          header: 'Protocol',
          render: (s: VPNServer) => <Badge tone="info">{s.protocol.toUpperCase()}</Badge>,
        },
        {
          key: 'status',
          header: 'Status',
          render: (s: VPNServer) => (
            <Badge tone={s.running ? 'success' : 'neutral'}>
              {s.running ? 'Running' : 'Disabled'}
            </Badge>
          ),
        },
        { key: 'port', header: 'Port', render: (s: VPNServer) => s.listenPort || '–' },
        { key: 'pool', header: 'IP pool', render: (s: VPNServer) => s.ipPool || '–' },
      ]}
      rows={rows}
      rowKey={(s) => s.id}
      emptyMessage={
        totalRows ? 'No servers match the current filters.' : 'No VPN servers configured.'
      }
    />
  );
}
