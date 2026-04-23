import { simulateLatency } from '../simulate-latency';
import type { Interface } from '../types';
import { clone, commit, state } from './store';

export const system = {
  async listInterfaces(routerId: string): Promise<Interface[]> {
    await simulateLatency(50, 150);
    return clone(state.current.interfaces[routerId] ?? []);
  },
  async setInterfaceRunning(
    routerId: string,
    name: string,
    running: boolean,
  ): Promise<Interface | undefined> {
    await simulateLatency(50, 150);
    const list = state.current.interfaces[routerId];
    if (!list) return undefined;
    const idx = list.findIndex((i) => i.name === name);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], running };
    commit();
    return clone(list[idx]);
  },
};
