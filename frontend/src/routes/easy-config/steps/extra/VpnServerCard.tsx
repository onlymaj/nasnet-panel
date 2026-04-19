import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle, Stack, Switch } from '@nasnet/ui';
import type { Action, State } from '../../state';
import { VpnServerFields } from './VpnServerFields';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function VpnServerCard({ state, dispatch }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>VPN server</CardTitle>
        <CardDescription>Run this router as a VPN server for remote clients.</CardDescription>
      </CardHeader>
      <Stack>
        <Switch
          label="Enable VPN listener"
          checked={state.vpnServerEnabled}
          onChange={(e) =>
            dispatch({ type: 'setField', field: 'vpnServerEnabled', value: e.target.checked })
          }
        />
        {state.vpnServerEnabled ? <VpnServerFields state={state} dispatch={dispatch} /> : null}
      </Stack>
    </Card>
  );
}
