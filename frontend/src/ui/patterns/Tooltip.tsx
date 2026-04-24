import React from 'react';
import styles from './Tooltip.module.scss';

export interface TooltipProps {
  label: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  children,
  placement = 'top',
  className,
}) => (
  <span
    className={[styles.wrapper, className].filter(Boolean).join(' ')}
    data-placement={placement}
  >
    {children}
    <span className={styles.bubble} role="tooltip">
      {label}
    </span>
  </span>
);
