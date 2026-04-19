import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordInput.module.scss';

export type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  showLabel?: string;
  hideLabel?: string;
};

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { showLabel = 'Show password', hideLabel = 'Hide password', className, ...rest },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    return (
      <div className={styles.wrap}>
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cx(styles.input, className)}
          {...rest}
        />
        <button
          type="button"
          className={styles.toggle}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          tabIndex={0}
        >
          {visible ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
        </button>
      </div>
    );
  },
);
