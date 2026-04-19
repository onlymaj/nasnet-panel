import styles from '../WirelessPage.module.scss';

export const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export type Tone = 'primary' | 'info' | 'success' | 'warning';

export const toneClass = (tone: Tone): string =>
  tone === 'info'
    ? styles.iconToneInfo
    : tone === 'success'
      ? styles.iconToneSuccess
      : tone === 'warning'
        ? styles.iconToneWarning
        : '';
