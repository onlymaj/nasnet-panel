import React from 'react';
import { FieldRow, Input, Label, PasswordInput } from '@nasnet/ui';
import type { Action, WizardState } from './state';

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<Action>;
  onSubmit: () => void;
  canSubmit: boolean;
}

export function TargetFields({ state, dispatch, onSubmit, canSubmit }: Props) {
  return (
    <>
      <FieldRow>
        <Label>
          <span>Display name</span>
          <Input
            value={state.name}
            onChange={(e) => dispatch({ type: 'setField', field: 'name', value: e.target.value })}
            aria-label="Display name"
          />
        </Label>
        <Label>
          <span>IP address</span>
          <Input
            value={state.host}
            onChange={(e) => dispatch({ type: 'setField', field: 'host', value: e.target.value })}
            placeholder="192.168.1.1"
            aria-label="IP address"
          />
        </Label>
      </FieldRow>
      <FieldRow>
        <Label>
          <span>Username</span>
          <Input
            value={state.username}
            onChange={(e) =>
              dispatch({ type: 'setField', field: 'username', value: e.target.value })
            }
            autoComplete="username"
            aria-label="Username"
          />
        </Label>
        <Label>
          <span>Password</span>
          <PasswordInput
            value={state.password}
            onChange={(e) =>
              dispatch({ type: 'setField', field: 'password', value: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) onSubmit();
            }}
            autoComplete="current-password"
            aria-label="Password"
          />
        </Label>
      </FieldRow>
    </>
  );
}
