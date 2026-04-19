import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@nasnet/ui';
import { api, type Router } from '../../api';
import { useRouterStore } from '../../state/RouterStoreContext';
import { useSession } from '../../state/SessionContext';
import { isRequired } from '../../utils/validators';
import { buildDefaultBaseConfig } from '../../utils/rsc-builder';
import type { Action, WizardState } from './state';

export function useAddRouter(state: WizardState, dispatch: React.Dispatch<Action>) {
  const navigate = useNavigate();
  const toast = useToast();
  const { upsertRouter, markConnected, markConfigurationApplied } = useRouterStore();
  const { setCredentials } = useSession();

  const finishAndNavigate = useCallback(
    async (router: Router) => {
      upsertRouter(router);
      markConnected(router.id);
      setCredentials(router.id, { username: state.username, password: state.password });
      try {
        await api.batch.applyConfig(buildDefaultBaseConfig());
        const updated = await api.routers.markConfigurationApplied(router.id);
        if (updated) {
          markConfigurationApplied(router.id, updated.configurationAppliedAt);
          upsertRouter(updated);
        }
        toast.notify({ title: 'Default configuration applied', tone: 'success' });
      } catch {
        toast.notify({ title: 'Default config failed', tone: 'warning' });
      }
      navigate(`/router/${router.id}`);
    },
    [
      markConfigurationApplied,
      markConnected,
      navigate,
      setCredentials,
      state.password,
      state.username,
      toast,
      upsertRouter,
    ],
  );

  const onConnect = useCallback(async () => {
    if (!isRequired(state.username) || !isRequired(state.password)) {
      dispatch({ type: 'error', message: 'Username and password are required.' });
      return;
    }
    dispatch({ type: 'applying', value: true });
    try {
      await api.routers.testCredentials({
        host: state.host,
        username: state.username,
        password: state.password,
      });
      const router = await api.routers.add({
        name: state.name || `Router at ${state.host}`,
        host: state.host,
        port: 443,
        username: state.username,
        password: state.password,
      });
      await finishAndNavigate(router);
    } catch (err) {
      dispatch({ type: 'error', message: (err as Error).message ?? 'Connection failed' });
    } finally {
      dispatch({ type: 'applying', value: false });
    }
  }, [dispatch, finishAndNavigate, state.host, state.name, state.password, state.username]);

  return { onConnect };
}
