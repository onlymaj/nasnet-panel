import React from 'react';
import styles from './DataTable.module.scss';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  caption?: string;
  selectedId?: string | null;
}

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = 'No results',
  caption,
  selectedId,
}: DataTableProps<T>): React.ReactElement {
  if (rows.length === 0) {
    return (
      <div className={styles.scroll}>
        {caption ? <div className={styles.empty}>{caption}</div> : null}
        <div className={styles.empty}>{emptyMessage}</div>
      </div>
    );
  }
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        {caption ? <caption style={{ captionSide: 'top', padding: 8 }}>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={styles.th}
                style={c.width ? { width: c.width } : undefined}
                scope="col"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = rowKey(row);
            const selected = selectedId === key;
            return (
              <tr
                key={key}
                className={cx(
                  styles.tr,
                  onRowClick && styles.trClickable,
                  selected && styles.trSelected,
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} className={styles.td}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
