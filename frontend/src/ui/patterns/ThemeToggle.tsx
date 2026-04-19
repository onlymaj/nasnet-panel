import React, { useEffect, useRef, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.scss';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeToggleProps {
  value: ThemePreference;
  resolved: 'light' | 'dark';
  onChange: (next: ThemePreference) => void;
}

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, resolved, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const TriggerIcon = resolved === 'dark' ? Moon : Sun;

  const pick = (next: ThemePreference) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
      >
        <TriggerIcon size={16} aria-hidden />
      </button>
      {open ? (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            role="menuitem"
            className={cx(styles.item, value === 'light' && styles.itemActive)}
            onClick={() => pick('light')}
          >
            <Sun size={14} aria-hidden /> Light
          </button>
          <button
            type="button"
            role="menuitem"
            className={cx(styles.item, value === 'dark' && styles.itemActive)}
            onClick={() => pick('dark')}
          >
            <Moon size={14} aria-hidden /> Dark
          </button>
          <button
            type="button"
            role="menuitem"
            className={cx(styles.item, value === 'system' && styles.itemActive)}
            onClick={() => pick('system')}
          >
            <Monitor size={14} aria-hidden /> System
          </button>
        </div>
      ) : null}
    </div>
  );
};
