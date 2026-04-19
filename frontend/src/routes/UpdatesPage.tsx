import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppWindow,
  CheckCircle2,
  Download,
  HardDriveDownload,
  Loader2,
  RefreshCw,
  Router as RouterIcon,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  PageHeader,
  PageShell,
  PageSubtitle,
  PageTitle,
  Progress,
  Select,
  Stack,
  useToast,
} from '@nasnet/ui';
import { api, type AppUpdateInfo, type FirmwareUpdateInfo, type Router } from '../api';
import { useRouterStore } from '../state/RouterStoreContext';
import { RouterTabBar } from '../layout/RouterTabBar';
import styles from './UpdatesPage.module.scss';

export function UpdatesPage() {
  const [appInfo, setAppInfo] = useState<AppUpdateInfo | null>(null);

  const reloadApp = useCallback(async () => {
    setAppInfo(await api.updates.checkApp());
  }, []);

  useEffect(() => {
    void reloadApp();
  }, [reloadApp]);

  return (
    <>
      <RouterTabBar />
      <PageShell>
        <PageHeader>
          <div>
            <PageTitle>Updates</PageTitle>
            <PageSubtitle>Keep the Nasnet Panel app and RouterOS firmware up to date.</PageSubtitle>
          </div>
        </PageHeader>

        <SummaryStrip appInfo={appInfo} />

        <div className={styles.cardGrid}>
          <AppUpdateCard info={appInfo} reload={reloadApp} />
          <FirmwareUpdateCard />
        </div>
      </PageShell>
    </>
  );
}

function SummaryStrip({ appInfo }: { appInfo: AppUpdateInfo | null }) {
  const appUpToDate = appInfo ? !appInfo.updateAvailable : null;

  return (
    <div className={styles.summaryGrid}>
      <Card className={styles.summaryCard}>
        <span
          className={`${styles.summaryIcon} ${
            appUpToDate === null
              ? styles.summaryIconInfo
              : appUpToDate
                ? styles.summaryIconSuccess
                : styles.summaryIconWarning
          }`}
        >
          <AppWindow size={20} aria-hidden />
        </span>
        <div className={styles.summaryBody}>
          <span className={styles.summaryLabel}>App</span>
          <span className={styles.summaryValue}>
            {appInfo === null ? 'Checking…' : appUpToDate ? 'Up to date' : 'Update available'}
          </span>
        </div>
      </Card>

      <Card className={styles.summaryCard}>
        <span className={`${styles.summaryIcon} ${styles.summaryIconInfo}`}>
          <HardDriveDownload size={20} aria-hidden />
        </span>
        <div className={styles.summaryBody}>
          <span className={styles.summaryLabel}>RouterOS firmware</span>
          <span className={styles.summaryValue}>Per-router check</span>
        </div>
      </Card>
    </div>
  );
}

function AppUpdateCard({
  info,
  reload,
}: {
  info: AppUpdateInfo | null;
  reload: () => Promise<void>;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const toast = useToast();

  const install = async () => {
    setProgress(0);
    setComplete(false);
    for await (const pct of api.updates.installApp()) {
      setProgress(pct);
    }
    setComplete(true);
    toast.notify({ title: 'Update complete', tone: 'success' });
    await reload();
  };

  if (!info) {
    return (
      <Card>
        <Stack>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderTitleRow}>
              <span className={styles.cardHeaderIcon}>
                <AppWindow size={18} aria-hidden />
              </span>
              <h3 style={{ margin: 0 }}>App update</h3>
            </div>
          </div>
          <p className={styles.emptyNote}>
            <Loader2 size={14} aria-hidden /> Checking for updates…
          </p>
        </Stack>
      </Card>
    );
  }

  const installing = progress !== null && !complete;

  return (
    <Card>
      <Stack>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardHeaderTitleRow}>
              <span className={styles.cardHeaderIcon}>
                <AppWindow size={18} aria-hidden />
              </span>
              <h3 style={{ margin: 0 }}>App update</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>
              {info.updateAvailable
                ? 'A newer version of Nasnet Panel is available.'
                : 'You are running the latest version.'}
            </p>
          </div>
          <span className={styles.badgeRow}>
            <Badge tone={info.updateAvailable ? 'warning' : 'success'}>
              {info.updateAvailable ? 'update available' : 'up to date'}
            </Badge>
          </span>
        </div>

        <div className={styles.versionGrid}>
          <div className={styles.versionCell}>
            <span className={styles.versionLabel}>Current</span>
            <span className={styles.versionValue} data-testid="app-current-version">
              {info.currentVersion}
            </span>
          </div>
          <div className={styles.versionCell}>
            <span className={styles.versionLabel}>Latest</span>
            <span className={styles.versionValue} data-testid="app-latest-version">
              {info.latestVersion}
            </span>
          </div>
        </div>

        {info.changelog ? (
          <div>
            <div className={styles.changelogTitle}>Changelog</div>
            <pre className={styles.changelog}>{info.changelog}</pre>
          </div>
        ) : null}

        {progress !== null ? (
          <Progress value={progress} label={complete ? 'Done' : 'Installing app update'} />
        ) : null}

        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={reload} disabled={installing}>
            <RefreshCw size={14} aria-hidden /> Check again
          </Button>
          <Button onClick={install} disabled={!info.updateAvailable || installing}>
            {installing ? (
              <>
                <Loader2 size={14} aria-hidden /> Installing…
              </>
            ) : (
              <>
                <Download size={14} aria-hidden /> Install app
              </>
            )}
          </Button>
        </div>
      </Stack>
    </Card>
  );
}

