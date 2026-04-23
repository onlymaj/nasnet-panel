import { apiRequest } from './http';

export interface FirewallCredentials {
  host: string;
  username: string;
  password: string;
}

export interface FirewallRule {
  id: string;
  chain: string;
  action: string;
  protocol?: string;
  srcAddress?: string;
  dstAddress?: string;
  srcPort?: string;
  dstPort?: string;
  inInterface?: string;
  outInterface?: string;
  disabled: boolean;
  log: boolean;
  comment?: string;
  bytes?: string;
  packets?: string;
}

function authHeaders({ host, username, password }: FirewallCredentials): Record<string, string> {
  return {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    'X-RouterOS-Host': host,
  };
}

export async function fetchFirewallRules(
  creds: FirewallCredentials,
  chain?: string,
  signal?: AbortSignal,
): Promise<FirewallRule[]> {
  const query = chain ? `?${new URLSearchParams({ chain }).toString()}` : '';
  const rules = await apiRequest<FirewallRule[] | null>(`/api/firewall/rules${query}`, {
    method: 'GET',
    headers: authHeaders(creds),
    cache: 'no-store',
    signal,
  });
  return rules ?? [];
}
