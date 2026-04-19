import { useEffect } from 'react';
import './global.scss';

// Renders nothing. Importing this component guarantees the global stylesheet
// is pulled into the bundle when used in a tree that might otherwise tree-shake it.
export const GlobalStyle = () => {
  useEffect(() => {
    // No-op: side-effect import above is what matters.
  }, []);
  return null;
};
