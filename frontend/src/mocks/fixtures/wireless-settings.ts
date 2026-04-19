import type { WirelessSettings } from '../types';

export const seededWireless = (): Record<string, WirelessSettings> => ({
  rtr_ubud: {
    ssid: 'Nasnet-Ubud',
    password: 'supersecret123',
    security: 'WPA2-PSK',
    band: '5ghz',
    countryCode: 'ID',
    hidden: false,
  },
  rtr_tehran: {
    ssid: 'Nasnet-Tehran',
    password: 'supersecret456',
    security: 'WPA2-PSK',
    band: '2.4ghz',
    countryCode: 'IR',
    hidden: false,
  },
  rtr_basecamp: {
    ssid: 'Nasnet-Basecamp',
    password: 'supersecret789',
    security: 'WPA2-PSK',
    band: '2.4ghz',
    countryCode: 'US',
    hidden: true,
  },
});
