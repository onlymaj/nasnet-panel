import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

interface Credentials {
  username: string;
  password: string;
}

interface SessionContextValue {
  getCredentials: (routerId: string) => Credentials | undefined;
  setCredentials: (routerId: string, credentials: Credentials) => void;
  clearCredentials: (routerId: string) => void;
  activeRouterId: string | null;
  setActiveRouterId: (id: string | null) => void;
}

const Ctx = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = 'nasnet-panel.session-credentials.v1';

function loadCredentials(): Map<string, Credentials> {
  if (typeof window === 'undefined') return new Map();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as Record<string, Credentials>;
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

function persistCredentials(map: Map<string, Credentials>) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(map)));
  } catch {
    /* ignore quota errors */
  }
}

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const credentialsRef = useRef<Map<string, Credentials>>(loadCredentials());
  const [activeRouterId, setActiveRouterId] = useState<string | null>(null);

  const getCredentials = useCallback(
    (routerId: string) => credentialsRef.current.get(routerId),
    [],
  );
  const setCredentials = useCallback((routerId: string, credentials: Credentials) => {
    credentialsRef.current.set(routerId, credentials);
    persistCredentials(credentialsRef.current);
  }, []);
  const clearCredentials = useCallback((routerId: string) => {
    credentialsRef.current.delete(routerId);
    persistCredentials(credentialsRef.current);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      getCredentials,
      setCredentials,
      clearCredentials,
      activeRouterId,
      setActiveRouterId,
    }),
    [getCredentials, setCredentials, clearCredentials, activeRouterId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useSession = (): SessionContextValue => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
};
