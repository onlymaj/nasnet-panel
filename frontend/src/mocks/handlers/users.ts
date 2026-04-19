import { simulateLatency } from '../simulate-latency';
import type { RouterUser, RouterUserGroup } from '../types';
import { clone, commit, nextId, state } from './store';

export const users = {
  async list(routerId: string): Promise<RouterUser[]> {
    await simulateLatency(50, 150);
    return clone(state.current.routerUsers.filter((u) => u.routerId === routerId));
  },
  async create(input: {
    routerId: string;
    name: string;
    group: RouterUserGroup;
    disabled?: boolean;
  }): Promise<RouterUser> {
    await simulateLatency();
    const user: RouterUser = {
      id: nextId('usr'),
      routerId: input.routerId,
      name: input.name,
      group: input.group,
      disabled: input.disabled ?? false,
    };
    state.current.routerUsers.push(user);
    commit();
    return clone(user);
  },
  async update(id: string, patch: Partial<RouterUser>): Promise<RouterUser | undefined> {
    await simulateLatency();
    const list = state.current.routerUsers;
    const idx = list.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...patch };
    commit();
    return clone(list[idx]);
  },
  async remove(id: string): Promise<void> {
    await simulateLatency();
    state.current.routerUsers = state.current.routerUsers.filter((u) => u.id !== id);
    commit();
  },
};
