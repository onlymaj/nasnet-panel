import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { Inline, ThemeToggle } from '@nasnet/ui';
import { useAppTheme } from '../state/ThemeContext';
import styles from './HeaderActions.module.scss';

export function HeaderActions() {
  const { preference, resolved, setPreference } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const hideSessionActions = location.pathname === '/' || location.pathname === '/routers/new';
  return (
    <Inline $gap="8px">
      <ThemeToggle value={preference} resolved={resolved} onChange={setPreference} />
      {hideSessionActions ? null : (
        <>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Notifications"
            onClick={() => navigate('/updates')}
            title="Updates & notifications"
          >
            <Bell size={16} aria-hidden />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Sign out"
            title="Sign out"
            onClick={() => navigate('/')}
          >
            <LogOut size={16} aria-hidden />
          </button>
        </>
      )}
    </Inline>
  );
}
