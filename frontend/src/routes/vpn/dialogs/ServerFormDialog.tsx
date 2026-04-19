import { useState } from 'react';
import { Button, Dialog, FieldRow, FieldStack, Input, Label, Select } from '@nasnet/ui';
import { getProtocolOptions, type VPNProtocol, type VPNServer } from '../../../api';

interface Props {
  value: Partial<VPNServer>;
  onCancel: () => void;
  onSave: (draft: Partial<VPNServer>) => void;
}

export function ServerFormDialog({ value, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState<Partial<VPNServer>>(value);
  return (
    <Dialog
      open
      onClose={onCancel}
      title="New VPN server"
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
            <span>Listen port</span>
            <Input
              value={String(draft.listenPort ?? '')}
              onChange={(e) =>
                setDraft((d) => ({ ...d, listenPort: Number(e.target.value) || undefined }))
              }
              aria-label="Listen port"
            />
          </Label>
          <Label>
            <span>IP pool</span>
            <Input
              value={draft.ipPool ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, ipPool: e.target.value }))}
              aria-label="IP pool"
            />
          </Label>
        </FieldRow>
      </FieldStack>
    </Dialog>
  );
}
