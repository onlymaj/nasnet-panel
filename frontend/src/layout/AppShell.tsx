import React from 'react';
import { Badge, Inline } from '@nasnet/ui';
import { AppHeader } from './AppHeader';
import styles from './AppShell.module.scss';

const isDev = process.env.NODE_ENV !== 'production';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.root}>
    <AppHeader />
    <main className={styles.main}>{children}</main>
    <footer className={styles.footer}>
      <Inline $gap="8px" $justify="center">
        <span>© 2026 Nasnet Panel v0.1.0</span>
        {isDev ? <Badge tone="warning">DEV</Badge> : null}
      </Inline>
    </footer>
  </div>
);
