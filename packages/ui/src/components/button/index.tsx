import { Button as BaseButton } from '@base-ui/react/button';
import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';

export type ButtonVariant = 'primary' | 'neutral' | 'ghost' | 'danger';

export interface ButtonProps extends BaseButton.Props {
  /** `primary` for the one action a view exists for, `neutral` for the rest, `ghost` in toolbars, `danger` to confirm a destructive action. */
  variant?: ButtonVariant;
  size?: Size;
  /** A Lucide element, before the label. With no children the button is square and needs `aria-label`. */
  icon?: IconElement;
  /** A Lucide element after the label, such as a chevron or an arrow that says where the action leads. */
  iconEnd?: IconElement;
  /** Ignores presses immediately; after 300ms, shows a Spinner without changing width. */
  loading?: boolean;
  /** The accessible name while loading, such as "Saving". */
  loadingLabel?: string;
  children?: ReactNode;
}

export interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: Size;
  /** A square button with only an icon. */
  iconOnly?: boolean;
}

/**
 * The classes that make an element look like a Button. Use them on a link
 * that should look like an action: `<a className={buttonClasses({ variant: 'primary' })} href="/start">`.
 */
export function buttonClasses({ variant = 'neutral', size = 'md', iconOnly = false }: ButtonClassesOptions = {}) {
  return cx('mu-button', `mu-button-${variant}`, iconOnly && 'mu-button-icon', 'mu-base', `mu-s-${size}`, 'mu-focus', 'mu-hit');
}

/** Starts an action. A flat control with a distinct pressed fill. */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'neutral', size, icon, iconEnd, loading = false, loadingLabel, disabled, focusableWhenDisabled, className, children, ...props },
  ref,
) {
  const resolved = useSize(size);
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    if (!loading) {
      setShowSpinner(false);
      return;
    }
    const timer = setTimeout(() => setShowSpinner(true), 300);
    return () => clearTimeout(timer);
  }, [loading]);
  const loadingVisible = loading && showSpinner;
  const noLabel = children === undefined || children === null || children === false;
  const iconOnly = noLabel && (icon !== undefined || iconEnd !== undefined);
  return (
    <BaseButton
      ref={ref}
      {...props}
      {...(loading && loadingLabel ? { 'aria-label': loadingLabel } : null)}
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      data-loading-visible={loadingVisible ? '' : undefined}
      className={withClass(buttonClasses({ variant, size: resolved, iconOnly }), className)}
    >
      {icon}
      {iconOnly ? null : <span className="mu-button-label">{children}</span>}
      {iconOnly && icon !== undefined ? null : iconEnd}
      {loadingVisible ? <span className="mu-spinner" aria-hidden /> : null}
    </BaseButton>
  );
});
