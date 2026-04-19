import React from 'react';
import styles from './StatusDot.module.scss';

type Status = 'online' | 'offline' | 'degraded' | 'unknown';

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  $status: Status;
  $size?: number;
}

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export const StatusDot: React.FC<StatusDotProps> = ({
  $status,
  $size,
  className,
  style,
  ...rest
}) => (
  <span
    className={cx(styles.dot, styles[$status], className)}
    style={$size ? { width: `${$size}px`, height: `${$size}px`, ...style } : style}
    {...rest}
  />
);
