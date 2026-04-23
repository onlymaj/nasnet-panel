import { apiRequest } from './http';

export interface DnsCredentials {
  host: string;
  username: string;
  password: string;
}

export interface DnsInfoResponse {
  servers: string[];
  dynamicServers: string[];
  dohServer: string;
}

export interface UpdateDnsRequest {
  servers?: string;
  dohServer?: string;
}

function authHeaders({ host, username, password }: DnsCredentials): Record<string, string> {
  return {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    'X-RouterOS-Host': host,
  };
}

export async function fetchDnsInfo(
  creds: DnsCredentials,
  signal?: AbortSignal,
): Promise<DnsInfoResponse> {
  const data = await apiRequest<DnsInfoResponse | null>('/api/dns/info', {
    method: 'GET',
    headers: authHeaders(creds),
    cache: 'no-store',
    signal,
  });
  return (
    data ?? {
      servers: [],
      dynamicServers: [],
      dohServer: '',
    }
  );
}

export async function updateDnsConfig(
  creds: DnsCredentials,
  body: UpdateDnsRequest,
  signal?: AbortSignal,
): Promise<void> {
  await apiRequest('/api/dns/info', {
    method: 'PUT',
    headers: authHeaders(creds),
    body: JSON.stringify(body),
    signal,
  });
}
