export interface WirelessInput {
  ssid: string;
  password: string;
  security: 'WPA2-PSK' | 'WPA3-PSK' | 'open';
  band: '2.4ghz' | '5ghz';
  countryCode: string;
}

export interface StarlinkInput {
  interface: string;
}

export interface DomesticInput {
  interface: string;
  mode: 'dhcp' | 'static' | 'pppoe';
  pppoeUser?: string;
  pppoePassword?: string;
  staticIp?: string;
  staticGateway?: string;
  staticDns?: string;
}

export interface WireGuardClientInput {
  kind: 'wireguard';
  endpoint: string;
  endpointPort: number;
  peerPublicKey: string;
  privateKey: string;
  allowedIps: string;
  persistentKeepalive: number;
  mtu: number;
}

export interface L2tpClientInput {
  kind: 'l2tp';
  server: string;
  username: string;
  password: string;
  ipsecSecret: string;
  profile: string;
}

export type IpMaskInput = WireGuardClientInput | L2tpClientInput;

export interface VpnServerInput {
  protocol: 'wireguard' | 'l2tp';
  listenPort: number;
  ipPool: string;
  dns?: string;
}

export interface EasyConfigInput {
  mode: 'dual-link' | 'starlink-only';
  starlink: StarlinkInput;
  domestic?: DomesticInput;
  wireless: WirelessInput;
  ipMask?: IpMaskInput;
  vpnServer?: VpnServerInput;
}

export function buildEasyConfigScript(input: EasyConfigInput): string {
  const out: string[] = [];
  out.push(`# Nasnet Panel easy-mode configuration`);
  out.push(`# Mode: ${input.mode}`);
  out.push('');

  out.push('/interface/list');
  out.push('add name=WAN');
  out.push('add name=LAN');
  out.push('');

  out.push('/interface/ethernet');
  out.push(`set [ find default-name=${input.starlink.interface} ] comment="Starlink uplink"`);
  if (input.domestic) {
    out.push(`set [ find default-name=${input.domestic.interface} ] comment="Domestic uplink"`);
  }
  out.push('');

  if (input.domestic) {
    if (input.domestic.mode === 'dhcp') {
      out.push('/ip/dhcp-client');
      out.push(`add interface=${input.domestic.interface} disabled=no use-peer-dns=yes`);
    } else if (input.domestic.mode === 'static') {
      out.push('/ip/address');
      out.push(`add address=${input.domestic.staticIp} interface=${input.domestic.interface}`);
      if (input.domestic.staticGateway) {
        out.push('/ip/route');
        out.push(`add gateway=${input.domestic.staticGateway}`);
      }
      if (input.domestic.staticDns) {
        out.push('/ip/dns');
        out.push(`set servers=${input.domestic.staticDns}`);
      }
    } else if (input.domestic.mode === 'pppoe') {
      out.push('/ppp/profile');
      out.push('add name=domestic-pppoe');
      out.push('/interface/pppoe-client');
      out.push(
        `add name=pppoe-out1 interface=${input.domestic.interface} user=${input.domestic.pppoeUser} password=${input.domestic.pppoePassword} profile=domestic-pppoe disabled=no`,
      );
    }
  }
  out.push('');

  out.push('/interface/wireless');
  out.push(
    `set [ find default-name=wlan1 ] ssid=${quote(input.wireless.ssid)} band=${wirelessBand(input.wireless.band)} country=${input.wireless.countryCode} disabled=no`,
  );
  out.push('/interface/wireless/security-profiles');
  out.push(
    `add name=nasnet-wlan mode=dynamic-keys ${securityDirective(input.wireless.security)} wpa2-pre-shared-key=${quote(
      input.wireless.password,
    )} wpa3-pre-shared-key=${quote(input.wireless.password)}`,
  );
  out.push('/interface/wireless');
  out.push('set [ find default-name=wlan1 ] security-profile=nasnet-wlan');
  out.push('');

  if (input.ipMask?.kind === 'wireguard') {
    out.push('/interface/wireguard');
    out.push(
      `add name=wg-starlink listen-port=51820 private-key=${quote(input.ipMask.privateKey)} mtu=${input.ipMask.mtu}`,
    );
    out.push('/interface/wireguard/peers');
    out.push(
      `add interface=wg-starlink endpoint-address=${input.ipMask.endpoint} endpoint-port=${input.ipMask.endpointPort} public-key=${quote(
        input.ipMask.peerPublicKey,
      )} allowed-address=${input.ipMask.allowedIps} persistent-keepalive=${input.ipMask.persistentKeepalive}s`,
    );
    out.push('/ip/firewall/mangle');
    out.push(
      `add chain=prerouting in-interface=${input.starlink.interface} action=mark-routing new-routing-mark=starlink-mask passthrough=no`,
    );
    out.push('');
  } else if (input.ipMask?.kind === 'l2tp') {
    out.push('/interface/l2tp-client');
    out.push(
      `add name=l2tp-starlink connect-to=${input.ipMask.server} user=${quote(input.ipMask.username)} password=${quote(input.ipMask.password)} profile=${input.ipMask.profile} disabled=no use-ipsec=yes ipsec-secret=${quote(input.ipMask.ipsecSecret)}`,
    );
    out.push('');
  }

  if (input.vpnServer) {
    if (input.vpnServer.protocol === 'wireguard') {
      out.push('/interface/wireguard');
      out.push(`add name=wg-server listen-port=${input.vpnServer.listenPort}`);
      out.push('/ip/pool');
      out.push(`add name=wg-pool ranges=${input.vpnServer.ipPool}`);
      out.push('/ip/address');
      out.push(`add address=${firstIp(input.vpnServer.ipPool)} interface=wg-server`);
    } else {
      out.push('/interface/l2tp-server/server');
      out.push('set enabled=yes use-ipsec=required default-profile=default-encryption');
    }
    out.push('');
  }

  out.push('/ip/firewall/nat');
  out.push('add chain=srcnat out-interface-list=WAN action=masquerade');
  out.push('');

  out.push('# -- end of easy-mode configuration');
  return out.join('\n');
}

