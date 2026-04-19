import type { DiscoveredDevice } from '../types';

export const deterministicScanDevices = (): DiscoveredDevice[] => [
  {
    ip: '192.168.1.1',
    mac: '4C:5E:0C:11:22:33',
    vendor: 'MikroTik',
    model: 'RB4011iGS+',
    version: '7.14',
  },
  {
    ip: '192.168.1.23',
    mac: '4C:5E:0C:44:55:66',
    vendor: 'MikroTik',
    model: 'hAP ax3',
    version: '7.13.2',
  },
  {
    ip: '192.168.1.99',
    mac: 'B8:69:F4:77:88:99',
    vendor: 'MikroTik',
    model: 'RB5009UG+S+IN',
    version: '7.14',
  },
];