function FirmwareUpdateCard() {
  const { routers } = useRouterStore();
  const sorted = useMemo(
    () => [...routers].sort((a, b) => a.name.localeCompare(b.name)),
    [routers],
  );
  const [selectedId, setSelectedId] = useState<string>(sorted[0]?.id ?? '');
  const [info, setInfo] = useState<FirmwareUpdateInfo | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const toast = useToast();

  const reload = useCallback(async () => {
    if (!selectedId) {
      setInfo(null);
      return;
    }
    const data = await api.updates.checkFirmware(selectedId);
    setInfo(data);
  }, [selectedId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!selectedId) {
        setInfo(null);
        return;
      }
      const data = await api.updates.checkFirmware(selectedId);
      if (!cancelled) setInfo(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId && sorted.length > 0) setSelectedId(sorted[0].id);
  }, [selectedId, sorted]);

  const install = async () => {
    setConfirming(false);
    setProgress(0);
    setComplete(false);
    for await (const pct of api.updates.installFirmware(selectedId)) {
      setProgress(pct);
    }
    setComplete(true);
    toast.notify({ title: 'Firmware update complete', tone: 'success' });
  };

  const installing = progress !== null && !complete;
  const selectedRouter = sorted.find((r: Router) => r.id === selectedId);

  return (
    <Card>
      <Stack>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardHeaderTitleRow}>
              <span className={styles.cardHeaderIcon}>
                <HardDriveDownload size={18} aria-hidden />
              </span>
              <h3 style={{ margin: 0 }}>RouterOS firmware</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>
              Pick a router, then install the latest RouterOS release.
            </p>
          </div>
          {info ? (
            <span className={styles.badgeRow}>
              <Badge tone={info.updateAvailable ? 'warning' : 'success'}>
                {info.updateAvailable ? 'update available' : 'up to date'}
              </Badge>
            </span>
          ) : null}
        </div>

        {sorted.length === 0 ? (
          <p className={styles.emptyNote}>No routers added yet. Add a router to check firmware.</p>
        ) : (
          <>
            <Select
              aria-label="Router"
              value={selectedId}
              onChange={(v) => setSelectedId(v)}
              placeholder="Select a router…"
              options={sorted.map((r: Router) => ({
                value: r.id,
                label: `${r.name}${r.host ? ` · ${r.host}` : ''}`,
              }))}
            />

            {info ? (
              <div className={styles.versionGrid}>
                <div className={styles.versionCell}>
                  <span className={styles.versionLabel}>Router</span>
                  <span className={styles.versionValue}>
                    <RouterIcon size={12} aria-hidden /> {selectedRouter?.name ?? '—'}
                  </span>
                </div>
                <div className={styles.versionCell}>
                  <span className={styles.versionLabel}>Channel</span>
                  <span className={styles.versionValue}>{info.currentChannel}</span>
                </div>
                <div className={styles.versionCell}>
                  <span className={styles.versionLabel}>Current</span>
                  <span className={styles.versionValue}>{info.currentVersion}</span>
                </div>
                <div className={styles.versionCell}>
                  <span className={styles.versionLabel}>Latest</span>
                  <span className={styles.versionValue}>{info.latestVersion}</span>
                </div>
              </div>
            ) : null}

            {progress !== null ? (
              <Progress value={progress} label={complete ? 'Done' : 'Installing firmware'} />
            ) : null}

            <div className={styles.actions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={reload}
                disabled={installing || !selectedId}
              >
                <RefreshCw size={14} aria-hidden /> Check again
              </Button>
              <Button onClick={() => setConfirming(true)} disabled={!info || installing}>
                {installing ? (
                  <>
                    <Loader2 size={14} aria-hidden /> Installing…
                  </>
                ) : complete ? (
                  <>
                    <CheckCircle2 size={14} aria-hidden /> Done
                  </>
                ) : (
                  <>
                    <Download size={14} aria-hidden /> Install firmware
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </Stack>

      <ConfirmDialog
        open={confirming}
        title="Install RouterOS firmware?"
        description="The router will reboot after the package is applied. Connectivity drops briefly."
        destructive
        confirmLabel="Confirm"
        onConfirm={install}
        onCancel={() => setConfirming(false)}
      />
    </Card>
  );
}
