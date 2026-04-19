import { useReducer } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Radar } from 'lucide-react';
import { Button, PageActions, PageHeader, PageShell, PageSubtitle, PageTitle } from '@nasnet/ui';
import { ScanStep } from './add-router/ScanStep';
import { TargetStep } from './add-router/TargetStep';
import { CredentialsDialog } from './add-router/CredentialsDialog';
import { useAddRouter } from './add-router/useAddRouter';
import { initialState, reducer, type Mode } from './add-router/state';

export function AddRouterWizard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const requestedMode: Mode = params.get('mode') === 'scan' ? 'scan' : 'manual';
  const [state, dispatch] = useReducer(reducer, initialState(requestedMode));
  const { onConnect } = useAddRouter(state, dispatch);

  return (
    <PageShell>
      <PageHeader>
        <div>
          <PageTitle>Add router</PageTitle>
          <PageSubtitle>Scan the network or add a router manually.</PageSubtitle>
        </div>
        <PageActions>
          <Button variant="secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={16} aria-hidden /> Back
          </Button>
          {state.mode === 'scan' ? (
            <Button variant="success" onClick={() => navigate('/routers/new?mode=manual')}>
              <Plus size={16} aria-hidden /> Add manually
            </Button>
          ) : (
            <Button variant="success" onClick={() => navigate('/routers/new?mode=scan')}>
              <Radar size={16} aria-hidden /> Scan network
            </Button>
          )}
        </PageActions>
      </PageHeader>

      {state.mode === 'scan' ? (
        <ScanStep onSelect={(device) => dispatch({ type: 'pickDevice', device })} />
      ) : (
        <TargetStep
          state={state}
          dispatch={dispatch}
          onBack={() => navigate('/')}
          onConnect={onConnect}
        />
      )}

      <CredentialsDialog state={state} dispatch={dispatch} onConnect={onConnect} />
    </PageShell>
  );
}
