import React from 'react';
import styles from './Skeleton.module.scss';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

const toSize = (v: string | number | undefined): string | undefined =>
  typeof v === 'number' ? `${v}px` : v;

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height = 16,
  radius,
  className,
  style,
  ...rest
}) => (
  <span
    aria-hidden
    className={cx(styles.skeleton, className)}
    style={{
      width: toSize(width) ?? '100%',
      height: toSize(height),
      borderRadius: toSize(radius),
      ...style,
    }}
    {...rest}
  />
);
