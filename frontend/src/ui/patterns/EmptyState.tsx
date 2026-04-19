import React from 'react';
import styles from './EmptyState.module.scss';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actions, icon }) => (
  <div className={styles.wrap}>
    {icon}
    <h2 className={styles.title}>{title}</h2>
    {description ? <p className={styles.description}>{description}</p> : null}
    {actions ? <div className={styles.actions}>{actions}</div> : null}
  </div>
);
