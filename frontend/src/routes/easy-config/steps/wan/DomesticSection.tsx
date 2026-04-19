import React from 'react';
import { FieldStack, RadioGroup } from '@nasnet/ui';
import type { Action, State } from '../../state';
import { PppoeFields } from './PppoeFields';
import { StaticFields } from './StaticFields';

const DOMESTIC_MODE_OPTIONS = [
  { value: 'dhcp', label: 'DHCP', description: 'Auto-config from ISP.' },
  { value: 'static', label: 'Static', description: 'Manually assign IPs.' },
  { value: 'pppoe', label: 'PPPoE', description: 'Username + password.' },
];

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function DomesticSection({ state, dispatch }: Props) {
  return (
    <FieldStack>
      <RadioGroup
        name="easy-config-domestic-mode"
        ariaLabel="Domestic connection type"
        value={state.domesticMode}
        orientation="row"
        options={DOMESTIC_MODE_OPTIONS}
        onChange={(v) =>
          dispatch({
            type: 'setField',
            field: 'domesticMode',
            value: v as State['domesticMode'],
          })
        }
      />
      {state.domesticMode === 'pppoe' ? <PppoeFields state={state} dispatch={dispatch} /> : null}
      {state.domesticMode === 'static' ? <StaticFields state={state} dispatch={dispatch} /> : null}
    </FieldStack>
  );
}
