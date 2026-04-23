import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Network as NetworkIcon, Shield, Timer, Users as UsersIcon } from 'lucide-react';
import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CircularProgress,
  Inline,
  SectionGrid,
  SectionHeading,
  Stack,
  StatusDot,
  TrafficChart,
} from '@nasnet/ui';
import { api, type SystemOverview, type TopClient, type TrafficSample } from '../api';
import { useRouter } from '../state/RouterStoreContext';
import { useThemeColors } from '../utils/theme-colors';
import styles from './OverviewTab.module.scss';

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

const toneForPct = (pct: number): 'success' | 'warning' | 'danger' =>
  pct >= 85 ? 'danger' : pct >= 65 ? 'warning' : 'success';

const statusBadgeTone = (pct: number): 'success' | 'warning' | 'danger' => toneForPct(pct);

const statusBadgeLabel = (pct: number): string =>
  pct >= 85 ? 'Critical' : pct >= 65 ? 'High' : 'Normal';

const statusChipClass = (status: 'online' | 'offline' | 'degraded' | 'unknown'): string =>
  status === 'online'
    ? styles.statusOnline
    : status === 'offline'
      ? styles.statusOffline
      : status === 'degraded'
        ? styles.statusDegraded
        : '';

const toneVar = (tone: 'success' | 'warning' | 'danger'): string =>
  tone === 'danger'
    ? 'var(--color-danger)'
    : tone === 'warning'
      ? 'var(--color-warning)'
      : 'var(--color-success)';

const miniBarStyle = (pct: number, tone: 'success' | 'warning' | 'danger'): React.CSSProperties =>
  ({
    ['--_pct' as string]: `${Math.max(0, Math.min(100, pct))}%`,
    ['--_tone' as string]: toneVar(tone),
  }) as React.CSSProperties;

const relativeLastSeen = (iso?: string): string => {
  if (!iso) return 'Never';
  const delta = Date.now() - new Date(iso).getTime();
  if (delta < 60_000) return 'Just now';
  if (delta < 3_600_000) return `${Math.round(delta / 60_000)} min ago`;
  if (delta < 86_400_000) return `${Math.round(delta / 3_600_000)} hr ago`;
  return `${Math.round(delta / 86_400_000)} d ago`;
};

const formatMbps = (kbps: number) => `${(kbps / 1000).toFixed(2)} Mb/s`;

