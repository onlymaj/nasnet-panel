import { simulateLatency } from '../simulate-latency';
import type { AppUpdateInfo, FirmwareUpdateInfo } from '../types';
import { clone, commit, state } from './store';

export const updates = {
  async checkApp(): Promise<AppUpdateInfo> {
    await simulateLatency(50, 150);
    return clone(state.current.appUpdate);
  },
  async *installApp(): AsyncGenerator<number, void, void> {
    const steps = [10, 25, 55, 80, 100];
    for (const pct of steps) {
      await simulateLatency(80, 200);
      yield pct;
    }
    state.current.appUpdate = {
      ...state.current.appUpdate,
      currentVersion: state.current.appUpdate.latestVersion,
      updateAvailable: false,
    };
    commit();
  },
  async checkFirmware(routerId: string): Promise<FirmwareUpdateInfo> {
    await simulateLatency(50, 150);
    return clone(
      state.current.firmware[routerId] ?? {
        routerId,
        currentChannel: 'stable',
        currentVersion: 'unknown',
        latestVersion: 'unknown',
        updateAvailable: false,
      },
    );
  },
  async *installFirmware(routerId: string): AsyncGenerator<number, void, void> {
    const steps = [15, 40, 70, 100];
    for (const pct of steps) {
      await simulateLatency(80, 200);
      yield pct;
    }
    const info = state.current.firmware[routerId];
    if (info) {
      state.current.firmware[routerId] = {
        ...info,
        currentVersion: info.latestVersion,
        updateAvailable: false,
      };
      commit();
    }
  },
};
