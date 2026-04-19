import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldRow,
  Input,
  Label,
  PasswordInput,
  Select,
} from '@nasnet/ui';
import type { Action, State } from '../state';

const BAND_OPTIONS = [
  { value: '2.4ghz', label: '2.4 GHz' },
  { value: '5ghz', label: '5 GHz' },
];

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  footer?: React.ReactNode;
}

export function LanStep({ state, dispatch, footer }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wireless LAN</CardTitle>
        <CardDescription>SSID and password for your wireless network.</CardDescription>
      </CardHeader>
      <FieldRow>
        <Label>
          <span>SSID</span>
          <Input
            value={state.ssid}
            onChange={(e) => dispatch({ type: 'setField', field: 'ssid', value: e.target.value })}
            aria-label="SSID"
          />
        </Label>
        <Label>
          <span>Password</span>
          <PasswordInput
            value={state.wifiPassword}
            onChange={(e) =>
              dispatch({ type: 'setField', field: 'wifiPassword', value: e.target.value })
            }
            aria-label="Password"
          />
        </Label>
        <Label>
          <span>Band</span>
          <Select
            aria-label="Band"
            value={state.band}
            onChange={(v) =>
              dispatch({ type: 'setField', field: 'band', value: v as State['band'] })
            }
            options={BAND_OPTIONS}
          />
        </Label>
      </FieldRow>
      {footer}
    </Card>
  );
}
