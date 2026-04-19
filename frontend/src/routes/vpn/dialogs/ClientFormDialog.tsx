import { useState } from 'react';
import { Button, Dialog, FieldRow, FieldStack, Input, Label, Select } from '@nasnet/ui';
import { getProtocolOptions, type VPNClient, type VPNProtocol } from '../../../api';

interface Props {
  value: Partial<VPNClient>;
  onCancel: () => void;
  onSave: (draft: Partial<VPNClient>) => void;
}

export function ClientFormDialog({ value, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState<Partial<VPNClient>>(value);
  return (
    <Dialog
      open
      onClose={onCancel}
      title={value.id ? 'Edit VPN client' : 'New VPN client'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save</Button>
        </>
      }
    >
      <FieldStack>
        <FieldRow>
          <Label>
            <span>Name</span>
            <Input
              value={draft.name ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              aria-label="Name"
            />
          </Label>
          <Label>
            <span>Protocol</span>
            <Select
              aria-label="Protocol"
              value={draft.protocol ?? 'wireguard'}
              onChange={(v) => setDraft((d) => ({ ...d, protocol: v as VPNProtocol }))}
              options={getProtocolOptions().map((p) => ({ value: p, label: p }))}
            />
          </Label>
        </FieldRow>
        <FieldRow>
          <Label>
            <span>Endpoint host</span>
            <Input
              value={draft.endpoint ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, endpoint: e.target.value }))}
              aria-label="Endpoint host"
            />
          </Label>
          <Label>
            <span>Endpoint port</span>
            <Input
              value={String(draft.endpointPort ?? '')}
              onChange={(e) =>
                setDraft((d) => ({ ...d, endpointPort: Number(e.target.value) || undefined }))
              }
              aria-label="Endpoint port"
            />
          </Label>
        </FieldRow>
      </FieldStack>
    </Dialog>
  );
}
