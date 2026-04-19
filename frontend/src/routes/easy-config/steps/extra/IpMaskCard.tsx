import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  RadioGroup,
  Stack,
  Switch,
} from '@nasnet/ui';
import type { Action, State } from '../../state';
import { IpMaskL2tpFields } from './IpMaskL2tpFields';
import { IpMaskWireguardFields } from './IpMaskWireguardFields';

const KIND_OPTIONS = [
  { value: 'wireguard', label: 'WireGuard', description: 'Modern, lightweight.' },
  { value: 'l2tp', label: 'L2TP', description: 'Wide compatibility.' },
];

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function IpMaskCard({ state, dispatch }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Starlink IP-masking VPN client</CardTitle>
        <CardDescription>
          Route Starlink traffic through a WireGuard or L2TP tunnel so traffic appears to originate
          elsewhere.
        </CardDescription>
      </CardHeader>
      <Stack>
        <Switch
          label="Enable Starlink IP-mask VPN"
          checked={state.ipMaskEnabled}
          onChange={(e) =>
            dispatch({ type: 'setField', field: 'ipMaskEnabled', value: e.target.checked })
          }
        />
        {state.ipMaskEnabled ? (
          <>
            <RadioGroup
              name="ip-mask-kind"
              ariaLabel="IP-mask protocol"
              value={state.ipMaskKind}
              orientation="row"
              options={KIND_OPTIONS}
              onChange={(v) =>
                dispatch({
                  type: 'setField',
                  field: 'ipMaskKind',
                  value: v as State['ipMaskKind'],
                })
              }
            />
            {state.ipMaskKind === 'wireguard' ? (
              <IpMaskWireguardFields state={state} dispatch={dispatch} />
            ) : (
              <IpMaskL2tpFields state={state} dispatch={dispatch} />
            )}
          </>
        ) : null}
      </Stack>
    </Card>
  );
}
