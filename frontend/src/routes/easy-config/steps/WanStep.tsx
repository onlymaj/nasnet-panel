import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldRow,
  Label,
  Select,
  Stack,
} from '@nasnet/ui';
import type { Interface } from '../../../api';
import type { Action, State } from '../state';
import { DomesticSection } from './wan/DomesticSection';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  interfaces: Interface[];
  footer?: React.ReactNode;
}

export function WanStep({ state, dispatch, interfaces, footer }: Props) {
  const ifaceOptions = [
    { value: '', label: 'Select an interface' },
    ...interfaces.map((i) => ({ value: i.name, label: i.name })),
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>WAN interfaces</CardTitle>
        <CardDescription>Tell us which ports are wired to each uplink.</CardDescription>
      </CardHeader>
      <Stack>
        <FieldRow>
          <Label>
            <span>Starlink WAN</span>
            <Select
              aria-label="Starlink WAN"
              value={state.starlinkInterface}
              onChange={(v) => dispatch({ type: 'setField', field: 'starlinkInterface', value: v })}
              options={ifaceOptions}
            />
          </Label>
          {state.mode === 'dual-link' ? (
            <Label>
              <span>Domestic WAN</span>
              <Select
                aria-label="Domestic WAN"
                value={state.domesticInterface}
                onChange={(v) =>
                  dispatch({ type: 'setField', field: 'domesticInterface', value: v })
                }
                options={ifaceOptions}
              />
            </Label>
          ) : null}
        </FieldRow>
        {state.mode === 'dual-link' ? <DomesticSection state={state} dispatch={dispatch} /> : null}
      </Stack>
      {footer}
    </Card>
  );
}
