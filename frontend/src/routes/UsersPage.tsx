import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Dialog,
  FieldRow,
  FieldStack,
  Input,
  Label,
  PasswordInput,
  Select,
  Stack,
  useToast,
} from '@nasnet/ui';
import { UserPlus } from 'lucide-react';
import { api, type RouterUser, type RouterUserGroup } from '../api';

export function UsersPage() {
  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<RouterUser[]>([]);
  const [editing, setEditing] = useState<Partial<RouterUser> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toast = useToast();

  const reload = useCallback(async () => {
    if (!id) return;
    setUsers(await api.users.list(id));
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const onSave = async (draft: Partial<RouterUser>) => {
    if (!id) return;
    if (draft.id) {
      await api.users.update(draft.id, {
        name: draft.name,
        group: draft.group,
        disabled: draft.disabled,
      });
    } else {
      await api.users.create({
        routerId: id,
        name: draft.name ?? 'user',
        group: (draft.group ?? 'read') as RouterUserGroup,
        disabled: draft.disabled,
      });
    }
    setEditing(null);
    await reload();
    toast.notify({ title: 'User saved', tone: 'success' });
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await api.users.remove(deletingId);
    setDeletingId(null);
    await reload();
    toast.notify({ title: 'User deleted', tone: 'info' });
  };

  return (
    <Stack>
      <Card>
        <CardHeader
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <CardTitle>Router users</CardTitle>
            <CardDescription>
              Local RouterOS accounts. Groups: full (admin), write (configure), read (monitor only).
            </CardDescription>
          </div>
          <Button
            variant="success"
            onClick={() => setEditing({ group: 'read', disabled: false })}
            style={{ background: '#16a34a', borderColor: '#16a34a' }}
          >
            <UserPlus size={14} aria-hidden /> New user
          </Button>
        </CardHeader>
        <Stack>
          <DataTable
            columns={[
              { key: 'name', header: 'Username', render: (u) => u.name },
              { key: 'group', header: 'Group', render: (u) => u.group },
              {
                key: 'status',
                header: 'Status',
                render: (u) => (
                  <Badge tone={u.disabled ? 'warning' : 'success'}>
                    {u.disabled ? 'disabled' : 'enabled'}
                  </Badge>
                ),
              },
              {
                key: 'lastLogin',
                header: 'Last logged in',
                render: (u) => (u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '—'),
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (u) => (
                  <span style={{ display: 'inline-flex', gap: 8 }}>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(u)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeletingId(u.id)}>
                      Delete
                    </Button>
                  </span>
                ),
                width: '200px',
              },
            ]}
            rows={users}
            rowKey={(u) => u.id}
            emptyMessage="No users on this router yet."
          />
        </Stack>
      </Card>
      {editing ? (
        <UserFormDialog value={editing} onSave={onSave} onCancel={() => setEditing(null)} />
      ) : null}
      <ConfirmDialog
        open={!!deletingId}
        title="Delete router user"
        description="This removes the RouterOS account."
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </Stack>
  );
}

function UserFormDialog({
  value,
  onCancel,
  onSave,
}: {
  value: Partial<RouterUser>;
  onCancel: () => void;
  onSave: (draft: Partial<RouterUser>) => void;
}) {
  const [draft, setDraft] = useState<Partial<RouterUser> & { password?: string }>({
    ...value,
    password: '',
  });
  const isCreating = !value.id;
  const isDraftValid =
    !!draft.name?.trim() && !!draft.group && (!isCreating || !!draft.password?.trim());
  return (
    <Dialog
      open
      onClose={onCancel}
      title={value.id ? 'Edit user' : 'New user'}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="success"
            style={{ background: '#16a34a', borderColor: '#16a34a' }}
            disabled={!isDraftValid}
            onClick={() => onSave(draft)}
          >
            Save
          </Button>
        </>
      }
    >
      <FieldStack>
        <Label>
          <span>Username</span>
          <Input
            value={draft.name ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            aria-label="Username"
            readOnly={!isCreating}
            disabled={!isCreating}
          />
        </Label>
        <Label>
          <span>Password</span>
          <PasswordInput
            value={draft.password ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, password: e.target.value }))}
            aria-label="Password"
          />
        </Label>
        <FieldRow>
          <Label>
            <span>Group</span>
            <Select
              aria-label="Group"
              value={draft.group ?? 'read'}
              onChange={(v) => setDraft((d) => ({ ...d, group: v as RouterUserGroup }))}
              options={[
                { value: 'full', label: 'full' },
                { value: 'write', label: 'write' },
                { value: 'read', label: 'read' },
              ]}
            />
          </Label>
        </FieldRow>
        <Checkbox
          label="Disabled"
          checked={!!draft.disabled}
          onChange={(e) => setDraft((d) => ({ ...d, disabled: e.target.checked }))}
        />
      </FieldStack>
    </Dialog>
  );
}
