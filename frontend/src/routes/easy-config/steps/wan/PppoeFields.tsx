import React from 'react';
import { FieldRow, Input, Label, PasswordInput } from '@nasnet/ui';
import type { Action, State } from '../../state';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function PppoeFields({ state, dispatch }: Props) {
  return (
    <FieldRow>
      <Label>
        <span>PPPoE username</span>
        <Input
          value={state.pppoeUser}
          onChange={(e) =>
            dispatch({ type: 'setField', field: 'pppoeUser', value: e.target.value })
          }
          aria-label="PPPoE username"
        />
      </Label>
      <Label>
        <span>PPPoE password</span>
        <PasswordInput
          value={state.pppoePassword}
          onChange={(e) =>
            dispatch({ type: 'setField', field: 'pppoePassword', value: e.target.value })
          }
          aria-label="PPPoE password"
        />
      </Label>
    </FieldRow>
  );
}
