import React from 'react';
import styles from './Layout.module.scss';

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

type Div = React.HTMLAttributes<HTMLDivElement>;

const makeDiv = (base: string, displayName: string): React.FC<Div> => {
  const Component: React.FC<Div> = ({ className, children, ...rest }) => (
    <div className={cx(base, className)} {...rest}>
      {children}
    </div>
  );
  Component.displayName = displayName;
  return Component;
};

export const PageShell: React.FC<Div> = ({ className, children, ...rest }) => (
  <div className={cx(styles.pageShell, className)} {...rest}>
    {children}
  </div>
);

export const PageHeader: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  children,
  ...rest
}) => (
  <header className={cx(styles.pageHeader, className)} {...rest}>
    {children}
  </header>
);

export const PageTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...rest
}) => (
  <h1 className={cx(styles.pageTitle, className)} {...rest}>
    {children}
  </h1>
);

export const PageSubtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...rest
}) => (
  <p className={cx(styles.pageSubtitle, className)} {...rest}>
    {children}
  </p>
);

export const PageActions = makeDiv(styles.pageActions, 'PageActions');
export const SectionGrid = makeDiv(styles.sectionGrid, 'SectionGrid');

interface StackProps extends Div {
  $gap?: string;
}

export const Stack: React.FC<StackProps> = ({ $gap, className, style, children, ...rest }) => (
  <div
    className={cx(styles.stack, className)}
    style={$gap ? { gap: $gap, ...style } : style}
    {...rest}
  >
    {children}
  </div>
);

interface InlineProps extends Div {
  $gap?: string;
  $align?: React.CSSProperties['alignItems'];
  $justify?: React.CSSProperties['justifyContent'];
}

export const Inline: React.FC<InlineProps> = ({
  $gap,
  $align,
  $justify,
  className,
  style,
  children,
  ...rest
}) => {
  const dyn: React.CSSProperties = {};
  if ($gap) dyn.gap = $gap;
  if ($align) dyn.alignItems = $align;
  if ($justify) dyn.justifyContent = $justify;
  return (
    <div className={cx(styles.inline, className)} style={{ ...dyn, ...style }} {...rest}>
      {children}
    </div>
  );
};

export const ActionsRow = makeDiv(styles.actionsRow, 'ActionsRow');

export const Divider: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className, ...rest }) => (
  <hr className={cx(styles.divider, className)} {...rest} />
);

export const SectionHeading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...rest
}) => (
  <h3 className={cx(styles.sectionHeading, className)} {...rest}>
    {children}
  </h3>
);

export const Code: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({
  className,
  children,
  ...rest
}) => (
  <pre className={cx(styles.code, className)} {...rest}>
    {children}
  </pre>
);
