import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@nasnet/ui';
import styles from '../VPNPage.module.scss';

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({
  page,
  totalPages,
  total,
  pageSize,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  if (total <= pageSize) return null;
  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </span>
      <div className={styles.paginationControls}>
        <Button
          size="sm"
          variant="secondary"
          onClick={onPrev}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} aria-hidden /> Prev
        </Button>
        <span className={styles.paginationPage}>
          Page {page} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="secondary"
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Next <ChevronRight size={14} aria-hidden />
        </Button>
      </div>
    </div>
  );
}
