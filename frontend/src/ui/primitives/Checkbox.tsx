import React from 'react';
import styles from './Checkbox.module.scss';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...rest },
  ref,
) {
  return (
    <label className={cx(styles.wrap, className)}>
      <input ref={ref} type="checkbox" className={styles.checkbox} {...rest} />
      {label}
    </label>
  );
});

export const Switch = React.forwardRef<HTMLInputElement, CheckboxProps>(function Switch(
  { label, className, ...rest },
  ref,
) {
  return (
    <label className={cx(styles.wrap, className)}>
      <input ref={ref} type="checkbox" role="switch" className={styles.switch} {...rest} />
      {label}
    </label>
  );
});
