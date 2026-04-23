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

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const credentialsRef = useRef(new Map<string, Credentials>());
  const [activeRouterId, setActiveRouterId] = useState<string | null>(null);

  const getCredentials = useCallback(
    (routerId: string) => credentialsRef.current.get(routerId),
    [],
  );
  const setCredentials = useCallback((routerId: string, credentials: Credentials) => {
    credentialsRef.current.set(routerId, credentials);
  }, []);
  const clearCredentials = useCallback((routerId: string) => {
    credentialsRef.current.delete(routerId);
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
