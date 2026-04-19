import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@nasnet/ui';
import { api, type Interface, type WirelessClient, type WirelessSettings } from '../../api';

export function useWireless(id: string | undefined) {
  const [settings, setSettings] = useState<WirelessSettings | null>(null);
  const [interfaces, setInterfaces] = useState<Interface[]>([]);
  const [clients, setClients] = useState<WirelessClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const toast = useToast();

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [s, ifs, cs] = await Promise.all([
      api.wireless.get(id),
      api.system.listInterfaces(id),
      api.wireless.listClients(id),
    ]);
    setSettings(s);
    setInterfaces(ifs.filter((i) => i.type === 'wireless'));
    setClients(cs);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async (next: WirelessSettings) => {
    if (!id) return;
    await api.wireless.update(id, next);
    setSettings(next);
    toast.notify({ title: 'Wireless settings saved', tone: 'success' });
  };

  const toggleInterface = async (ifaceName: string, running: boolean) => {
    if (!id) return;
    await api.system.setInterfaceRunning(id, ifaceName, running);
    setInterfaces((prev) => prev.map((i) => (i.name === ifaceName ? { ...i, running } : i)));
    toast.notify({
      title: `${ifaceName} ${running ? 'enabled' : 'disabled'}`,
      tone: 'success',
    });
  };

  const restart = async () => {
    if (!id) return;
    setRestarting(true);
    try {
      const wirelessIfaces = interfaces.filter((i) => i.type === 'wireless');
      for (const iface of wirelessIfaces) {
        await api.system.setInterfaceRunning(id, iface.name, false);
      }
      for (const iface of wirelessIfaces) {
        await api.system.setInterfaceRunning(id, iface.name, true);
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
