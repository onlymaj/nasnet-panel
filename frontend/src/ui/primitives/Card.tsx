import React from 'react';
import styles from './Card.module.scss';

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

type DivProps = React.HTMLAttributes<HTMLElement>;

export const Card = React.forwardRef<HTMLElement, DivProps>(function Card(
  { className, children, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={cx(styles.card, className)} {...rest}>
      {children}
    </section>
  );
});

export const CardHeader: React.FC<DivProps> = ({ className, children, ...rest }) => (
  <header className={cx(styles.header, className)} {...rest}>
    {children}
  </header>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...rest
}) => (
  <h3 className={cx(styles.title, className)} {...rest}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...rest
}) => (
  <p className={cx(styles.description, className)} {...rest}>
    {children}
  </p>
);

export const CardFooter: React.FC<DivProps> = ({ className, children, ...rest }) => (
  <footer className={cx(styles.footer, className)} {...rest}>
    {children}
  </footer>
);
