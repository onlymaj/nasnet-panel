import { Button, DataTable } from '@nasnet/ui';
import type { VPNPeer } from '../../../api';

interface Props {
  rows: VPNPeer[];
  hasServer: boolean;
  onDelete: (id: string) => void;
}

export function PeersTable({ rows, hasServer, onDelete }: Props) {
  return (
    <DataTable
      columns={[
        { key: 'name', header: 'Name', render: (p: VPNPeer) => p.name },
        { key: 'allowed', header: 'Allowed IPs', render: (p: VPNPeer) => p.allowedIps },
        {
          key: 'actions',
          header: 'Actions',
          render: (p: VPNPeer) => (
            <Button size="sm" variant="danger" onClick={() => onDelete(p.id)}>
              Delete
            </Button>
          ),
        },
      ]}
      rows={rows}
      rowKey={(p) => p.id}
      emptyMessage={hasServer ? 'No peers yet.' : 'Add a VPN server first.'}
    />
  );
}
