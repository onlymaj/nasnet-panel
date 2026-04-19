import { isCIDR, isIPv4, isPort, isRequired, isSsid, isWifiPassword } from '../../utils/validators';
import type { State } from './state';

export function canAdvance(state: State): string | null {
  switch (state.currentStep) {
    case 'mode':
      return state.mode ? null : 'Pick a mode to continue.';
    case 'wan':
      if (!isRequired(state.starlinkInterface)) return 'Select the Starlink interface.';
      if (state.mode === 'dual-link') {
        if (!isRequired(state.domesticInterface)) return 'Select the domestic interface.';
        if (state.domesticMode === 'pppoe') {
          if (!isRequired(state.pppoeUser) || !isRequired(state.pppoePassword)) {
            return 'PPPoE credentials are required.';
          }
        }
        if (state.domesticMode === 'static' && !isIPv4(state.staticIp.split('/')[0] ?? '')) {
          return 'Provide a valid static IP.';
        }
      }
      return null;
    case 'lan':
      if (!isSsid(state.ssid)) return 'SSID is required.';
      if (!isWifiPassword(state.wifiPassword)) return 'Wi-Fi password must be 8–63 characters.';
      return null;
    case 'extra':
      if (state.ipMaskEnabled && state.ipMaskKind === 'wireguard') {
        if (!isRequired(state.wgEndpoint) || !isPort(state.wgEndpointPort)) {
          return 'Endpoint and port are required.';
        }
      }
      if (state.vpnServerEnabled && !isCIDR(state.vpnServerIpPool)) {
        return 'VPN server needs a valid IP pool CIDR.';
      }
      return null;
    default:
      return null;
  }
}
