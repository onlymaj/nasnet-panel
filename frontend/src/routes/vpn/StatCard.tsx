import React from 'react';
import { Card } from '@nasnet/ui';
import styles from '../VPNPage.module.scss';
import { cx } from './utils';

type Tone = 'primary' | 'info' | 'success' | 'warning';

const toneClass = (tone: Tone): string =>
  tone === 'info'
    ? styles.iconToneInfo
    : tone === 'success'
      ? styles.iconToneSuccess
      : tone === 'warning'
        ? styles.iconToneWarning
        : '';

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
