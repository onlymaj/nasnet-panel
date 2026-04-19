import { Badge, Button, DataTable, Switch } from '@nasnet/ui';
import { api, type VPNClient } from '../../../api';

interface Props {
  rows: VPNClient[];
  totalRows: number;
  onEdit: (client: VPNClient) => void;
  onDelete: (id: string) => void;
  onToggled: () => void;
}

export function ClientsTable({ rows, totalRows, onEdit, onDelete, onToggled }: Props) {
  return (
    <DataTable
      columns={[
        { key: 'name', header: 'Name', render: (c: VPNClient) => c.name },
        {
          key: 'protocol',
          header: 'Protocol',
          render: (c: VPNClient) => <Badge tone="info">{c.protocol.toUpperCase()}</Badge>,
        },
        {
          key: 'enabled',
          header: 'Enabled',
          render: (c: VPNClient) => (
            <Switch
              aria-label="Enabled"
              checked={c.enabled}
              onChange={async (e) => {
                await api.vpn.updateClient(c.id, { enabled: e.target.checked });
                onToggled();
              }}
            />
          ),
          width: '120px',
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (c: VPNClient) => (
            <span style={{ display: 'inline-flex', gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={() => onEdit(c)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(c.id)}>
                Delete
              </Button>
            </span>
          ),
          width: '200px',
        },
      ]}
      rows={rows}
      rowKey={(c) => c.id}
      emptyMessage={totalRows ? 'No clients match the current filters.' : 'No VPN clients yet.'}
    />
  );
}
