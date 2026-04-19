import { useEffect, useState } from 'react';
import styles from './Typewriter.module.scss';

interface TypewriterProps {
  phrases: string[];
  active: boolean;
  settledIndex?: number;
  typingMs?: number;
  deletingMs?: number;
  holdMs?: number;
}

export function Typewriter({
  phrases,
  active,
  settledIndex = 0,
  typingMs = 60,
  deletingMs = 35,
  holdMs = 1500,
}: TypewriterProps) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [text, setText] = useState(active ? '' : (phrases[settledIndex] ?? ''));
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!active) {
      setText(phrases[settledIndex] ?? '');
      setDeleting(false);
      return;
    }
    const current = phrases[phraseIdx] ?? '';

    if (!deleting && text === current) {
      if (phrases.length <= 1) return;
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === '') {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
      return;
    }

    const step = deleting ? deletingMs : typingMs;
    const t = setTimeout(() => {
      setText((prev) => (deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)));
    }, step);
    return () => clearTimeout(t);
  }, [active, text, deleting, phraseIdx, phrases, settledIndex, typingMs, deletingMs, holdMs]);

  return (
    <span aria-live="polite">
      {text}
      {active ? <span className={styles.caret} aria-hidden /> : null}
    </span>
  );
}