export function buildDefaultBaseConfig(): string {
  const out: string[] = [];
  out.push('# Nasnet Panel default base configuration');
  out.push('/interface/list');
  out.push('add name=WAN');
  out.push('add name=LAN');
  out.push('/ip/firewall/address-list');
  out.push('add list=LOCAL-IP address=192.168.0.0/16');
  out.push('add list=LOCAL-IP address=172.16.0.0/12');
  out.push('add list=LOCAL-IP address=10.0.0.0/8');
  out.push('/ip/firewall/mangle');
  out.push('add chain=prerouting src-address-list=LOCAL-IP action=accept');
  out.push('add chain=postrouting src-address-list=LOCAL-IP action=accept');
  out.push('add chain=output src-address-list=LOCAL-IP action=accept');
  out.push('add chain=input src-address-list=LOCAL-IP action=accept');
  out.push('add chain=forward src-address-list=LOCAL-IP action=accept');
  out.push('/ip/firewall/nat');
  out.push('add chain=srcnat out-interface-list=WAN action=masquerade');
  return out.join('\n');
}

function quote(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

function wirelessBand(band: '2.4ghz' | '5ghz'): string {
  return band === '2.4ghz' ? '2ghz-g/n' : '5ghz-a/n/ac';
}

function securityDirective(security: 'WPA2-PSK' | 'WPA3-PSK' | 'open'): string {
  switch (security) {
    case 'WPA2-PSK':
      return 'authentication-types=wpa2-psk';
    case 'WPA3-PSK':
      return 'authentication-types=wpa3-psk';
    case 'open':
      return 'authentication-types=""';
  }
}

function firstIp(cidr: string): string {
  const [ip, prefix] = cidr.split('/');
  if (!ip || !prefix) return cidr;
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return cidr;
  parts[3] = (parts[3] | 1) & 0xff;
  return `${parts.join('.')}/${prefix}`;
}
