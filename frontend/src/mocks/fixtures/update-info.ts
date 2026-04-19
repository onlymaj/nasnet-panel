import type { AppUpdateInfo, FirmwareUpdateInfo } from '../types';

export const seededAppUpdate = (): AppUpdateInfo => ({
  currentVersion: '0.3.4',
  latestVersion: '0.4.0',
  changelog: [
    '- Router list & add wizard',
    '- Easy-mode configuration dashboard',
    '- WireGuard + L2TP IP-masking support',
  ].join('\n'),
  updateAvailable: true,
});

export const seededFirmwareUpdates = (): Record<string, FirmwareUpdateInfo> => ({
  rtr_ubud: {
    routerId: 'rtr_ubud',
    currentChannel: 'stable',
    currentVersion: '7.12.1',
    latestVersion: '7.14',
    updateAvailable: true,
  },
  rtr_tehran: {
    routerId: 'rtr_tehran',
    currentChannel: 'stable',
    currentVersion: '7.13.2',
    latestVersion: '7.13.2',
    updateAvailable: false,
  },
  rtr_basecamp: {
    routerId: 'rtr_basecamp',
    currentChannel: 'stable',
    currentVersion: '7.11',
    latestVersion: '7.14',
    updateAvailable: true,
  },
});
