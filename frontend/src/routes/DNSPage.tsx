import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Globe, RefreshCw, SearchX } from 'lucide-react';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldStack,
  Inline,
  Input,
  Label,
  Skeleton,
  Stack,
  useToast,
} from '@nasnet/ui';
import styles from './DNSPage.module.scss';
import {
  ApiError,
  fetchDnsInfo,
  updateDnsConfig,
  type DnsCredentials,
  type DnsInfoResponse,
} from '../api';
import { useSession } from '../state/SessionContext';
import { useRouter } from '../state/RouterStoreContext';

const normalizeServers = (raw: string): string =>
  raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',');

export function DNSPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter(id);
  const { getCredentials } = useSession();
  const toast = useToast();

  const [info, setInfo] = useState<DnsInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [serversInput, setServersInput] = useState<string>('');
  const [dohInput, setDohInput] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const creds = useMemo<DnsCredentials | null>(() => {
    if (!id) return null;
    const c = getCredentials(id);
    const host = router?.host;
    if (!c || !host) return null;
    return { host, username: c.username, password: c.password };
  }, [id, router?.host, getCredentials]);

  const reload = useCallback(async () => {
    if (!creds) {
      setLoading(false);
      setError('Missing router credentials for this session.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDnsInfo(creds);
      setInfo(data);
      setServersInput(data.servers.join(', '));
      setDohInput(data.dohServer ?? '');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load DNS configuration.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [creds]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async () => {
    if (!creds) return;
    setSaving(true);
    try {
      await updateDnsConfig(creds, {
        servers: normalizeServers(serversInput),
        dohServer: dohInput.trim(),
      });
      toast.notify({ title: 'DNS configuration saved', tone: 'success' });
      await reload();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to update DNS configuration.';
      toast.notify({ title: 'Failed to save DNS', description: message, tone: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack>
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <div>
            <CardTitle>
              <Inline>
                <Globe size={16} aria-hidden /> DNS
              </Inline>
            </CardTitle>
            <CardDescription>
              RouterOS DNS configuration. Static servers, DHCP-supplied servers, and DoH endpoint.
            </CardDescription>
          </div>
          <div className={styles.headerActions}>
            <Button size="sm" variant="secondary" onClick={reload} disabled={loading || saving}>
              <RefreshCw size={14} aria-hidden /> Refresh
            </Button>
            <Button size="sm" variant="success" onClick={save} disabled={!info || saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </CardHeader>

        {loading && !info ? (
          <div className={styles.skeletonGrid} data-testid="dns-skeleton">
            <Skeleton width={140} height={14} />
            <Skeleton height={36} />
            <Skeleton width={140} height={14} />
            <Skeleton height={36} />
            <Skeleton width={140} height={14} />
            <Skeleton height={14} />
          </div>
        ) : error ? (
          <div className={styles.errorNote}>
            <SearchX size={28} aria-hidden className={styles.errorIcon} />
            <p>{error}</p>
          </div>
        ) : info ? (
          <FieldStack>
            <Label>
              <span>Static DNS servers</span>
              <Input
                value={serversInput}
                onChange={(e) => setServersInput(e.target.value)}
                placeholder="8.8.8.8, 1.1.1.1"
                aria-label="Static DNS servers"
                disabled={saving}
              />
              <div className={styles.fieldHint}>
                Comma-separated IPv4/IPv6 addresses. Leave empty to clear.
              </div>
            </Label>
            <Label>
              <span>DoH server URL</span>
              <Input
                value={dohInput}
                onChange={(e) => setDohInput(e.target.value)}
                placeholder="https://dns.google/dns-query"
                aria-label="DoH server URL"
                disabled={saving}
              />
              <div className={styles.fieldHint}>Leave empty to disable DNS-over-HTTPS.</div>
            </Label>

            <div className={styles.dynamicRow}>
              <span className={styles.dynamicLabel}>Dynamic servers</span>
              <div className={styles.dynamicValue}>
                {info.dynamicServers.length > 0 ? (
                  <div className={styles.serverList}>
                    {info.dynamicServers.map((s) => (
                      <span key={`dynamic-${s}`} className={styles.serverPill}>
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.muted}>None received</span>
                )}
                <div className={styles.fieldHint}>Read-only. Supplied by DHCP / PPP peers.</div>
              </div>
            </div>
          </FieldStack>
        ) : null}
      </Card>
    </Stack>
  );
}
