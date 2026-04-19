import React from 'react';
import styles from './Input.module.scss';

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx(styles.input, className)} {...rest} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cx(styles.textarea, className)} {...rest} />;
});

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  as?: 'label' | 'div' | 'span';
}

export const Label: React.FC<LabelProps> = ({ as = 'label', className, children, ...rest }) => {
  const Tag = as as 'label';
  return (
    <Tag className={cx(styles.label, className)} {...rest}>
      {children}
    </Tag>
  );
};

export const FieldRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cx(styles.fieldRow, className)} {...rest}>
    {children}
  </div>
);

export const FieldStack: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cx(styles.fieldStack, className)} {...rest}>
    {children}
  </div>
);

export const FormError: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  children,
  ...rest
}) => (
  <span className={cx(styles.formError, className)} {...rest}>
    {children}
  </span>
);
