import React from 'react';
import { Card } from '@nasnet/ui';
import styles from '../WirelessPage.module.scss';
import { cx, toneClass, type Tone } from './utils';

interface Props {
  icon: React.ReactNode;
  tone: Tone;
  label: string;
  children: React.ReactNode;
}

export function StatCard({ icon, tone, label, children }: Props) {
  return (
    <Card className={styles.statCard}>
      <span className={styles.statLabel}>
        <div className={cx(styles.iconTone, toneClass(tone))}>{icon}</div>
        {label}
      </span>
      {children}
    </Card>
  );
}
