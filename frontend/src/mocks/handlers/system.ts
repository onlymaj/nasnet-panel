import { simulateLatency } from '../simulate-latency';
import type { Interface, ResourceSample, SystemOverview, TopClient, TrafficSample } from '../types';
import { clone, commit, state } from './store';

export const system = {
  async overview(routerId: string): Promise<SystemOverview> {
    await simulateLatency(50, 150);
    const store = state.current;
    const router = store.routers.find((r) => r.id === routerId);
    const interfaces = store.interfaces[routerId] ?? [];
    const vpnTunnels =
      store.vpnClients.filter((c) => c.routerId === routerId && c.enabled).length +
      store.vpnServers.filter((s) => s.routerId === routerId && s.running).length;
    const idx = Math.max(1, store.routers.findIndex((r) => r.id === routerId) + 1);
    return {
      routerId,
      model: router?.model ?? 'unknown',
      version: router?.version ?? 'unknown',
      serial: `NN${String(idx).padStart(4, '0')}-${routerId.slice(-4).toUpperCase()}`,
      uptime: '1d 2h 14m',
      cpuLoad: 18 + ((idx * 3) % 40),
      memoryUsed: 180 + ((idx * 31) % 400),
      memoryTotal: 1024,
      temperatureC: 42 + ((idx * 2) % 10),
      interfaceCount: interfaces.length,
      dhcpLeases: 7 + ((idx * 11) % 23),
      vpnTunnels,
    };
  },
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
  async trafficHistory(routerId: string): Promise<TrafficSample[]> {
    await simulateLatency(40, 120);
    const now = Date.now();
    const samples: TrafficSample[] = [];
    for (let i = 29; i >= 0; i--) {
      const t = now - i * 10_000;
      const base = 2400 + ((i * 137 + routerId.length * 11) % 800);
      const spike = (i + routerId.length) % 6 === 0 ? 900 : 0;
      samples.push({
        t,
        rxKbps: base + spike,
        txKbps: Math.round(base * 0.35) + (i % 5 === 0 ? 300 : 0),
      });
    }
    return samples;
  },
  async resourceHistory(routerId: string): Promise<ResourceSample[]> {
    await simulateLatency(40, 120);
    const now = Date.now();
    const samples: ResourceSample[] = [];
    for (let i = 29; i >= 0; i--) {
      const t = now - i * 10_000;
      const cpu = Math.min(95, 15 + ((i * 7 + routerId.length) % 55));
      const memoryPct = Math.min(95, 30 + ((i * 3 + routerId.length * 2) % 40));
      samples.push({ t, cpu, memoryPct });
    }
    return samples;
  },
  async topClients(routerId: string): Promise<TopClient[]> {
    await simulateLatency(40, 120);
    const seed = routerId.length;
    return [
      {
        ip: '192.168.88.42',
        hostname: 'macbook-air',
        mac: 'B8:E9:FE:00:00:01',
        totalKbps: 1240 + seed * 5,
      },
      {
        ip: '192.168.88.51',
        hostname: 'appletv-3',
        mac: 'B8:E9:FE:00:00:02',
        totalKbps: 980 + seed * 3,
      },
      { ip: '192.168.88.22', hostname: 'iphone-lina', mac: 'B8:E9:FE:00:00:03', totalKbps: 620 },
      {
        ip: '192.168.88.19',
        hostname: 'shelly-kitchen',
        mac: 'B8:E9:FE:00:00:04',
        totalKbps: 88,
      },
      {
        ip: '192.168.88.12',
        hostname: 'nas-attic',
        mac: 'B8:E9:FE:00:00:05',
        totalKbps: 2870 + seed * 9,
      },
    ].sort((a, b) => b.totalKbps - a.totalKbps);
  },
};
