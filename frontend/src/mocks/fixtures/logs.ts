import type { LogEntry, LogLevel } from '../types';

const TOPICS = [
  'system',
  'dhcp',
  'firewall',
  'wireless',
  'vpn',
  'routing',
  'interface',
  'pppoe',
  'update',
];

const MESSAGES: Array<[LogLevel, string]> = [
  ['info', 'interface ether2 link up'],
  ['info', 'DHCP server lease 192.168.88.42 assigned to b8:27:eb:11:22:33'],
  ['info', 'wireguard peer connected: 10.10.0.2/32'],
  ['info', 'L2TP client connecting to corp.example.com'],
  ['info', 'system started, uptime reset'],
  ['info', 'ntp synchronised to 162.159.200.1'],
  ['info', 'PPPoE session established, ip=185.2.1.10'],
  ['info', 'wireless client associated c8:2b:96:ac:de:f0'],
  ['warning', 'CPU load 78%'],
  ['warning', 'memory usage 85%'],
  ['warning', 'wireless client c8:2b:96:ac:de:f0 deauthenticated'],
  ['warning', 'wireguard peer handshake failed: retrying'],
  ['warning', 'firewall: dropping invalid packet from 203.0.113.17'],
  ['error', 'PPPoE session closed: authentication failed'],
  ['error', 'interface ether3 link down'],
  ['error', 'DNS query timed out'],
  ['debug', 'routing table updated'],
  ['debug', 'firewall rule 5 matched 42 times'],
];

export const seededLogs = (): LogEntry[] => {
  const now = Date.now();
  const entries: LogEntry[] = [];
  const routers = ['rtr_ubud', 'rtr_tehran', 'rtr_basecamp'];
  for (const routerId of routers) {
    for (let i = 0; i < 120; i++) {
      const [level, message] = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
      entries.push({
        id: `log_${routerId}_${i}`,
        routerId,
        ts: new Date(now - i * 45_000 - Math.random() * 20_000).toISOString(),
        level,
        topic,
        message,
      });
    }
  }
  return entries;
};
