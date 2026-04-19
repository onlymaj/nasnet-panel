import React from 'react';
import { Stack } from '@nasnet/ui';
import type { Action, State } from '../state';
import { IpMaskCard } from './extra/IpMaskCard';
import { VpnServerCard } from './extra/VpnServerCard';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  footer?: React.ReactNode;
}

export function ExtraStep({ state, dispatch, footer }: Props) {
  return (
    <Stack>
      <IpMaskCard state={state} dispatch={dispatch} />
      <VpnServerCard state={state} dispatch={dispatch} />
      {footer}
    </Stack>
  );
}