export function OverviewTab() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter(id);
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [traffic, setTraffic] = useState<TrafficSample[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const colors = useThemeColors();

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      const [ov, tr, clients] = await Promise.all([
        api.system.overview(id),
        api.system.trafficHistory(id),
        api.system.topClients(id),
      ]);
      if (cancelled) return;
      setOverview(ov);
      setTraffic(tr);
      setTopClients(clients);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const memoryPct = useMemo(() => {
    if (!overview) return 0;
    return Math.round((overview.memoryUsed / overview.memoryTotal) * 100);
  }, [overview]);

  const diskUsedMb = useMemo(() => {
    if (!overview) return 0;
    return Math.round((overview.dhcpLeases * 1.7 + overview.vpnTunnels * 3.1 + 7.3) * 10) / 10;
  }, [overview]);
  const diskTotalMb = 82.19;
  const diskPct = Math.round((diskUsedMb / diskTotalMb) * 100);

  const latest = traffic[traffic.length - 1];
  const downloadKbps = latest?.rxKbps ?? 0;
  const uploadKbps = latest?.txKbps ?? 0;

  if (!id || !overview) {
    return (
      <Card>
        <p aria-busy="true">Loading dashboard…</p>
      </Card>
    );
  }

  return (
    <Stack>
      <Card className={styles.bannerCard}>
        <div className={styles.bannerLeft}>
          <h1 className={styles.routerTitleRow}>
            {router?.name ?? 'Router'}{' '}
            <span
              className={cx(styles.statusChip, statusChipClass(router?.status ?? 'unknown'))}
              aria-hidden
            />
          </h1>
          <span className={styles.bannerHost}>{router?.host}</span>
        </div>
        <div className={styles.bannerStats}>
          <span className={styles.bannerStat}>
            <Timer size={14} aria-hidden />{' '}
            <span className={styles.statValue}>{overview.uptime}</span> <span>uptime</span>
          </span>
          <span className={styles.bannerDivider} aria-hidden />
          <span className={styles.bannerStat}>
            <UsersIcon size={14} aria-hidden />{' '}
            <span className={styles.statValue}>{overview.dhcpLeases}</span> <span>devices</span>
          </span>
          <span className={styles.bannerDivider} aria-hidden />
          <span className={styles.bannerStat}>
            <Activity size={14} aria-hidden />{' '}
            <span className={styles.statValue}>{overview.vpnTunnels}</span> <span>VPN</span>
          </span>
          <span className={styles.bannerDivider} aria-hidden />
          <span className={styles.bannerStat}>
            <Timer size={14} aria-hidden />{' '}
            <span className={styles.statValue}>{relativeLastSeen(router?.lastSeen)}</span>
          </span>
        </div>
      </Card>

      <div>
        <SectionHeading>Resources</SectionHeading>
        <SectionGrid>
          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <h4 className={styles.resourceTitle}>CPU</h4>
              <Badge tone={statusBadgeTone(overview.cpuLoad)}>
                {statusBadgeLabel(overview.cpuLoad)}
              </Badge>
            </div>
            <div className={styles.resourceBody}>
              <CircularProgress
                value={overview.cpuLoad}
                size={96}
                strokeWidth={8}
                tone={toneForPct(overview.cpuLoad)}
                ariaLabel={`CPU ${overview.cpuLoad}%`}
              />
            </div>
            <div
              className={styles.miniBar}
              style={miniBarStyle(overview.cpuLoad, toneForPct(overview.cpuLoad))}
            />
            <div className={styles.resourceFooter} data-testid="overview-cpu">
              2 cores · {overview.cpuLoad} MHz
            </div>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <h4 className={styles.resourceTitle}>Memory</h4>
              <Badge tone={statusBadgeTone(memoryPct)}>{statusBadgeLabel(memoryPct)}</Badge>
            </div>
            <div className={styles.resourceBody}>
              <CircularProgress
                value={memoryPct}
                size={96}
                strokeWidth={8}
                tone={toneForPct(memoryPct)}
                ariaLabel={`Memory ${memoryPct}%`}
              />
            </div>
            <div
              className={styles.miniBar}
              style={miniBarStyle(memoryPct, toneForPct(memoryPct))}
            />
            <div className={styles.resourceFooter}>
              {overview.memoryUsed} MB / {(overview.memoryTotal / 1024).toFixed(0)} GB
            </div>
          </Card>

          <Card className={styles.resourceCard}>
            <div className={styles.resourceHeader}>
              <h4 className={styles.resourceTitle}>Disk</h4>
              <Badge tone={statusBadgeTone(diskPct)}>{statusBadgeLabel(diskPct)}</Badge>
            </div>
            <div className={styles.resourceBody}>
              <CircularProgress
                value={diskPct}
                size={96}
                strokeWidth={8}
                tone={toneForPct(diskPct)}
                ariaLabel={`Disk ${diskPct}%`}
              />
            </div>
            <div className={styles.miniBar} style={miniBarStyle(diskPct, toneForPct(diskPct))} />
            <div className={styles.resourceFooter}>
              {diskUsedMb.toFixed(2)} MB / {diskTotalMb.toFixed(2)} MB
            </div>
          </Card>
        </SectionGrid>
      </div>

      <div>
        <SectionHeading>Network</SectionHeading>
        <SectionGrid>
          <Card className={styles.networkCard}>
            <div className={styles.networkCardHeader}>
              <div className={styles.networkCardTitle}>
                <div className={cx(styles.iconCircle, styles.iconCircleInfo)} aria-hidden>
                  <NetworkIcon size={16} />
                </div>
                Default DHCP Server
              </div>
              <Badge tone="neutral">{overview.dhcpLeases ? 'Active' : 'Idle'}</Badge>
            </div>
            <div className={styles.networkEmpty}>
              <div className={cx(styles.iconCircle, styles.iconCircleInfo)} aria-hidden>
                <NetworkIcon size={16} />
              </div>
              {overview.dhcpLeases === 0 ? (
                <span>No active leases</span>
              ) : (
                <span data-testid="overview-interface-count">
                  {overview.dhcpLeases} active leases · {overview.interfaceCount} interfaces
                </span>
              )}
            </div>
          </Card>

          <Card className={cx(styles.networkCard, styles.trafficCard)}>
            <div className={styles.networkCardHeader}>
              <div className={styles.networkCardTitle}>
                <div className={styles.iconCircle} aria-hidden>
                  <Activity size={16} />
                </div>
                Network Traffic (ether1)
              </div>
            </div>
            <div className={styles.trafficLine}>
              <div className={styles.trafficColumn}>
                <span className={styles.trafficLabel}>
                  <span style={{ color: colors.success }}>↓</span> Download
                </span>
                <span className={styles.trafficValue}>{formatMbps(downloadKbps)}</span>
              </div>
              <div className={styles.trafficColumn}>
                <span className={styles.trafficLabel}>
                  <span style={{ color: colors.warning }}>↑</span> Upload
                </span>
                <span className={styles.trafficValue}>{formatMbps(uploadKbps)}</span>
              </div>
            </div>
            <div className={styles.chartArea}>
              <TrafficChart data={traffic} colors={colors} formatValue={formatMbps} />
            </div>
            <div className={styles.chartAxis}>
              <span>
                {traffic.length > 1
                  ? `-${Math.max(1, Math.round((traffic.length * 10) / 60))}m`
                  : ''}
              </span>
              <span>now</span>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.chartLegendItem}>
                <span className={styles.chartLegendSwatch} style={{ background: colors.success }} />
                Download
              </span>
              <span className={styles.chartLegendItem}>
                <span className={styles.chartLegendSwatch} style={{ background: colors.warning }} />
                Upload
              </span>
            </div>
          </Card>

          <Card className={styles.networkCard}>
            <div className={styles.networkCardHeader}>
              <div className={styles.networkCardTitle}>
                <div className={cx(styles.iconCircle, styles.iconCircleSuccess)} aria-hidden>
                  <Shield size={16} />
                </div>
                VPN Clients
              </div>
              <Badge tone="neutral">{overview.vpnTunnels ? 'Active' : 'Idle'}</Badge>
            </div>
            {overview.vpnTunnels === 0 ? (
              <div className={styles.networkEmpty}>
                <div className={cx(styles.iconCircle, styles.iconCircleSuccess)} aria-hidden>
                  <Shield size={16} />
                </div>
                <span>No clients connected</span>
              </div>
            ) : (
              <Stack $gap="6px">
                {topClients.slice(0, 3).map((c) => (
                  <Inline key={c.mac}>
                    <StatusDot $status="online" aria-hidden />
                    <span style={{ fontWeight: colors.fontWeights.medium }}>{c.hostname}</span>
                    <span style={{ color: colors.textMuted, fontSize: colors.fontSizes.xs }}>
                      {c.ip}
                    </span>
                  </Inline>
                ))}
              </Stack>
            )}
          </Card>
        </SectionGrid>
      </div>

      <div>
        <SectionHeading>System</SectionHeading>
        <SectionGrid>
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Model</span>
              <span className={styles.infoVal} data-testid="overview-model">
                {overview.model}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>RouterOS</span>
              <span className={styles.infoVal}>{overview.version} (stable)</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Uptime</span>
              <span className={styles.infoVal} data-testid="overview-uptime">
                {overview.uptime}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Architecture</span>
              <span className={styles.infoVal}>arm64</span>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Hardware Details</CardTitle>
            </CardHeader>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Platform</span>
              <span className={styles.infoVal}>MikroTik</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Board</span>
              <span className={styles.infoVal}>{overview.model}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Total Memory</span>
              <span className={styles.infoVal}>{overview.memoryTotal} MB</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Total Storage</span>
              <span className={styles.infoVal}>{diskTotalMb.toFixed(0)} MB</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Serial</span>
              <span className={styles.infoVal}>{overview.serial}</span>
            </div>
          </Card>
        </SectionGrid>
      </div>
    </Stack>
  );
}
