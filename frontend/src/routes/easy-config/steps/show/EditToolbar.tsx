import { Check, Pencil, RotateCcw } from 'lucide-react';
import styles from '../../../EasyConfigWizard.module.scss';

interface Props {
  editing: boolean;
  edited: boolean;
  applied: boolean;
  onStartEdit: () => void;
  onDone: () => void;
  onReset: () => void;
}

export function EditToolbar({ editing, edited, applied, onStartEdit, onDone, onReset }: Props) {
  if (!editing) {
    return (
      <div className={styles.editActions}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onStartEdit}
          disabled={applied}
          aria-label="Edit script"
          title="Edit script"
        >
          <Pencil size={16} />
        </button>
      </div>
    );
  }
  return (
    <div className={styles.editActions}>
      {edited ? (
        <button
          type="button"
          className={styles.iconButton}
          onClick={onReset}
          aria-label="Reset to generated script"
          title="Reset to generated"
        >
          <RotateCcw size={16} />
        </button>
      ) : null}
      <button
        type="button"
        className={styles.iconButton}
        onClick={onDone}
        aria-label="Done editing"
        title="Done editing"
      >
        <Check size={16} />
      </button>
    </div>
  );
}
