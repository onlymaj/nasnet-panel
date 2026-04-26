import { Card, Stack } from '@nasnet/ui';
import type { VPNClient, VPNCredentials } from '../../../api';
// import { useState } from 'react';
// import { ConfirmDialog } from '@nasnet/ui';
// import { ClientFormDialog } from '../dialogs/ClientFormDialog';
// import { useClientActions } from '../hooks/useClientActions';
import { PaginationControls } from '../PaginationControls';
import { usePagedFilter } from '../hooks/usePagedFilter';
import { PAGE_SIZE } from '../utils';
import { ClientsTable } from './ClientsTable';
import { SectionHeader } from './SectionHeader';

const matches = (c: VPNClient, q: string) =>
  c.name.toLowerCase().includes(q) ||
  (c.endpoint ?? '').toLowerCase().includes(q) ||
  (c.username ?? '').toLowerCase().includes(q) ||
  (c.comment ?? '').toLowerCase().includes(q);

interface Props {
  routerId: string;
  creds: VPNCredentials | null;
  clients: VPNClient[];
  onChanged: () => void;
}

export function ClientsSection({ creds, clients, onChanged }: Props) {
  const paged = usePagedFilter(clients, matches);
  // Add/Edit/Delete are hidden until the backend exposes create/delete endpoints.
  // const [editing, setEditing] = useState<Partial<VPNClient> | null>(null);
  // const [deletingId, setDeletingId] = useState<string | null>(null);
  // const actions = useClientActions(routerId, onChanged);

  // const onSave = async (draft: Partial<VPNClient>) => {
  //   await actions.save(draft);
  //   setEditing(null);
  // };

  // const onConfirmDelete = async () => {
  //   if (!deletingId) return;
  //   await actions.remove(deletingId);
  //   setDeletingId(null);
  // };

  return (
    <Stack>
      <Card>
        <SectionHeader
          title="VPN Clients"
          count={clients.length}
          description="Outbound VPN interfaces (WireGuard, L2TP, OpenVPN, PPTP, SSTP, IKEv2)."
          search={{
            value: paged.search,
            placeholder: 'Search clients…',
            ariaLabel: 'Search clients',
            onChange: paged.setSearch,
          }}
          // action={{
          //   label: 'Add client',
          //   onClick: () => setEditing({ protocol: 'wireguard', enabled: true }),
          // }}
        />
        <div style={{ marginTop: 16 }}>
          <ClientsTable
            rows={paged.pagedRows}
            totalRows={clients.length}
            creds={creds}
            onToggled={onChanged}
            // onEdit={setEditing}
            // onDelete={setDeletingId}
          />
          <PaginationControls
            page={paged.page}
            totalPages={paged.totalPages}
            total={paged.filteredCount}
            pageSize={PAGE_SIZE}
            onPrev={paged.onPrev}
            onNext={paged.onNext}
          />
        </div>
      </Card>
      {/* {editing ? (
        <ClientFormDialog value={editing} onCancel={() => setEditing(null)} onSave={onSave} />
      ) : null}
      <ConfirmDialog
        open={!!deletingId}
        title="Delete VPN client"
        destructive
        onConfirm={onConfirmDelete}
        onCancel={() => setDeletingId(null)}
      /> */}
    </Stack>
  );
}
