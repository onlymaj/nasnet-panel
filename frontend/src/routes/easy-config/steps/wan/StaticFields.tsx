import React from 'react';
import { FieldRow, Input, Label } from '@nasnet/ui';
import type { Action, State } from '../../state';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function StaticFields({ state, dispatch }: Props) {
  return (
    <FieldRow>
      <Label>
        <span>IP address</span>
        <Input
          value={state.staticIp}
          placeholder="192.168.1.2/24"
          onChange={(e) => dispatch({ type: 'setField', field: 'staticIp', value: e.target.value })}
          aria-label="Static IP"
        />
      </Label>
      <Label>
        <span>Gateway</span>
        <Input
          value={state.staticGateway}
          onChange={(e) =>
            dispatch({ type: 'setField', field: 'staticGateway', value: e.target.value })
          }
          aria-label="Static gateway"
        />
      </Label>
      <Label>
        <span>DNS</span>
        <Input
          value={state.staticDns}
          onChange={(e) =>
            dispatch({ type: 'setField', field: 'staticDns', value: e.target.value })
          }
          aria-label="Static DNS"
        />
      </Label>
    </FieldRow>
  );
}
