import React from 'react';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, disabled, className, children, type, ...rest },
  ref,
) {
  // Default to type="button" so forms don't accidentally submit on click.
  // Callers can still opt in to "submit" or "reset" via the type prop.
  return (
    <button
      ref={ref}
      // eslint-disable-next-line react/button-has-type
      type={type ?? 'button'}
      className={cx(styles.button, styles[variant], styles[size], className)}
      disabled={loading || disabled}
      {...rest}
    >
      {children}
    </button>
  );
});
