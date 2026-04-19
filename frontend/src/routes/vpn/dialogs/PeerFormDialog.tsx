import { useState } from 'react';
import { Button, Dialog, FieldStack, Input, Label } from '@nasnet/ui';
import type { VPNPeer } from '../../../api';

interface Props {
  onCancel: () => void;
  onSave: (draft: Partial<VPNPeer>) => void;
}

export function PeerFormDialog({ onCancel, onSave }: Props) {
  const [draft, setDraft] = useState<Partial<VPNPeer>>({ allowedIps: '10.8.0.2/32' });
  return (
    <Dialog
      open
      onClose={onCancel}
      title="New peer"
      size="sm"
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
        <Label>
          <span>Name</span>
          <Input
            value={draft.name ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            aria-label="Name"
          />
        </Label>
        <Label>
          <span>Allowed IPs</span>
          <Input
            value={draft.allowedIps ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, allowedIps: e.target.value }))}
            aria-label="Allowed IPs"
          />
        </Label>
      </FieldStack>
    </Dialog>
  );
}
