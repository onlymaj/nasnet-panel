import { simulateLatency } from '../simulate-latency';
import type { LogEntry, LogLevel } from '../types';
import { clone, commit, nextId, state } from './store';

export const logs = {
  async list(
    routerId: string,
    opts?: { level?: LogLevel | 'all'; topic?: string; search?: string; limit?: number },
  ): Promise<LogEntry[]> {
    await simulateLatency(40, 120);
    const level = opts?.level ?? 'all';
    const topic = opts?.topic ?? '';
    const search = (opts?.search ?? '').toLowerCase();
    const limit = opts?.limit ?? 200;
    const filtered = state.current.logs
      .filter((l) => l.routerId === routerId)
      .filter((l) => (level === 'all' ? true : l.level === level))
      .filter((l) => (topic ? l.topic === topic : true))
      .filter((l) => (search ? `${l.message} ${l.topic}`.toLowerCase().includes(search) : true))
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      .slice(0, limit);
    return clone(filtered);
  },
  async topics(routerId: string): Promise<string[]> {
    await simulateLatency(30, 90);
    const set = new Set<string>();
    for (const l of state.current.logs) {
      if (l.routerId === routerId) set.add(l.topic);
    }
    return [...set].sort();
  },
  append(routerId: string, input: { level: LogLevel; topic: string; message: string }): LogEntry {
    const entry: LogEntry = {
      id: nextId('log'),
      routerId,
      ts: new Date().toISOString(),
      level: input.level,
      topic: input.topic,
      message: input.message,
    };
    state.current.logs.unshift(entry);
    commit();
    return clone(entry);
  },
};
