import { simulateLatency } from '../simulate-latency';
import type { WirelessClient, WirelessSettings } from '../types';
import { clone, commit, state } from './store';

export const wireless = {
  async get(routerId: string): Promise<WirelessSettings> {
    await simulateLatency(50, 150);
    return clone(
      state.current.wireless[routerId] ?? {
        ssid: 'Nasnet',
        password: 'changeme123',
        security: 'WPA2-PSK',
        band: '5ghz',
        countryCode: 'US',
        hidden: false,
      },
    );
  },
  async update(routerId: string, settings: WirelessSettings): Promise<WirelessSettings> {
    await simulateLatency();
    state.current.wireless[routerId] = { ...settings };
    commit();
    return clone(settings);
  },
  async listClients(routerId: string): Promise<WirelessClient[]> {
    await simulateLatency(50, 150);
    return clone(state.current.wirelessClients[routerId] ?? []);
  },
};
