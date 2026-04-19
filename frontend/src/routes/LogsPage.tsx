import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, RefreshCw, ScrollText } from 'lucide-react';
import styles from './LogsPage.module.scss';
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  FieldRow,
  Input,
  Inline,
  Label,
  Select,
  Stack,
  Switch,
} from '@nasnet/ui';
import { api, type LogEntry, type LogLevel } from '../api';

type LevelFilter = LogLevel | 'all';

const toneForLevel = (level: LogEntry['level']): 'success' | 'warning' | 'danger' | 'info' =>
  level === 'error'
    ? 'danger'
    : level === 'warning'
      ? 'warning'
      : level === 'debug'
        ? 'info'
        : 'success';

export function LogsPage() {
  const { id } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [level, setLevel] = useState<LevelFilter>('all');
  const [topic, setTopic] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [tail, setTail] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;
  const [selected, setSelected] = useState<LogEntry | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [l, t] = await Promise.all([
      api.logs.list(id, {
        level,
        topic: topic || undefined,
        search: search || undefined,
        limit: 200,
      }),
      api.logs.topics(id),
    ]);
    setLogs(l);
    setTopics(t);
    setLoading(false);
  }, [id, level, topic, search]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!tail || !id) return;
    const timer = window.setInterval(() => {
      void reload();
    }, 2000);
    return () => window.clearInterval(timer);
  }, [tail, id, reload]);

  const counts = useMemo(() => {
    const c: Record<LogLevel, number> = { info: 0, warning: 0, error: 0, debug: 0 };
    for (const l of logs) c[l.level] += 1;
    return c;
  }, [logs]);

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedLogs = useMemo(
    () => logs.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [logs, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [level, topic, search]);

  return (
    <Stack>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <div>
            <CardTitle>
              <Inline>
                <ScrollText size={16} aria-hidden /> Logs
              </Inline>
            </CardTitle>
            <CardDescription>
              RouterOS event stream. Filter by level or topic, search anywhere in the message.
            </CardDescription>
          </div>
          <div className={styles.headerActions}>
            <Switch label="Auto-tail" checked={tail} onChange={(e) => setTail(e.target.checked)} />
            <Button size="sm" variant="secondary" onClick={reload} disabled={loading}>
              <RefreshCw size={14} aria-hidden /> Refresh
            </Button>
          </div>
        </CardHeader>
        <Stack>
          <FieldRow>
            <Label>
              <span>Level</span>
              <Select
                aria-label="Level"
                value={level}
                onChange={(v) => setLevel(v as LevelFilter)}
                options={[
                  { value: 'all', label: 'all' },
                  { value: 'info', label: 'info' },
                  { value: 'warning', label: 'warning' },
                  { value: 'error', label: 'error' },
                  { value: 'debug', label: 'debug' },
                ]}
              />
            </Label>
            <Label>
              <span>Topic</span>
              <Select
                aria-label="Topic"
                value={topic}
                onChange={(v) => setTopic(v)}
                options={[
                  { value: '', label: 'all topics' },
                  ...topics.map((t) => ({ value: t, label: t })),
                ]}
              />
            </Label>
            <Label>
              <span>Search</span>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="keyword…"
                aria-label="Search"
              />
            </Label>
          </FieldRow>
          <Inline>
            <Filter size={14} aria-hidden />
            <Badge tone="success">info · {counts.info}</Badge>
            <Badge tone="warning">warning · {counts.warning}</Badge>
            <Badge tone="danger">error · {counts.error}</Badge>
            <Badge tone="info">debug · {counts.debug}</Badge>
          </Inline>
        </Stack>
      </Card>

      <Card data-testid="log-stream">
        {logs.length === 0 && !loading ? (
          <p className={styles.emptyNote}>No logs match the current filters.</p>
        ) : (
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {pagedLogs.map((log) => (
                  <button
                    type="button"
                    key={log.id}
                    data-testid="log-row"
                    className={styles.logRow}
                    onClick={() => setSelected(log)}
                    aria-label={`Open details for log ${log.id}`}
                  >
                    <span className={styles.timestamp}>{new Date(log.ts).toLocaleString()}</span>
                    <Badge className={styles.logLevel} tone={toneForLevel(log.level)}>
                      {log.level}
                    </Badge>
                    <span className={styles.topic}>{log.topic}</span>
                    <span className={styles.message}>{log.message}</span>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
            {logs.length > pageSize ? (
              <div className={styles.pagination}>
                <span className={styles.paginationInfo}>
                  Showing {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, logs.length)} of {logs.length}
                </span>
                <div className={styles.paginationControls}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} aria-hidden /> Prev
                  </Button>
                  <span className={styles.paginationPage}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                  >
                    Next <ChevronRight size={14} aria-hidden />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Card>

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Log details"
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setSelected(null)}>
            Close
          </Button>
        }
      >
        {selected ? (
          <div className={styles.detailGrid}>
            <div className={styles.detailLabel}>Timestamp</div>
            <div className={styles.detailValue}>
              <div>{new Date(selected.ts).toLocaleString()}</div>
              <div className={styles.detailMuted}>{selected.ts}</div>
            </div>

            <div className={styles.detailLabel}>Level</div>
            <div className={styles.detailValue}>
              <Badge tone={toneForLevel(selected.level)}>{selected.level}</Badge>
            </div>

            <div className={styles.detailLabel}>Topic</div>
            <div className={styles.detailValue}>
              <code className={styles.detailMono}>{selected.topic}</code>
            </div>

            <div className={styles.detailLabel}>Message</div>
            <div className={styles.detailValue}>
              <pre className={styles.detailMessage}>{selected.message}</pre>
            </div>

            <div className={styles.detailLabel}>Log ID</div>
            <div className={styles.detailValue}>
              <code className={styles.detailMono}>{selected.id}</code>
            </div>

            <div className={styles.detailLabel}>Router ID</div>
            <div className={styles.detailValue}>
              <code className={styles.detailMono}>{selected.routerId}</code>
            </div>
          </div>
        ) : null}
      </Dialog>
    </Stack>
  );
}
