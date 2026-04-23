import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@nasnet/ui';
import {
  fetchWifiClients,
  fetchWifiInterfaces,
  fetchWifiPassphrase,
  updateWifiInterface,
  updateWifiPassphrase,
  type Interface,
  type WifiConnectedClientResponse,
  type WifiCredentials,
  type WifiInterfaceResponse,
  type WirelessBand,
  type WirelessClient,
  type WirelessSecurity,
  type WirelessSettings,
} from '../../api';
import { useRouter } from '../../state/RouterStoreContext';
import { useSession } from '../../state/SessionContext';

const toBand = (value: string | undefined): WirelessBand =>
  value && value.toLowerCase().startsWith('5') ? '5ghz' : '2.4ghz';

const toSecurity = (value: string | undefined): WirelessSecurity => {
  const v = (value ?? '').toLowerCase();
  if (v.includes('wpa3')) return 'WPA3-PSK';
  if (v === 'none' || v === 'open' || v === '') return 'open';
  return 'WPA2-PSK';
};

const parseNumber = (value: string | undefined): number => {
  if (!value) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const bpsToKbps = (value: string | undefined): number =>
  Math.round(parseNumber(value) / 1000);

const toInterface = (wi: WifiInterfaceResponse): Interface => ({
  name: wi.name || wi.interface,
  type: 'wireless',
  mac: wi.macAddress,
  running: wi.running && !wi.disabled,
  comment: wi.comment,
});

const toWirelessClient = (c: WifiConnectedClientResponse): WirelessClient => ({
  mac: c.macAddress,
  hostname: c.macAddress,
  ip: '',
  signalDbm: parseNumber(c.signal),
  band: toBand(c.band),
  txKbps: bpsToKbps(c.txBitsPerSecond),
  rxKbps: bpsToKbps(c.rxBitsPerSecond),
  connectedFor: c.uptime,
});

const toSettings = (
  primary: WifiInterfaceResponse | undefined,
  passphrase: string,
): WirelessSettings | null => {
  if (!primary) return null;
  return {
    ssid: primary.ssid,
    password: passphrase,
    security: toSecurity(primary.securityType),
    band: toBand(primary.band),
    countryCode: '',
    hidden: false,
  };
};

export function useWireless(id: string | undefined) {
  const router = useRouter(id);
  const { getCredentials } = useSession();
  const [settings, setSettings] = useState<WirelessSettings | null>(null);
  const [primaryName, setPrimaryName] = useState<string | null>(null);
  const [interfaces, setInterfaces] = useState<Interface[]>([]);
  const [clients, setClients] = useState<WirelessClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const toast = useToast();

  const creds = useMemo<WifiCredentials | null>(() => {
    if (!id) return null;
    const c = getCredentials(id);
    const host = router?.host;
    if (!c || !host) return null;
    return { host, username: c.username, password: c.password };
  }, [id, router?.host, getCredentials]);

  const reload = useCallback(async () => {
    if (!creds) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [rawInterfaces, rawClients] = await Promise.all([
        fetchWifiInterfaces(creds),
        fetchWifiClients(creds).catch(() => [] as WifiConnectedClientResponse[]),
      ]);
      const primary =
        rawInterfaces.find((i) => i.running && !i.disabled) ?? rawInterfaces[0];
      let passphrase = primary?.passphrase ?? '';
      if (primary && !passphrase) {
        try {
          const p = await fetchWifiPassphrase(creds, primary.name || primary.interface);
          passphrase = p.passphrase;
        } catch {
          // passphrase unavailable — leave blank
        }
      }
      setInterfaces(rawInterfaces.map(toInterface));
      setClients(rawClients.map(toWirelessClient));
      setSettings(toSettings(primary, passphrase));
      setPrimaryName(primary ? primary.name || primary.interface : null);
    } finally {
      setLoading(false);
    }
  }, [creds]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async (next: WirelessSettings) => {
    if (!creds || !primaryName) return;
    if (next.password && next.password !== settings?.password) {
      await updateWifiPassphrase(creds, primaryName, next.password);
    }
    setSettings(next);
    toast.notify({ title: 'Wireless settings saved', tone: 'success' });
  };

  const toggleInterface = async (ifaceName: string, running: boolean) => {
    if (!creds) return;
    await updateWifiInterface(creds, ifaceName, running);
    setInterfaces((prev) => prev.map((i) => (i.name === ifaceName ? { ...i, running } : i)));
    toast.notify({
      title: `${ifaceName} ${running ? 'enabled' : 'disabled'}`,
      tone: 'success',
    });
  };

  const restart = async () => {
    if (!creds) return;
    setRestarting(true);
    try {
      const wirelessIfaces = interfaces.filter((i) => i.type === 'wireless');
      for (const iface of wirelessIfaces) {
        await updateWifiInterface(creds, iface.name, false);
      }
      for (const iface of wirelessIfaces) {
        await updateWifiInterface(creds, iface.name, true);
      }
      await reload();
      toast.notify({ title: 'Wireless restarted', tone: 'success' });
    } finally {
      setRestarting(false);
    }
  };

  return {
    settings,
    interfaces,
    clients,
    loading,
    restarting,
    reload,
    save,
    toggleInterface,
    restart,
  };
}
