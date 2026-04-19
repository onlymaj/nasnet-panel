import styles from '../../../EasyConfigWizard.module.scss';

export function SuccessCheck() {
  return (
    <div className={styles.successCheck} aria-hidden="true">
      <svg viewBox="0 0 72 72" width="96" height="96">
        <circle
          className={styles.successCircle}
          cx="36"
          cy="36"
          r="32"
          fill="none"
          strokeWidth="4"
        />
        <path
          className={styles.successTick}
          d="M22 37 L32 47 L52 27"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
